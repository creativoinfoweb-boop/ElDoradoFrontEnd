import { create } from 'zustand'
import { Trade, BotStatus } from '@/types'

/** Payload setBalance (campi extra ignorati dallo store). */
interface BalanceSnapshot {
  botId?: string
  accountId?: string
  balance: number
  equity: number
  freeMargin: number
  marginUsed: number
  marginLevel: number
  timestamp: string
}

interface TradingState {
  openTrades: Trade[]
  closedTrades: Trade[]
  balance: number
  equity: number
  freeMargin: number
  marginUsed: number
  marginLevel: number
  botStatuses: Record<string, BotStatus>
  lastUpdate: string

  // Actions
  setBalance: (snapshot: BalanceSnapshot) => void
  addTrade: (trade: Trade) => void
  removeTrade: (tradeId: string) => void
  updateTrade: (tradeId: string, updates: Partial<Trade>) => void
  closeTrade: (tradeId: string, closePrice: number, pnl: number, pnlPercent: number) => void
  setBotStatus: (botId: string, status: BotStatus) => void
  updateBotStatus: (botId: string, updates: Partial<BotStatus>) => void
  setOpenTrades: (trades: Trade[]) => void
  setClosedTrades: (trades: Trade[]) => void
  clear: () => void
}

export const useTradingStore = create<TradingState>((set) => ({
  openTrades: [],
  closedTrades: [],
  balance: 0,
  equity: 0,
  freeMargin: 0,
  marginUsed: 0,
  marginLevel: 0,
  botStatuses: {},
  lastUpdate: new Date().toISOString(),

  setBalance: (snapshot: BalanceSnapshot) =>
    set({
      balance: snapshot.balance,
      equity: snapshot.equity,
      freeMargin: snapshot.freeMargin,
      marginUsed: snapshot.marginUsed,
      marginLevel: snapshot.marginLevel,
      lastUpdate: snapshot.timestamp,
    }),

  addTrade: (trade: Trade) =>
    set((state) => {
      // Evita duplicati
      if (state.openTrades.some((t) => t.id === trade.id)) {
        return state
      }
      return {
        openTrades: [...state.openTrades, trade],
        lastUpdate: new Date().toISOString(),
      }
    }),

  removeTrade: (tradeId: string) =>
    set((state) => ({
      openTrades: state.openTrades.filter((t) => t.id !== tradeId),
      lastUpdate: new Date().toISOString(),
    })),

  updateTrade: (tradeId: string, updates: Partial<Trade>) =>
    set((state) => ({
      openTrades: state.openTrades.map((t) =>
        t.id === tradeId ? { ...t, ...updates } : t
      ),
      lastUpdate: new Date().toISOString(),
    })),

  closeTrade: (tradeId: string, closePrice: number, pnl: number, pnlPercent: number) =>
    set((state) => {
      const trade = state.openTrades.find((t) => t.id === tradeId)
      if (!trade) return state

      const closedTrade = {
        ...trade,
        status: 'closed',
        closePrice,
        pnl,
        pnlPercent,
        closedAt: new Date().toISOString(),
      } as Trade

      return {
        openTrades: state.openTrades.filter((t) => t.id !== tradeId),
        closedTrades: [closedTrade, ...state.closedTrades],
        lastUpdate: new Date().toISOString(),
      }
    }),

  setBotStatus: (botId: string, status: BotStatus) =>
    set((state) => ({
      botStatuses: {
        ...state.botStatuses,
        [botId]: status,
      },
      lastUpdate: new Date().toISOString(),
    })),

  updateBotStatus: (botId: string, updates: Partial<BotStatus>) =>
    set((state) => ({
      botStatuses: {
        ...state.botStatuses,
        [botId]: {
          ...state.botStatuses[botId],
          ...updates,
        },
      },
      lastUpdate: new Date().toISOString(),
    })),

  setOpenTrades: (trades: Trade[]) =>
    set({
      openTrades: trades,
      lastUpdate: new Date().toISOString(),
    }),

  setClosedTrades: (trades: Trade[]) =>
    set({
      closedTrades: trades,
      lastUpdate: new Date().toISOString(),
    }),

  clear: () =>
    set({
      openTrades: [],
      closedTrades: [],
      balance: 0,
      equity: 0,
      freeMargin: 0,
      marginUsed: 0,
      marginLevel: 0,
      botStatuses: {},
      lastUpdate: new Date().toISOString(),
    }),
}))
