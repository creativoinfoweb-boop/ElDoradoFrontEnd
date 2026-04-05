'use client'

import { useEffect, useRef, useCallback, useState, useMemo } from 'react'
import { useTradingStore } from '@/store/trading'
import { useAuthStore } from '@/store/auth'
import type { TradeOpenedEvent, TradeClosedEvent, BalanceUpdateEvent, BotStatusEvent } from '@/types'

const WS_HTTP_BASE = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000'

/** JWT `sub` (user id) without extra /auth/me roundtrip — needed after page reload when persist has token but not user */
function getUserIdFromAccessToken(token: string | null | undefined): string | undefined {
  if (!token) return undefined
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return undefined
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
    const payload = JSON.parse(atob(padded)) as { sub?: string }
    return payload.sub
  } catch {
    return undefined
  }
}

/**
 * WebSocket verso il backend: aggiorna il trading store via `getState()` nel `onmessage`
 * così questo hook NON si sottoscrive allo store — evita re-render del layout a ogni tick WS / trade,
 * che in App Router può far “bloccare” la navigazione (es. dopo Trade aperti + polling).
 */
export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimerRef = useRef<number | null>(null)
  const shouldReconnectRef = useRef(true)
  const connectRef = useRef<() => void>(() => {})
  const maxReconnectAttempts = 10
  const [isConnected, setIsConnected] = useState(false)
  /** True dopo almeno un `onopen`: evita banner "Riconnessione" se il WS non è mai partito (backend spento / URL errato). */
  const [wasEverConnected, setWasEverConnected] = useState(false)

  const token = useAuthStore(s => s.token)
  const userIdFromStore = useAuthStore(s => s.user?.id)
  const resolvedUserId = useMemo(
    () => userIdFromStore ?? getUserIdFromAccessToken(token ?? undefined) ?? null,
    [userIdFromStore, token]
  )

  const scheduleReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) return
    reconnectAttemptsRef.current += 1

    const delay = Math.min(5000, 500 * reconnectAttemptsRef.current)
    if (reconnectTimerRef.current) {
      window.clearTimeout(reconnectTimerRef.current)
    }
    reconnectTimerRef.current = window.setTimeout(() => {
      connectRef.current()
    }, delay)
  }, [])

  const connect = useCallback(() => {
    if (!token || !resolvedUserId) return

    try {
      shouldReconnectRef.current = true
      if (wsRef.current) {
        shouldReconnectRef.current = false
        wsRef.current.onclose = null
        wsRef.current.close()
        wsRef.current = null
        shouldReconnectRef.current = true
      }

      const base = WS_HTTP_BASE.replace(/^http/, 'ws')
      const url = `${base}/ws/${resolvedUserId}?token=${encodeURIComponent(token)}`
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        reconnectAttemptsRef.current = 0
        setWasEverConnected(true)
        setIsConnected(true)
      }

      ws.onclose = () => {
        setIsConnected(false)
        if (shouldReconnectRef.current) {
          scheduleReconnect()
        }
      }

      ws.onerror = () => {
        setIsConnected(false)
      }

      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data)
          const type = msg?.type || msg?.event || msg?.event_type
          const data = msg?.data ?? msg

          const { addTrade, closeTrade, setBalance, setBotStatus } = useTradingStore.getState()

          if (type === 'trade_opened') {
            const e = data as TradeOpenedEvent
            addTrade({
              id: e.data.tradeId,
              botId: '',
              accountId: '',
              ticket: e.data.ticket,
              symbol: e.data.symbol,
              tradeType: e.data.tradeType,
              entryPrice: e.data.entryPrice,
              entryTime: new Date().toISOString(),
              quantity: e.data.quantity,
              stopLoss: e.data.stopLoss,
              takeProfit: e.data.takeProfit,
              status: 'open',
            })
          } else if (type === 'trade_closed') {
            const e = data as TradeClosedEvent
            closeTrade(e.data.tradeId, e.data.closePrice, e.data.pnl, e.data.pnlPercent)
          } else if (type === 'balance_update') {
            const e = data as BalanceUpdateEvent
            setBalance({
              botId: '',
              accountId: e.data.accountId,
              balance: e.data.balance,
              equity: e.data.equity,
              freeMargin: e.data.freeMargin,
              marginUsed: e.data.marginUsed,
              marginLevel: 0,
              timestamp: new Date().toISOString(),
            })
          } else if (type === 'bot_status') {
            const e = data as BotStatusEvent
            setBotStatus(e.data.botId, {
              botId: e.data.botId,
              status: e.data.status,
              uptime: e.data.uptime,
              lastSignalAt: e.data.lastSignalAt,
              processedSignals: 0,
            })
          }
        } catch {
          // ignore
        }
      }
    } catch {
      setIsConnected(false)
      scheduleReconnect()
    }
  }, [token, resolvedUserId, scheduleReconnect])

  connectRef.current = connect

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false
    if (reconnectTimerRef.current) {
      window.clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
    if (wsRef.current) {
      const ws = wsRef.current
      ws.onclose = null
      ws.close()
      wsRef.current = null
    }
    setIsConnected(false)
  }, [])

  const emit = useCallback((event: string, data?: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: event, data }))
    }
  }, [])

  useEffect(() => {
    if (!token || !resolvedUserId) {
      setWasEverConnected(false)
      disconnect()
      return
    }
    connect()
    return () => {
      disconnect()
    }
  }, [token, resolvedUserId, connect, disconnect])

  return {
    socket: wsRef.current,
    isConnected,
    /** Mostra banner solo se c’era una connessione e ora è caduta */
    showReconnectBanner: wasEverConnected && !isConnected,
    emit,
  }
}
