'use client'

const n = (v: any, fallback = 0): number => parseFloat(String(v ?? fallback)) || fallback

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { signalsApi } from '@/lib/api'
import { PendingSignal } from '@/types'
import {
  Radio, TrendingUp, AlertCircle,
  RefreshCw, Clock, ArrowUpRight, ArrowDownRight, Zap,
} from 'lucide-react'

function DirectionBadge({ dir }: { dir: 'BUY' | 'SELL' | string }) {
  const isBuy = dir === 'BUY'
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
      style={{
        background: isBuy ? 'var(--green-subtle)' : 'var(--red-subtle)',
        border: `1px solid color-mix(in srgb, ${isBuy ? 'var(--green)' : 'var(--red)'} 35%, transparent)`,
        color: isBuy ? 'var(--green)' : 'var(--red)',
      }}
    >
      {isBuy ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {dir}
    </span>
  )
}

function SignalCard({ signal, idx }: { signal: PendingSignal; idx: number }) {
  const isBuy = signal.direction === 'BUY'
  const accent = isBuy ? 'var(--green)' : 'var(--red)'
  return (
    <div className="card-premium p-5 animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
      <div className="absolute top-0 left-6 right-6 h-px"
        style={{ background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${accent} 50%, transparent), transparent)` }} />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
            style={{
              background: `color-mix(in srgb, ${accent} 12%, transparent)`,
              border: `1px solid color-mix(in srgb, ${accent} 22%, transparent)`,
              color: accent,
            }}>
            {signal.symbol?.slice(0, 3)}
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{signal.symbol}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: 'var(--gold)', boxShadow: '0 0 6px color-mix(in srgb, var(--gold) 80%, transparent)' }} />
              <span className="text-[10px] font-medium" style={{ color: 'var(--gold)' }}>PENDING</span>
            </div>
          </div>
        </div>
        <DirectionBadge dir={signal.direction} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Entry',       value: n(signal.entry_price).toFixed(2), color: 'var(--text-primary)' },
          { label: 'Stop Loss',   value: n(signal.sl).toFixed(2),          color: 'var(--red)'   },
          { label: 'Take Profit', value: n(signal.tp).toFixed(2),          color: 'var(--green)' },
        ].map(item => (
          <div key={item.label} className="text-center rounded-lg py-2.5 px-2"
            style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)' }}>
            <div className="text-sm font-bold font-mono number-mono" style={{ color: item.color }}>{item.value}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LiveTradingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [signals, setSignals] = useState<PendingSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const fetchSignals = async () => {
    try {
      const res = await signalsApi.getLiveSignals()
      setSignals(res.data)
      setLastUpdate(new Date())
    } catch (_) {}
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return }
    fetchSignals()
    const iv = setInterval(fetchSignals, 5000)
    return () => clearInterval(iv)
  }, [isAuthenticated, router])

  const [livePrice] = useState(2341.50)

  if (loading) return (
    <div className="p-6 space-y-5">
      <div className="skeleton h-10 w-48 rounded-xl" />
      <div className="skeleton h-20 rounded-2xl" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-44 rounded-2xl" />)}
      </div>
    </div>
  )

  return (
    <div className="p-5 sm:p-6 space-y-5 max-w-[1400px]">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Live Trading</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Segnali in tempo reale · Aggiornamento ogni 5s</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchSignals}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <RefreshCw className="w-3.5 h-3.5" />
            Aggiorna
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--green-subtle)', border: '1px solid color-mix(in srgb, var(--green) 28%, transparent)', color: 'var(--green)' }}>
            <Radio className="w-4 h-4 animate-pulse" />
            EA Connesso
          </div>
        </div>
      </div>

      {/* Live price bar */}
      <div className="rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap"
        style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
            style={{ background: 'var(--gold-subtle)', border: '1px solid var(--border-gold)', color: 'var(--gold)' }}>
            Au
          </div>
          <div>
            <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>XAU/USD · Spot</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono number-mono" style={{ color: 'var(--text-primary)' }}>
                {livePrice.toFixed(2)}
              </span>
              <span className="text-xs font-semibold" style={{ color: 'var(--green)' }}>+0.82%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {[
            { label: 'High', value: '2,358.40', color: 'var(--green)' },
            { label: 'Low',  value: '2,321.10', color: 'var(--red)'   },
            { label: 'Bid',  value: (livePrice - 0.30).toFixed(2), color: 'var(--text-primary)' },
            { label: 'Ask',  value: (livePrice + 0.30).toFixed(2), color: 'var(--text-primary)' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <div className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
              <div className="text-sm font-bold font-mono number-mono" style={{ color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <Clock className="w-3.5 h-3.5" />
          {lastUpdate.toLocaleTimeString('it-IT')}
        </div>
      </div>

      {/* Stats row — gold + green + red only */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Segnali Attivi',  value: String(signals.length),                                         color: 'var(--gold)',  icon: Zap          },
          { label: 'BUY Aperti',      value: String(signals.filter(s => s.direction === 'BUY').length),       color: 'var(--green)', icon: ArrowUpRight   },
          { label: 'SELL Aperti',     value: String(signals.filter(s => s.direction === 'SELL').length),      color: 'var(--red)',   icon: ArrowDownRight },
          { label: 'Win Rate Oggi',   value: '71%',                                                           color: 'var(--gold)',  icon: TrendingUp     },
        ].map(item => (
          <div key={item.label} className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `color-mix(in srgb, ${item.color} 12%, transparent)`,
                border: `1px solid color-mix(in srgb, ${item.color} 22%, transparent)`,
              }}>
              <item.icon className="w-4 h-4" style={{ color: item.color }} />
            </div>
            <div>
              <div className="text-xl font-black font-mono number-mono" style={{ color: item.color }}>{item.value}</div>
              <div className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Signals */}
      {signals.length === 0 ? (
        <div className="rounded-2xl p-12 text-center"
          style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--gold-subtle)', border: '1px solid var(--border-gold)' }}>
            <AlertCircle className="w-7 h-7 opacity-60" style={{ color: 'var(--gold)' }} />
          </div>
          <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Nessun Trade Aperto</h3>
          <p className="text-sm max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Il sistema sta monitorando il mercato XAU/USD. I segnali appariranno qui non appena il master trader aprirà una posizione.
          </p>
          <div className="flex items-center gap-2 justify-center mt-4">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: 'var(--gold)', boxShadow: '0 0 6px color-mix(in srgb, var(--gold) 80%, transparent)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--gold)' }}>Monitoraggio attivo · XAU/USD 24/5</span>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {signals.map((signal, idx) => (
            <SignalCard key={signal.id} signal={signal} idx={idx} />
          ))}
        </div>
      )}
    </div>
  )
}
