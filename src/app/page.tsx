'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useAuthStore } from '@/store/auth'
import Link from 'next/link'
import {
  ChevronDown,
  TrendingUp,
  Shield,
  Zap,
  Clock,
  BarChart3,
  Lock,
  Check,
  Star,
  ArrowRight,
  Activity,
  Globe,
  Layers,
  Award,
  Sun,
  Moon,
} from 'lucide-react'
import { PricingPlanCard } from '@/components/pricing/PricingPlanCard'

/* ─── Animated counter ─────────────────────────────────── */
function AnimatedCounter({ to, suffix = '', duration = 1500 }: { to: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(ease * to))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [to, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

/* ─── Ticker fallback ──────────────────────────────────── */
const tickerFallback = [
  { symbol: 'XAU/USD', price_str: '—', change_str: '...', up: true },
  { symbol: 'EUR/USD', price_str: '—', change_str: '...', up: true },
  { symbol: 'BTC/USD', price_str: '—', change_str: '...', up: false },
  { symbol: 'GBP/USD', price_str: '—', change_str: '...', up: true },
  { symbol: 'USD/JPY', price_str: '—', change_str: '...', up: false },
]

/* ─── FAQ items ───────────────────────────────────────── */
const faqItems = [
  {
    id: 'how-works',
    question: 'Come funziona il copy trading?',
    answer: 'Registrati, inserisci le credenziali del tuo conto MT5 nel pannello Account, e il gioco è fatto. Il nostro server si collega direttamente al tuo broker e copia ogni trade in automatico — senza che tu debba aprire MT5, installare nulla o avere Windows.',
  },
  {
    id: 'safety',
    question: 'Il mio account è al sicuro?',
    answer: 'Sì. Le tue credenziali MT5 vengono cifrate con Fernet AES-128 prima di essere salvate nel database. Non le leggiamo mai in chiaro. I pagamenti vengono gestiti da Stripe — non salviamo mai i dati della tua carta.',
  },
  {
    id: 'mt5-needed',
    question: 'Devo avere MT5 aperto sul mio computer?',
    answer: 'No. Il copy trading avviene 100% lato server. Non serve MT5 sul tuo PC, non serve Windows, non serve nessun EA da installare. Hai bisogno solo di un conto MT5 attivo presso un broker — tutto il resto lo facciamo noi.',
  },
  {
    id: 'trades-per-day',
    question: 'Quanti trade al giorno?',
    answer: "In media 1-4 trade al giorno, solo su setup confermati e ad alta probabilità su XAU/USD (Oro). L'operatività è dalle 10:30 alle 14:00. La qualità è sempre prioritaria rispetto alla quantità.",
  },
  {
    id: 'cancel',
    question: 'Posso cancellare quando voglio?',
    answer: 'Sì, cancella il tuo abbonamento in qualsiasi momento senza costi nascosti o penalità. I trade già aperti rimangono nel tuo account MT5.',
  },
  {
    id: 'broker',
    question: 'Quale broker devo usare?',
    answer: 'Qualsiasi broker MetaTrader 5 che offra XAU/USD (Oro). Consigliamo broker ECN con spread bassi come Exness, IC Markets o Pepperstone per ottimizzare i risultati.',
  },
  {
    id: 'start',
    question: 'Quanto tempo ci vuole per iniziare?',
    answer: 'Circa 3 minuti: registrazione, inserisci login + password + server del tuo conto MT5 nel pannello Account. La nostra guida passo-passo ti accompagna in tutto.',
  },
]

/* ─── Features — gold-only accent palette ──────────────── */
const features = [
  {
    icon: Shield,
    title: 'Privacy Totale',
    desc: 'Le tue credenziali MT5 vengono cifrate con AES-128. Non le leggiamo mai in chiaro. I pagamenti via Stripe non toccano i nostri server.',
  },
  {
    icon: Zap,
    title: 'Esecuzione Istantanea',
    desc: 'Ogni segnale viene trasmesso in meno di 100ms. Nessun ritardo, nessuna latenza, nessuna slippage artificiale.',
  },
  {
    icon: BarChart3,
    title: 'Performance Trasparenti',
    desc: 'Statistiche complete in tempo reale. Win rate, profit factor e storico completo sempre visibili prima di abbonarti.',
  },
  {
    icon: Clock,
    title: '24/5 Trading',
    desc: 'Accedi ai mercati del gold dal lunedì al venerdì, 24 ore su 24. Operatività massima senza che tu faccia nulla.',
  },
  {
    icon: TrendingUp,
    title: 'Risk Management',
    desc: 'Risk consigliato 1-3% per trade. Stop loss e take profit su ogni segnale trasmesso automaticamente.',
  },
  {
    icon: Layers,
    title: 'Nessun Vincolo',
    desc: 'Cancella quando vuoi. Nessun lock-in, nessun costo nascosto. La libertà è tua, sempre.',
  },
]

/* ─── Stats ─────────────────────────────────────────────── */
const stats = [
  { value: 847, suffix: '', label: 'Trade Eseguiti', isGold: true },
  { value: 71, suffix: '%', label: 'Win Rate', isGold: false },
  { value: 24, suffix: 'x', label: 'Profit Factor ×10', isGold: true },
  { value: 3, suffix: '.2h', label: 'Durata Media Trade', isGold: true },
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/* ─── Main Component ───────────────────────────────────── */
export default function LandingPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { isAuthenticated } = useAuthStore()
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [tickerItems, setTickerItems] = useState(tickerFallback)
  const [goldPrice, setGoldPrice] = useState<{ price: number | null; change_str: string; up: boolean }>({
    price: null, change_str: '...', up: true,
  })
  const isDark = theme !== 'light'

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard')
  }, [isAuthenticated, router])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const [tickerRes, goldRes] = await Promise.all([
          fetch(`${API_URL}/market/prices`).then(r => r.ok ? r.json() : null),
          fetch(`${API_URL}/market/gold-price`).then(r => r.ok ? r.json() : null),
        ])
        if (tickerRes) setTickerItems(tickerRes)
        if (goldRes?.price) setGoldPrice({ price: goldRes.price, change_str: goldRes.change_str, up: goldRes.up })
      } catch (_) {}
    }
    fetchPrices()
    const interval = setInterval(fetchPrices, 60_000)
    return () => clearInterval(interval)
  }, [])

  if (isAuthenticated) return null

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>

      {/* ── Gold top rule ── */}
      <div className="fixed top-0 w-full h-[2px] z-[60]"
        style={{ background: 'linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-dark))' }} />

      {/* ─── Navigation ─────────────────────────────────── */}
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-500"
        style={scrolled ? {
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(32px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
          borderBottom: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-lg)',
        } : { background: 'transparent' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/eldorado.jpg" alt="El Dorado" className="gold-avatar-ring" style={{ width: 34, height: 34 }} />
            <div>
              <span className="text-base font-semibold" style={{ fontFamily: 'var(--font-brand)', letterSpacing: '0.12em', background: 'linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-dark))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>El Dorado</span>
              <div className="text-[9px] font-medium tracking-widest uppercase leading-none mt-0.5" style={{ color: 'var(--text-muted)' }}>Copy Trading</div>
            </div>
          </div>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Come Funziona', href: '#how' },
              { label: 'Performance', href: '#performance' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'FAQ', href: '#faq' },
            ].map((link) => (
              <a key={link.href} href={link.href}
                className="text-sm font-medium transition-all duration-200 hover:opacity-100"
                style={{ color: 'var(--text-secondary)', opacity: 0.85 }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="theme-toggle hidden sm:inline-flex"
              title={isDark ? 'Modalità chiara' : 'Modalità scura'}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            <Link href="/auth/login" className="hidden sm:inline-flex btn-ghost text-sm px-4 py-2">
              Accedi
            </Link>
            <Link href="/auth/register" className="btn-gold text-sm px-5 py-2.5">
              Inizia Gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ───────────────────────────────────────── */}
      <section className="eldorado-hero">

        {/* God rays */}
        <div className="eldorado-rays">
          {[0,1,2,3,4].map(i => <div key={i} className="eldorado-ray" />)}
        </div>

        {/* Subtle scan */}
        <div className="eldorado-scanline" />

        {/* Statue */}
        <div className="eldorado-statue-wrap">
          <div className="eldorado-statue-inner">
            <div className="eldorado-halo" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/eldorado.jpg" alt="El Dorado" className="eldorado-statue-img" />
            <div className="eldorado-shimmer" />
            {[
              { bottom: '30%', left: '10%', delay: '0s', dx: '15px' },
              { bottom: '45%', left: '20%', delay: '0.8s', dx: '-10px' },
              { bottom: '60%', left: '15%', delay: '1.6s', dx: '20px' },
              { bottom: '35%', right: '10%', delay: '0.4s', dx: '-15px' },
              { bottom: '50%', right: '18%', delay: '1.2s', dx: '10px' },
              { bottom: '65%', right: '12%', delay: '2s', dx: '-20px' },
              { bottom: '25%', left: '35%', delay: '0.6s', dx: '5px' },
              { bottom: '55%', right: '32%', delay: '1.8s', dx: '-5px' },
            ].map((p, i) => (
              <div key={i} className="eldorado-particle" style={{ bottom: p.bottom, left: (p as {left?: string}).left, right: (p as {right?: string}).right, animationDelay: p.delay, animationDuration: `${3.5 + i * 0.3}s`, ['--dx' as string]: p.dx }} />
            ))}
          </div>
        </div>

        {/* Vignettes */}
        <div className="eldorado-vignette-left" />
        <div className="eldorado-vignette-right" />
        <div className="eldorado-vignette-bottom" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-end text-center px-4 pb-24 pt-[52vh] w-full">

          {/* Live badge */}
          <div className="eldorado-badge">
            <div className="live-dot" style={{ width: 6, height: 6 }} />
            Live · 12 trader attivi ora
          </div>

          {/* ── Refined title ── */}
          <div className="eldorado-title-wrap">
            <div className="eldorado-title-deco">
              <div className="eldorado-title-diamond" />
            </div>
            <h1 className="eldorado-title">El Dorado</h1>
            <div className="eldorado-title-deco">
              <div className="eldorado-title-diamond" />
            </div>
          </div>

          <p className="eldorado-subtitle mt-2 mb-9">
            Copy Trading Professionale · XAU/USD
          </p>

          {/* Live gold price */}
          <div className="inline-flex items-center gap-4 rounded-xl px-6 py-3 mb-9"
            style={{ background: 'var(--gold-subtle)', border: '1px solid var(--border-gold)', backdropFilter: 'blur(16px)' }}
          >
            <div className="live-dot" />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>XAU/USD</span>
            <span className="text-xl font-black font-mono number-mono" style={{ color: 'var(--gold)' }}>
              {goldPrice.price
                ? goldPrice.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '—'}
            </span>
            <span className="text-sm font-semibold" style={{ color: goldPrice.up ? 'var(--green)' : 'var(--red)' }}>
              {goldPrice.change_str}
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link href="/auth/register" className="btn-eldorado btn-eldorado-primary">
              Inizia 7 Giorni Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#performance" className="btn-eldorado btn-eldorado-secondary">
              Vedi Performance
              <BarChart3 className="w-5 h-5" />
            </a>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap gap-6 justify-center items-center mt-8">
            {[
              { icon: Shield, text: 'Credenziali crittografate' },
              { icon: Lock, text: 'Server-side 24/7' },
              { icon: Award, text: 'No carta richiesta' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Icon className="w-3.5 h-3.5" style={{ color: 'var(--gold)', opacity: 0.5 }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Ticker Tape ────────────────────────────────── */}
      <div className="py-3 overflow-hidden"
        style={{ borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', background: 'var(--glass-bg)', backdropFilter: 'blur(20px)' }}
      >
        <div className="ticker-content gap-8">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="inline-flex items-center gap-3 px-6 flex-shrink-0">
              <span className="text-xs font-bold tracking-wider" style={{ color: 'var(--text-secondary)' }}>{item.symbol}</span>
              <span className="text-sm font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{item.price_str}</span>
              <span className="text-xs font-semibold" style={{ color: item.up ? 'var(--green)' : 'var(--red)' }}>
                {item.change_str}
              </span>
              <span className="mx-2 select-none" style={{ color: 'var(--border)' }}>│</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Stats Section ──────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div key={stat.label} className="card-premium p-6 sm:p-8 text-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`text-4xl sm:text-5xl font-black font-mono number-mono mb-2 ${stat.isGold ? 'text-gradient-gold' : 'text-gradient-green'}`}>
                <AnimatedCounter to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ───────────────────────────────── */}
      <section id="how" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--surface-overlay)' }} />
        <div className="absolute inset-0 grid-bg-sm opacity-20 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-label mb-3">Processo</div>
            <h2 className="text-3xl sm:text-4xl font-black text-gradient-white mb-4">
              Operativo in 3 Minuti
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Niente da installare. Solo credenziali MT5 — il nostro server fa tutto il resto.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-12 left-[calc(33.33%+1.5rem)] right-[calc(33.33%+1.5rem)] h-px"
              style={{ background: 'linear-gradient(90deg, transparent, var(--border-gold), transparent)' }} />

            {[
              {
                num: '01', icon: Globe,
                title: 'Registrati',
                desc: 'Crea il tuo account in 60 secondi. Nessuna carta di credito richiesta per il trial gratuito.',
              },
              {
                num: '02', icon: Layers,
                title: 'Collega il tuo MT5',
                desc: 'Inserisci login, password e server del tuo conto MT5 nel pannello Account. Niente da scaricare.',
              },
              {
                num: '03', icon: Activity,
                title: 'Copia i Trade',
                desc: 'Il tuo account inizia a copiare ogni segnale automaticamente. Tutto trasparente, tutto controllato.',
              },
            ].map((step, i) => (
              <div key={i} className="card-premium p-8 animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="flex items-start justify-between mb-6">
                  <div className="feature-icon-wrap">
                    <step.icon className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                  </div>
                  <span className="text-4xl font-black font-mono" style={{ opacity: 0.12, color: 'var(--gold)' }}>{step.num}</span>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Performance Section ────────────────────────── */}
      <section id="performance" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-label mb-3">Track Record</div>
            <h2 className="text-3xl sm:text-4xl font-black text-gradient-white mb-4">
              Performance Master Verificate
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Dati reali, aggiornati in tempo reale. Nessuna promessa, solo risultati verificabili.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Chart */}
            <div className="lg:col-span-3 card-premium p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Equity Curve</h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Ultimi 12 mesi — XAU/USD</p>
                </div>
                <span className="badge-success">+847 pips</span>
              </div>

              <svg viewBox="0 0 560 200" className="w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--green)" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="lineGrad2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--green)" />
                    <stop offset="100%" stopColor="var(--green)" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
                {[50, 100, 150].map(y => (
                  <line key={y} x1="0" y1={y} x2="560" y2={y} stroke="var(--border)" strokeWidth="1" />
                ))}
                <path d="M0,180 L46,170 L93,160 L140,155 L186,145 L233,148 L280,130 L326,120 L373,115 L420,100 L466,90 L513,75 L560,65 L560,200 L0,200 Z" fill="url(#perfGrad)" />
                <path d="M0,180 L46,170 L93,160 L140,155 L186,145 L233,148 L280,130 L326,120 L373,115 L420,100 L466,90 L513,75 L560,65" fill="none" stroke="url(#lineGrad2)" strokeWidth="2.5" className="sparkline" />
                <circle cx="560" cy="65" r="5" fill="var(--green)" opacity="0.8" />
                <circle cx="560" cy="65" r="10" fill="var(--green)" opacity="0.12" />
              </svg>

              <div className="flex justify-between mt-2 px-1">
                {['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'].map(m => (
                  <span key={m} className="text-[9px] font-medium" style={{ color: 'var(--text-muted)' }}>{m}</span>
                ))}
              </div>
            </div>

            {/* Stats — gold/green/red only */}
            <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-4">
              {[
                { label: 'Win Rate', value: '71%', sub: '601 / 847 trades', color: 'var(--green)', icon: TrendingUp },
                { label: 'Profit Factor', value: '2.4', sub: 'Profitti / Perdite', color: 'var(--gold)', icon: BarChart3 },
                { label: 'Avg Duration', value: '3.2h', sub: 'Per trade chiuso', color: 'var(--gold)', icon: Clock },
                { label: 'Max Drawdown', value: '8.3%', sub: 'Risk controllato', color: 'var(--red)', icon: Shield },
              ].map((stat) => (
                <div key={stat.label} className="card-premium p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `color-mix(in srgb, ${stat.color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${stat.color} 25%, transparent)` }}
                  >
                    <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl font-black font-mono number-mono" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-xs font-medium truncate" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
                    <div className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{stat.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs italic mt-8" style={{ color: 'var(--text-muted)' }}>
            * Performance passate non garantiscono risultati futuri. Trading comporta rischi.
          </p>
        </div>
      </section>

      {/* ─── Features Grid ──────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--surface-overlay)' }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-label mb-3">Vantaggi</div>
            <h2 className="text-3xl sm:text-4xl font-black text-gradient-white mb-4">
              Perché El Dorado
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Una piattaforma costruita per i trader che vogliono risultati, non complicazioni.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <div key={feat.title} className="card-premium p-6 group animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="feature-icon-wrap mb-5">
                  <feat.icon className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{feat.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-label mb-3">Pricing</div>
            <h2 className="text-3xl sm:text-4xl font-black text-gradient-white mb-3">
              Un Piano, Tutto Incluso
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>Nessuna sorpresa. Nessun tier nascosto.</p>
          </div>

          <PricingPlanCard variant="landing" />
        </div>
      </section>

      {/* ─── Testimonials ────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--surface-overlay)' }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-label mb-3">Testimonianze</div>
            <h2 className="text-2xl sm:text-3xl font-black text-gradient-white">
              Cosa Dicono i Nostri Trader
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Marco R.', role: 'Trader privato', avatar: 'MR', text: 'In 3 mesi ho copiato oltre 200 trade senza perdere ore davanti allo schermo. Il setup è stato velocissimo.', stars: 5, profit: '+312 pips' },
              { name: 'Sofia L.', role: 'Investitore retail', avatar: 'SL', text: 'Finalmente un servizio dove vedo le statistiche reali prima di abbonarmi. Massima trasparenza.', stars: 5, profit: '+198 pips' },
              { name: 'Andrea M.', role: 'Part-time trader', avatar: 'AM', text: 'Il El Dorado lavora mentre io sono in ufficio. Risultati consistenti e risk management preciso.', stars: 5, profit: '+445 pips' },
            ].map((t, i) => (
              <div key={t.name} className="card-premium p-6 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4" style={{ color: 'var(--gold)' }} fill="var(--gold)" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5 italic" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--gold-subtle)', border: '1px solid var(--border-gold)' }}>
                      <span className="text-xs font-bold" style={{ color: 'var(--gold)' }}>{t.avatar}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.role}</div>
                    </div>
                  </div>
                  <span className="badge-success text-xs">{t.profit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-label mb-3">FAQ</div>
            <h2 className="text-3xl sm:text-4xl font-black text-gradient-white">
              Domande Frequenti
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className="card-premium overflow-hidden transition-all duration-300"
                style={expandedFaq === item.id ? { borderColor: 'var(--border-gold)' } : {}}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-sm sm:text-base pr-4" style={{ color: 'var(--text-primary)' }}>
                    {item.question}
                  </span>
                  <div className="flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300"
                    style={{
                      background: expandedFaq === item.id ? 'var(--gold-subtle)' : 'transparent',
                      borderColor: expandedFaq === item.id ? 'var(--border-gold)' : 'var(--border)',
                      transform: expandedFaq === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <ChevronDown className="w-4 h-4" style={{ color: expandedFaq === item.id ? 'var(--gold)' : 'var(--text-secondary)' }} />
                  </div>
                </button>

                {expandedFaq === item.id && (
                  <div className="px-5 pb-5 animate-fade-in-up">
                    <div className="divider mb-4" />
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--surface-overlay)' }} />
        <div className="absolute inset-0 grid-bg-sm opacity-15 pointer-events-none" />

        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full blur-[100px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--gold-subtle) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 rounded-full blur-[100px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--gold-subtle) 0%, transparent 70%)' }} />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="mx-auto mb-6 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/eldorado.jpg" alt="El Dorado" className="gold-avatar-ring" style={{ width: 68, height: 68 }} />
          </div>

          <h2 className="text-4xl sm:text-5xl font-black mb-5">
            <span className="text-gradient-white">Pronto a Fare Trading</span>
            <br />
            <span className="text-gradient-gold">Come un Professionista?</span>
          </h2>

          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Unisciti a centinaia di trader che già copiano i segnali di El Dorado ogni giorno.
            Il primo trial è completamente gratuito.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-gold text-base px-10 py-4 rounded-xl">
              Inizia 7 Giorni Gratis — Senza Carta
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 justify-center mt-8">
            {['No carta richiesta', 'Cancella quando vuoi', 'Setup in 3 minuti'].map(text => (
              <div key={text} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Check className="w-4 h-4" style={{ color: 'var(--green)' }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────── */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/eldorado.jpg" alt="El Dorado" className="gold-avatar-ring" style={{ width: 34, height: 34 }} />
                <div>
                  <span className="font-bold text-gradient-gold">El Dorado</span>
                  <div className="text-[9px] tracking-widest uppercase mt-0.5" style={{ color: 'var(--text-muted)' }}>Copy Trading</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                Copia il trading professionale su XAU/USD. Performance reali, privacy totale, libertà completa.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <div className="live-dot" />
                <span className="text-xs font-medium" style={{ color: 'var(--green)' }}>Sistema attivo — 24/5</span>
              </div>
            </div>

            <div>
              <h4 className="section-label mb-4">Navigazione</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Accedi', href: '/auth/login' },
                  { label: 'Registrati', href: '/auth/register' },
                  { label: 'Come Funziona', href: '#how' },
                  { label: 'Performance', href: '#performance' },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="section-label mb-4">Supporto</h4>
              <div className="space-y-3">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>support@botbosco.com</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Lun–Ven, 9:00–18:00</p>
                <div className="mt-4 p-3 rounded-xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Tempo medio di risposta</p>
                  <p className="text-sm font-semibold mt-1" style={{ color: 'var(--gold)' }}>&lt; 2 ore</p>
                </div>
              </div>
            </div>
          </div>

          <div className="divider mb-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              &copy; 2024 El Dorado. Tutti i diritti riservati.
            </p>
            <p className="text-xs text-center sm:text-right max-w-md" style={{ color: 'var(--text-muted)' }}>
              Il trading comporta rischi significativi di perdita. Le performance passate non sono garanzia di risultati futuri.
              Consulta sempre un professionista finanziario.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
