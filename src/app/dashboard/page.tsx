'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { subscriptionsApi, statsApi } from '@/lib/api'
import { SubscriptionStatus, PublicPerformance, UserStats } from '@/types'
import {
  AlertCircle,
  TrendingUp,
  Activity,
  Radio,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  BarChart3,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'

const n = (v: any, fallback = 0): number => parseFloat(String(v ?? fallback)) || fallback

/* ── Mini Sparkline ──────────────────────────────────────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 100; const h = 32
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`url(#sg-${color.replace(/[^a-z0-9]/gi, '')})`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── KPI Card ────────────────────────────────────────────── */
function KpiCard({
  label, value, sub, change, changeUp, icon: Icon, color, sparkData, delay = 0,
}: {
  label: string; value: string; sub?: string; change?: string; changeUp?: boolean;
  icon: any; color: string; sparkData?: number[]; delay?: number
}) {
  return (
    <div
      className="kpi-card animate-fade-in-up"
      style={{
        animationDelay: `${delay}ms`,
        '--kpi-color': `linear-gradient(90deg, transparent, color-mix(in srgb, ${color} 50%, transparent), transparent)`,
      } as React.CSSProperties}
    >
      <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl pointer-events-none opacity-15"
        style={{ background: color }} />

      <div className="relative flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `color-mix(in srgb, ${color} 10%, transparent)`,
            border: `1px solid color-mix(in srgb, ${color} 22%, transparent)`,
          }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        {change && (
          <div className="flex items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-full"
            style={{
              background: changeUp ? 'var(--green-subtle)' : 'var(--red-subtle)',
              color: changeUp ? 'var(--green)' : 'var(--red)',
              border: `1px solid ${changeUp ? 'color-mix(in srgb, var(--green) 25%, transparent)' : 'color-mix(in srgb, var(--red) 25%, transparent)'}`,
            }}
          >
            {changeUp ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
            {change}
          </div>
        )}
      </div>

      <div className="relative">
        <div className="text-2xl font-black font-mono number-mono" style={{ color, letterSpacing: '-0.02em' }}>
          {value}
        </div>
        <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</div>
        {sub && <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</div>}
      </div>

      {sparkData && (
        <div className="mt-3 -mx-1 opacity-70">
          <Sparkline data={sparkData} color={color} />
        </div>
      )}
    </div>
  )
}

/* ── Stat Row ────────────────────────────────────────────── */
function StatRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className="text-xs font-bold font-mono number-mono" style={{ color }}>{value}</span>
    </div>
  )
}

/* ── Quick Action ────────────────────────────────────────── */
function QuickAction({ icon: Icon, label, href, color }: { icon: any; label: string; href: string; color: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 p-3.5 rounded-xl transition-all group hover:-translate-y-1"
      style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)' }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = `color-mix(in srgb, ${color} 30%, transparent)`
        el.style.background = `color-mix(in srgb, ${color} 6%, var(--glass-bg))`
        el.style.boxShadow = `var(--shadow-md), 0 0 20px color-mix(in srgb, ${color} 8%, transparent)`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--border)'
        el.style.background = 'var(--glass-bg)'
        el.style.boxShadow = 'none'
      }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 18%, transparent)` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <span className="text-[10px] font-medium text-center transition-colors" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
    </Link>
  )
}

/* ── Main Page ───────────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null)
  const [masterStats, setMasterStats] = useState<PublicPerformance | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return }
    const fetch = async () => {
      try {
        const [subRes, masterRes, userRes] = await Promise.all([
          subscriptionsApi.getStatus(),
          statsApi.getMasterPerformance(),
          statsApi.getUserStats(),
        ])
        setSubscription(subRes.data)
        setMasterStats(masterRes.data)
        setUserStats(userRes.data)
      } catch (_) {}
      finally { setLoading(false) }
    }
    fetch()
  }, [isAuthenticated, router])

  if (loading) {
    return (
      <div className="space-y-5 p-2">
        <div className="space-y-2">
          <div className="skeleton h-7 w-48 rounded-xl" />
          <div className="skeleton h-3.5 w-64 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="skeleton lg:col-span-2 h-56 rounded-xl" />
          <div className="skeleton h-56 rounded-xl" />
        </div>
      </div>
    )
  }

  const isTrialing   = subscription?.status === 'trialing'
  const isActive     = subscription?.status === 'active'
  const hasNoSub     = subscription?.status === 'none'
  const trialExpired = subscription?.status === 'trial_expired'

  const sparkTrades  = [2,4,3,6,5,8,6,9,7,10,8,12]
  const sparkWinRate = [60,65,62,70,68,72,71,75,73,71,74,71]
  const sparkProfit  = [10,25,18,40,35,55,48,70,62,80,74,90]

  /* Reduced palette: gold, green, red only */
  const GOLD  = 'var(--gold)'
  const GREEN = 'var(--green)'
  const RED   = 'var(--red)'

  return (
    <div className="space-y-5 max-w-[1400px]">

      {/* Header */}
      <div className="flex items-start justify-between pt-1">
        <div>
          <h1 className="text-xl font-black leading-tight" style={{ color: 'var(--text-primary)' }}>
            Benvenuto,{' '}
            <span className="brand-cinzel text-base" style={{ letterSpacing: '0.12em' }}>
              {user?.full_name || 'Trader'}
            </span>
          </h1>
          <p className="text-xs mt-1 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <span>Dashboard overview</span>
            <span style={{ color: 'var(--border-light)' }}>·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: 'var(--green)', boxShadow: '0 0 8px color-mix(in srgb, var(--green) 90%, transparent)', animation: 'dotPulse 2s ease-in-out infinite' }} />
              Sistema attivo
            </span>
          </p>
        </div>
        <Link
          href="/dashboard/live-trading"
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ background: 'var(--green-subtle)', border: '1px solid color-mix(in srgb, var(--green) 28%, transparent)', color: 'var(--green)' }}
        >
          <Radio className="w-3.5 h-3.5" style={{ animation: 'dotPulse 2s ease-in-out infinite' }} />
          Live Trading
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Banners */}
      {isTrialing && (
        <Banner icon={Clock} color={GOLD}
          title="Trial Attivo"
          body={`${subscription?.days_remaining} giorni rimanenti — attiva per continuare a ricevere segnali.`}
          cta="Attiva Ora" href="/dashboard/billing" />
      )}
      {hasNoSub && (
        <Banner icon={AlertCircle} color={RED}
          title="Nessun Abbonamento"
          body="Inizia il trial gratuito di 7 giorni — nessuna carta richiesta."
          cta="Inizia Trial" href="/dashboard/billing" />
      )}
      {trialExpired && (
        <Banner icon={AlertCircle} color={GOLD}
          title="Trial Scaduto"
          body="Attiva l'abbonamento per riprendere a ricevere i segnali."
          cta="Riattiva" href="/dashboard/billing" />
      )}
      {isActive && (
        <Banner icon={Zap} color={GOLD}
          title="Completa il Setup"
          body="Genera una API Key e collega il tuo MetaTrader 5."
          cta="Setup Guide" href="/dashboard/setup-guide" />
      )}

      {/* KPI Cards — gold + green only */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Trade Copiati" value={String(userStats?.trades_copied ?? 0)}
          sub={`${userStats?.trades_executed ?? 0} eseguiti`} change="+12%" changeUp
          icon={Activity} color={GOLD} sparkData={sparkTrades} delay={0} />
        <KpiCard label="Win Rate" value={`${n(userStats?.win_rate_percent).toFixed(1)}%`}
          sub="Ultimi 30 giorni" change="+3.2%" changeUp
          icon={Target} color={GREEN} sparkData={sparkWinRate} delay={60} />
        <KpiCard label="Profit Pips" value={`+${userStats?.total_profit_pips ?? 0}`}
          sub="Totale accumulato" change="+18" changeUp
          icon={TrendingUp} color={GOLD} sparkData={sparkProfit} delay={120} />
        <KpiCard label="EA Status" value="Online" sub="Connessione stabile"
          icon={Radio} color={GREEN} delay={180} />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Performance Chart */}
        <div className="lg:col-span-2 glass-cyber rounded-xl p-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Performance Master</h2>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Track record verificato · XAU/USD
              </p>
            </div>
            <Link
              href="/dashboard/performance"
              className="flex items-center gap-1 text-[11px] font-semibold transition-colors"
              style={{ color: 'var(--gold)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--gold-light)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--gold)' }}
            >
              Dettagli <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="mb-5">
            <svg viewBox="0 0 560 120" className="w-full" preserveAspectRatio="none" style={{ height: 120 }}>
              <defs>
                <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="dashLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--gold-dark)" />
                  <stop offset="50%" stopColor="var(--gold)" />
                  <stop offset="100%" stopColor="var(--gold-light)" />
                </linearGradient>
                <filter id="lineGlow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              {[30, 60, 90].map(y => (
                <line key={y} x1="0" y1={y} x2="560" y2={y} stroke="var(--border)" strokeWidth="1" />
              ))}
              <path
                d="M0,112 L46,104 L93,98 L140,101 L186,88 L233,92 L280,76 L326,68 L373,72 L420,56 L466,48 L513,38 L560,30 L560,120 L0,120 Z"
                fill="url(#dashGrad)"
              />
              <path
                d="M0,112 L46,104 L93,98 L140,101 L186,88 L233,92 L280,76 L326,68 L373,72 L420,56 L466,48 L513,38 L560,30"
                fill="none" stroke="url(#dashLine)" strokeWidth="1.5" strokeLinecap="round" filter="url(#lineGlow)"
              />
              <circle cx="560" cy="30" r="3" fill="var(--gold-light)" />
              <circle cx="560" cy="30" r="7" fill="var(--gold)" fillOpacity="0.18" />
            </svg>
          </div>

          {/* Stats row — gold + green only */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: 'Win Rate',      value: `${n(masterStats?.win_rate_percent, 71).toFixed(1)}%`, color: 'var(--green)' },
              { label: 'Profit Factor', value: n(masterStats?.profit_factor, 2.40).toFixed(2),        color: 'var(--gold)' },
              { label: 'Totale Trade',  value: String(masterStats?.trades_total ?? 847),               color: 'var(--gold)' },
              { label: 'Durata Media',  value: `${n(masterStats?.avg_trade_duration_hours, 3.2).toFixed(1)}h`, color: 'var(--gold)' },
            ].map(s => (
              <div key={s.label} className="text-center rounded-lg py-2.5 px-2"
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)' }}>
                <div className="text-lg font-black font-mono number-mono" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[9px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-3">

          {/* Subscription */}
          <div className="glass-cyber rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
            <h3 className="text-xs font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Abbonamento</h3>

            <div className="flex items-center gap-2.5 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/eldorado.jpg" alt="El Dorado" className="gold-avatar-ring" style={{ width: 32, height: 32 }} />
              <div>
                <div className="brand-cinzel text-[9.5px] tracking-[0.16em]">EL DORADO</div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>€39 / mese</div>
              </div>
            </div>

            <div>
              <StatRow
                label="Stato"
                value={isActive ? 'Attivo' : isTrialing ? 'Trial' : 'Inattivo'}
                color={isActive ? 'var(--green)' : isTrialing ? 'var(--gold)' : 'var(--red)'}
              />
              {subscription?.days_remaining != null && (
                <StatRow label="Giorni rimasti" value={`${subscription.days_remaining}g`} color="var(--gold)" />
              )}
            </div>

            <Link
              href="/dashboard/billing"
              className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-[11px] font-semibold transition-all"
              style={{ background: 'var(--gold-subtle)', border: '1px solid var(--border-gold)', color: 'var(--gold)' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border-gold-hover)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border-gold)'
              }}
            >
              Gestisci <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Activity feed */}
          <div className="glass-cyber rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '310ms' }}>
            <h3 className="text-xs font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Attività Recente</h3>

            <div className="space-y-2.5">
              {[
                { time: '14:32', action: 'Trade BUY XAU/USD aperto',  type: 'buy'    },
                { time: '11:15', action: 'Trade chiuso +24 pips',      type: 'profit' },
                { time: '09:02', action: 'Segnale ricevuto',           type: 'signal' },
              ].map((item, i) => {
                const dotColor = item.type === 'profit' ? 'var(--green)' : 'var(--gold)'
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}` }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>{item.action}</p>
                      <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <Link
              href="/dashboard/history"
              className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-[11px] font-medium transition-all"
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--gold-subtle)'
                el.style.borderColor = 'var(--border-gold)'
                el.style.color = 'var(--gold)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--glass-bg)'
                el.style.borderColor = 'var(--border)'
                el.style.color = 'var(--text-secondary)'
              }}
            >
              Vedi storico <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions — gold + green only */}
      <div className="glass-cyber rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
        <h2 className="text-xs font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Azioni Rapide</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          <QuickAction icon={Radio}        label="Live Trading" href="/dashboard/live-trading" color="var(--green)" />
          <QuickAction icon={BarChart3}    label="Performance"  href="/dashboard/performance"  color="var(--gold)"  />
          <QuickAction icon={Activity}     label="Trade Aperti" href="/dashboard/trades"        color="var(--gold)"  />
          <QuickAction icon={TrendingUp}   label="Storico"      href="/dashboard/history"       color="var(--gold)"  />
          <QuickAction icon={Zap}          label="API Keys"     href="/dashboard/api-keys"      color="var(--gold)"  />
          <QuickAction icon={CheckCircle2} label="Setup Guide"  href="/dashboard/setup-guide"  color="var(--green)" />
        </div>
      </div>

    </div>
  )
}

/* ── Inline Banner ───────────────────────────────────────── */
function Banner({
  icon: Icon, color, title, body, cta, href,
}: { icon: any; color: string; title: string; body: string; cta: string; href: string }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl p-3.5 border animate-fade-in"
      style={{ background: `color-mix(in srgb, ${color} 8%, var(--glass-bg))`, borderColor: `color-mix(in srgb, ${color} 22%, transparent)` }}
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-xs" style={{ color }}>{title}</p>
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{body}</p>
      </div>
      <Link
        href={href}
        className="flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all"
        style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`, color }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = `color-mix(in srgb, ${color} 20%, transparent)`
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = `color-mix(in srgb, ${color} 12%, transparent)`
        }}
      >
        {cta} <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  )
}
