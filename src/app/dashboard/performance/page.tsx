'use client'

const n = (v: any, fallback = 0): number => parseFloat(String(v ?? fallback)) || fallback

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { statsApi } from '@/lib/api'
import { PublicPerformance, UserStats } from '@/types'
import {
  TrendingUp, Target, BarChart3, Clock, Activity,
  CheckCircle, XCircle,
} from 'lucide-react'

function StatCard({ label, value, sub, color, icon: Icon }: {
  label: string; value: string; sub?: string; color: string; icon: any
}) {
  return (
    <div className="kpi-card">
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-10 pointer-events-none"
        style={{ background: color }} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: `color-mix(in srgb, ${color} 15%, transparent)`,
              border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
            }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
        </div>
        <div className="text-2xl font-black font-mono number-mono mb-1" style={{ color }}>{value}</div>
        <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>
        {sub && <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</div>}
      </div>
    </div>
  )
}

function PerfBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span className="font-bold font-mono number-mono" style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, color-mix(in srgb, ${color} 60%, transparent), ${color})` }} />
      </div>
    </div>
  )
}

export default function PerformancePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [tab, setTab] = useState<'master' | 'user'>('master')
  const [masterStats, setMasterStats] = useState<PublicPerformance | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return }
    Promise.all([statsApi.getMasterPerformance(), statsApi.getUserStats()])
      .then(([m, u]) => { setMasterStats(m.data); setUserStats(u.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isAuthenticated, router])

  if (loading) return (
    <div className="p-6 space-y-5">
      <div className="skeleton h-10 w-60 rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
      </div>
      <div className="skeleton h-64 rounded-2xl" />
    </div>
  )

  const tabs = [
    { id: 'master', label: 'Master Performance' },
    { id: 'user',   label: 'La Mia Performance' },
  ] as const

  const masterCurve = [100,108,105,115,112,125,120,135,130,145,140,158]
  const userCurve   = [100,103,101,109,107,116,113,122,118,128,124,135]
  const months = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic']

  const buildPath = (data: number[], w: number, h: number) => {
    const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
    return data
      .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 10) - 5}`)
      .join(' L ')
  }

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-[1400px]">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Performance</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Analisi completa delle statistiche di trading</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl w-fit"
        style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            style={tab === t.id
              ? { background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))', color: 'var(--text-inverse)' }
              : { color: 'var(--text-secondary)' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* MASTER TAB */}
      {tab === 'master' && (
        <div className="space-y-5 animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Win Rate"      value={`${n(masterStats?.win_rate_percent, 71).toFixed(1)}%`}
              sub="Su 847 trade"    color="var(--green)" icon={Target}   />
            <StatCard label="Profit Factor" value={n(masterStats?.profit_factor, 2.40).toFixed(2)}
              sub="Profitti/Perdite" color="var(--gold)"  icon={TrendingUp} />
            <StatCard label="Totale Trade"  value={String(masterStats?.trades_total ?? 847)}
              sub="Da inizio anno"   color="var(--gold)"  icon={BarChart3} />
            <StatCard label="Durata Media"  value={`${n(masterStats?.avg_trade_duration_hours, 3.2).toFixed(1)}h`}
              sub="Per trade"        color="var(--gold)"  icon={Clock}     />
          </div>

          {/* Equity Curve */}
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Equity Curve Master</h2>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Base 100 · Ultimi 12 mesi · XAU/USD</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded" style={{ background: 'var(--gold)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Master</span>
                </div>
                <span className="badge-success text-xs">+58% YTD</span>
              </div>
            </div>

            <svg viewBox="0 0 700 200" className="w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="masterFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="masterLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--gold-dark)" />
                  <stop offset="100%" stopColor="var(--gold-light)" />
                </linearGradient>
              </defs>
              {[50, 100, 150].map(y => (
                <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="var(--border)" strokeWidth="1" />
              ))}
              <path d={`M 0,${200} L ${buildPath(masterCurve, 700, 200)} L 700,200 Z`} fill="url(#masterFill)" />
              <polyline points={buildPath(masterCurve, 700, 200)}
                fill="none" stroke="url(#masterLine)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {masterCurve.map((_, i) => {
                const pts = buildPath(masterCurve, 700, 200).split(' L ')
                const [x, y] = pts[i]?.split(',').map(Number) ?? [0, 0]
                return <circle key={i} cx={x} cy={y} r="3" fill="var(--gold-light)" opacity="0.7" />
              })}
            </svg>

            <div className="flex justify-between mt-2 px-1">
              {months.map(m => <span key={m} className="text-[9px] font-medium" style={{ color: 'var(--text-muted)' }}>{m}</span>)}
            </div>
          </div>

          {/* Monthly breakdown */}
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="card-premium p-5">
              <h3 className="font-bold text-sm mb-5" style={{ color: 'var(--text-primary)' }}>Distribuzione Mesi</h3>
              <div className="space-y-3">
                {months.map((m, i) => {
                  const profits = [+8, +5, -3, +10, -2, +13, -5, +15, -5, +15, -5, +18]
                  const p = profits[i]
                  return (
                    <div key={m} className="flex items-center gap-3">
                      <span className="text-xs font-medium w-8" style={{ color: 'var(--text-secondary)' }}>{m}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
                        <div className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.abs(p) / 20 * 100}%`,
                            background: p > 0 ? 'linear-gradient(90deg, var(--green), color-mix(in srgb, var(--green) 70%, var(--gold)))' : 'linear-gradient(90deg, color-mix(in srgb, var(--red) 70%, transparent), var(--red))',
                            marginLeft: p < 0 ? 'auto' : undefined,
                          }} />
                      </div>
                      <span className="text-xs font-bold font-mono number-mono w-10 text-right"
                        style={{ color: p > 0 ? 'var(--green)' : 'var(--red)' }}>
                        {p > 0 ? '+' : ''}{p}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="card-premium p-5">
              <h3 className="font-bold text-sm mb-5" style={{ color: 'var(--text-primary)' }}>Metriche Avanzate</h3>
              <div className="space-y-4">
                <PerfBar label="Win Rate"        value={71}  max={100} color="var(--green)" />
                <PerfBar label="Profit Factor"   value={2.4} max={5}   color="var(--gold)"  />
                <PerfBar label="Recovery Factor" value={3.1} max={5}   color="var(--gold)"  />
                <PerfBar label="Sharpe Ratio"    value={1.8} max={3}   color="var(--gold)"  />
                <PerfBar label="Max DD %"        value={8.3} max={20}  color="var(--red)"   />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER TAB */}
      {tab === 'user' && (
        <div className="space-y-5 animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="Trade Copiati"  value={String(userStats?.trades_copied  ?? 0)} color="var(--gold)"  icon={Activity}     />
            <StatCard label="Trade Eseguiti" value={String(userStats?.trades_executed ?? 0)} color="var(--green)" icon={CheckCircle}   />
            <StatCard label="Trade Falliti"  value={String(userStats?.trades_failed   ?? 0)} color="var(--red)"   icon={XCircle}       />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="Win Rate"      value={`${n(userStats?.win_rate_percent).toFixed(1)}%`}
              sub="Personale"    color="var(--green)" icon={Target}    />
            <StatCard label="Profit Medio"  value={`+${n(userStats?.avg_profit_per_trade).toFixed(1)} pips`}
              sub="Per trade"    color="var(--gold)"  icon={TrendingUp} />
            <StatCard label="Profit Totale" value={`+${userStats?.total_profit_pips ?? 0} pips`}
              sub="Accumulato"   color="var(--gold)"  icon={BarChart3}  />
          </div>

          {/* User equity curve */}
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>La Tua Equity Curve</h2>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Base 100 · Ultimi 12 mesi</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded" style={{ background: 'var(--green)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Il Tuo Account</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded opacity-40" style={{ background: 'var(--gold)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Master</span>
                </div>
              </div>
            </div>

            <svg viewBox="0 0 700 200" className="w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="userFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--green)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[50, 100, 150].map(y => (
                <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="var(--border)" strokeWidth="1" />
              ))}
              <polyline points={buildPath(masterCurve, 700, 200)}
                fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" strokeDasharray="6 4" />
              <path d={`M 0,${200} L ${buildPath(userCurve, 700, 200)} L 700,200 Z`} fill="url(#userFill)" />
              <polyline points={buildPath(userCurve, 700, 200)}
                fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className="flex justify-between mt-2 px-1">
              {months.map(m => <span key={m} className="text-[9px] font-medium" style={{ color: 'var(--text-muted)' }}>{m}</span>)}
            </div>
          </div>

          {/* Execution quality */}
          <div className="card-premium p-5">
            <h3 className="font-bold text-sm mb-5" style={{ color: 'var(--text-primary)' }}>Qualità Esecuzione</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Eseguiti', value: userStats?.trades_executed ?? 0, total: userStats?.trades_copied ?? 1, color: 'var(--green)' },
                { label: 'Falliti',  value: userStats?.trades_failed   ?? 0, total: userStats?.trades_copied ?? 1, color: 'var(--red)'   },
                { label: 'Skip',     value: (userStats?.trades_copied ?? 0) - (userStats?.trades_executed ?? 0) - (userStats?.trades_failed ?? 0),
                  total: userStats?.trades_copied ?? 1, color: 'var(--text-secondary)' },
              ].map(item => {
                const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0
                return (
                  <div key={item.label} className="rounded-xl p-4"
                    style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)' }}>
                    <div className="text-2xl font-black font-mono number-mono mb-1" style={{ color: item.color }}>{pct}%</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.label}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.value} trade</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
