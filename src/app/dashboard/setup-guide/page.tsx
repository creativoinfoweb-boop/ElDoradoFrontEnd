'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import {
  CheckCircle2, ChevronRight, ChevronLeft, Zap,
  Wifi, Check, Shield, Database, CreditCard, Lock, Server, User,
  AlertCircle,
} from 'lucide-react'

const steps = [
  { num: 1, title: 'Abbonamento', icon: CreditCard, color: '#F0B429',  desc: 'Verifica che la tua subscription sia attiva' },
  { num: 2, title: 'Account MT5', icon: Database,   color: '#00C2FF',  desc: 'Inserisci le credenziali del tuo conto broker' },
  { num: 3, title: 'Sicurezza',   icon: Shield,     color: '#9B5DE5',  desc: 'Come proteggiamo i tuoi dati' },
  { num: 4, title: 'Pronto!',     icon: Zap,        color: '#00E676',  desc: 'Il copy trading è attivo — zero azioni richieste' },
]

function StepInstruction({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
        style={{ background: 'rgba(240,180,41,0.15)', border: '1px solid rgba(240,180,41,0.25)', color: '#F0B429' }}
      >
        {n}
      </div>
      <span className="text-sm text-[var(--text-secondary)] leading-relaxed">{text}</span>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
      <span className="text-xs text-[var(--text-secondary)]">{label}</span>
      <span className="text-xs font-semibold text-[var(--text-primary)]">{value}</span>
    </div>
  )
}

export default function SetupGuidePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login')
  }, [isAuthenticated, router])

  const currentStep = steps[step - 1]

  return (
    <div className="p-5 sm:p-6 max-w-3xl space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--text-primary)]">Setup Guide</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Inizia a copiare i trade in 4 semplici passaggi — nessun software da installare
        </p>
      </div>

      {/* Banner "niente da installare" */}
      <div
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.15)' }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(0,230,118,0.12)' }}>
          <CheckCircle2 className="w-5 h-5 text-[#00E676]" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#00E676]">100% Server-side — niente da scaricare</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Non serve MT5 sul tuo computer, non serve Windows, non serve nessun EA.
            I tuoi trade vengono gestiti dai nostri server 24/7.
          </p>
        </div>
      </div>

      {/* ── Stepper ───────────────────────────────── */}
      <div className="card-premium p-5">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {steps.map((s, i) => {
            const done   = step > s.num
            const active = step === s.num
            const Icon   = s.icon
            return (
              <div key={s.num} className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setStep(s.num)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200"
                  style={
                    active
                      ? { background: `${s.color}15`, border: `1px solid ${s.color}30`, color: s.color }
                      : done
                      ? { background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.15)', color: '#00E676' }
                      : { background: 'transparent', border: '1px solid transparent', color: 'var(--text-muted)' }
                  }
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: done ? 'rgba(0,230,118,0.15)' : active ? `${s.color}20` : 'var(--surface-2)',
                    }}
                  >
                    {done
                      ? <Check className="w-3.5 h-3.5 text-[#00E676]" />
                      : <Icon className="w-3 h-3" />
                    }
                  </div>
                  <span className="text-xs font-semibold hidden sm:block">{s.title}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className="w-4 h-px flex-shrink-0"
                    style={{ background: step > s.num ? 'rgba(0,230,118,0.3)' : 'var(--border)' }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 rounded-full overflow-hidden bg-[var(--surface-2)]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((step - 1) / (steps.length - 1)) * 100}%`,
              background: 'linear-gradient(90deg, #C8931A, #F0B429, #FFD166)',
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
          <span>Inizio</span>
          <span>Step {step} / {steps.length}</span>
          <span>Completato</span>
        </div>
      </div>

      {/* ── Step Content ──────────────────────────── */}
      <div className="card-premium p-6 animate-fade-in min-h-[320px]">
        {/* Step header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${currentStep.color}12`, border: `1px solid ${currentStep.color}20` }}
          >
            <currentStep.icon className="w-6 h-6" style={{ color: currentStep.color }} />
          </div>
          <div>
            <h2 className="text-lg font-black text-[var(--text-primary)]">
              <span className="opacity-30 mr-1 font-mono">0{step}</span> {currentStep.title}
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">{currentStep.desc}</p>
          </div>
        </div>

        {/* ── STEP 1: Abbonamento ── */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Per usare il copy trading serve un accesso attivo (trial o pagamento). Nella pagina abbonamento puoi:{' '}
              <strong className="text-[var(--text-primary)]">avviare 7 giorni gratis</strong> senza carta, oppure{' '}
              <strong className="text-[var(--text-primary)]">pagare subito</strong> con Stripe (piano mensile promo o annuale).
            </p>

            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(240,180,41,0.15)' }}>
              <div className="px-4 py-2 text-xs font-bold text-[#F0B429]"
                style={{ background: 'rgba(240,180,41,0.08)' }}>
                Piano El Dorado
              </div>
              <div className="px-4 py-3 space-y-0">
                <InfoRow label="Trial gratuito" value="7 giorni" />
                <InfoRow label="Prezzo mensile" value="€39 / mese" />
                <InfoRow label="Strumento" value="XAU/USD (Oro)" />
                <InfoRow label="Segnali al giorno" value="1–4 trade" />
                <InfoRow label="Risk management" value="1% per trade (fisso)" />
                <InfoRow label="Orario operativo" value="10:30 – 14:00" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                onClick={() => router.push('/dashboard/billing')}
                className="btn-gold px-6 py-3 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Apri abbonamento e pagamenti
              </button>
              <p className="text-xs text-[var(--text-muted)] sm:max-w-[200px]">
                Lì trovi trial, checkout mensile/annuale e coupon. Cancella quando vuoi.
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 2: Account MT5 ── */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Inserisci le credenziali del tuo conto MT5 nel pannello <strong className="text-[var(--text-primary)]">Account</strong>.
              Il nostro server si collegherà direttamente al tuo broker e copierà i trade in automatico — senza che tu debba fare nulla.
            </p>

            <div className="space-y-3">
              <StepInstruction n={1} text='Vai su Dashboard → Account MT5 (oppure usa il pulsante qui sotto)' />
              <StepInstruction n={2} text='Clicca «Collega Account MT5» e compila login, password e server broker' />
              <StepInstruction n={3} text='Il nome in dashboard è opzionale: se lo lasci vuoto usiamo automaticamente «Conto + il tuo login»' />
              <StepInstruction n={4} text='In basso nel modulo premi «Salva e collega conto» (il test connessione è solo opzionale)' />
            </div>

            {/* Dove trovo le credenziali */}
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ background: 'rgba(0,194,255,0.06)', border: '1px solid rgba(0,194,255,0.15)' }}
            >
              <p className="text-xs font-semibold text-[#00C2FF]">Dove trovo le credenziali?</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Le credenziali MT5 le trovi nell&apos;email di apertura conto del tuo broker, oppure
                nel portale del broker sotto <strong className="text-[var(--text-primary)]">&quot;I miei conti&quot;</strong> o
                <strong className="text-[var(--text-primary)]"> &quot;Account Details&quot;</strong>. Il server broker si trova
                in MT5: <strong className="text-[var(--text-primary)]">File → Apri Conto → cerca il tuo broker</strong>.
              </p>
            </div>

            <div
              className="rounded-xl p-4 space-y-2"
              style={{ background: 'rgba(240,180,41,0.05)', border: '1px solid rgba(240,180,41,0.12)' }}
            >
              <p className="text-xs font-semibold text-[#F0B429]">Quale password usare?</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Usa la <strong className="text-[var(--text-primary)]">password di trading (Main Password)</strong> — quella che usi normalmente per accedere a MT5.
                Non la password investitore (Investor Password) che è sola lettura e non permette di aprire trade.
              </p>
            </div>

            <button
              onClick={() => router.push('/dashboard/accounts')}
              className="btn-gold px-6 py-2.5 rounded-xl text-sm"
            >
              <Database className="w-4 h-4" />
              Vai a Gestione Account
            </button>
          </div>
        )}

        {/* ── STEP 3: Sicurezza ── */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Le tue credenziali MT5 vengono gestite con i più alti standard di sicurezza. Ecco come le proteggiamo:
            </p>

            <div className="space-y-3">
              {[
                {
                  icon: Lock,
                  color: '#9B5DE5',
                  title: 'Cifratura Fernet (AES-128)',
                  desc: 'Le credenziali vengono cifrate con Fernet prima di essere salvate nel database. Nessuno — nemmeno noi — può leggerle in chiaro.',
                },
                {
                  icon: Server,
                  color: '#00C2FF',
                  title: 'VPS dedicato, rete privata',
                  desc: 'Il bot gira su VPS Windows in una rete privata. La comunicazione tra bot e database avviene solo su localhost — non esposta a internet.',
                },
                {
                  icon: Shield,
                  color: '#F0B429',
                  title: 'Solo operazioni di trading',
                  desc: 'Usiamo le credenziali esclusivamente per aprire/chiudere trade su XAU/USD. Non spostiamo fondi, non modifichiamo impostazioni account.',
                },
                {
                  icon: User,
                  color: '#00E676',
                  title: 'Revoca in qualsiasi momento',
                  desc: 'Puoi rimuovere le credenziali dal tuo pannello Account in qualsiasi momento. Il sistema smette immediatamente di usarle.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl p-4 flex items-start gap-3"
                  style={{ background: `${item.color}08`, border: `1px solid ${item.color}18` }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${item.color}15` }}>
                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: item.color }}>{item.title}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 4: Pronto! ── */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div
              className="rounded-2xl p-5 flex items-center gap-4"
              style={{ background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.2)' }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,230,118,0.12)' }}>
                <CheckCircle2 className="w-7 h-7 text-[#00E676]" />
              </div>
              <div>
                <p className="font-black text-[#00E676] text-base">Sei pronto — zero azioni richieste</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                  Da questo momento il sistema copia automaticamente ogni trade che apriamo su XAU/USD sul tuo conto MT5. Nessun software aggiuntivo, nessuna finestra aperta, nessun EA.
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--text-secondary)] font-semibold">Come funziona da adesso:</p>
            <div className="space-y-3">
              {[
                { time: 'Ogni mattina 10:00', text: 'Il server verifica automaticamente che le tue credenziali MT5 siano ancora valide' },
                { time: '10:30 – 14:00',      text: 'Quando apriamo un trade su XAU/USD, il sistema fa login sul tuo conto e apre la stessa posizione in pochi secondi' },
                { time: 'Risk fisso 1%',       text: 'Il lotto viene calcolato automaticamente in base al saldo del tuo conto — rischi sempre e solo l\'1% per trade' },
                { time: 'Live Trading',        text: 'Nel pannello "Live Trading" della dashboard vedi in tempo reale tutte le posizioni aperte del master' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold flex-shrink-0 mt-0.5 whitespace-nowrap"
                    style={{ background: 'rgba(240,180,41,0.12)', color: '#F0B429', border: '1px solid rgba(240,180,41,0.2)' }}
                  >
                    {item.time}
                  </div>
                  <span className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>

            <div
              className="rounded-2xl p-4 flex items-start gap-3"
              style={{ background: 'rgba(240,180,41,0.05)', border: '1px solid rgba(240,180,41,0.15)' }}
            >
              <AlertCircle className="w-4 h-4 text-[#F0B429] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                <strong className="text-[var(--text-primary)]">Assicurati che il saldo del tuo conto sia sufficiente</strong> — il lotto minimo su XAU/USD (0.01 lot) richiede circa €100 di saldo con risk 1%. Con meno saldo il trade potrebbe non essere copiato.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-gold px-6 py-2.5 rounded-xl text-sm"
              >
                <Zap className="w-4 h-4" />
                Vai alla Dashboard
              </button>
              <button
                onClick={() => router.push('/dashboard/live-trading')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'rgba(0,194,255,0.08)', border: '1px solid rgba(0,194,255,0.2)', color: '#00C2FF' }}
              >
                <Wifi className="w-4 h-4" />
                Guarda Live Trading
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation ────────────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          <ChevronLeft className="w-4 h-4" /> Indietro
        </button>

        <div className="flex gap-1.5">
          {steps.map(s => (
            <div
              key={s.num}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: step === s.num ? '#F0B429' : step > s.num ? '#00E676' : 'var(--surface-2)',
                boxShadow: step === s.num ? '0 0 8px rgba(240,180,41,0.6)' : 'none',
              }}
            />
          ))}
        </div>

        {step < 4 ? (
          <button
            onClick={() => setStep(Math.min(4, step + 1))}
            className="btn-gold px-6 py-2.5 rounded-xl text-sm"
          >
            Avanti <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-gold px-6 py-2.5 rounded-xl text-sm"
          >
            Vai alla Dashboard <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
