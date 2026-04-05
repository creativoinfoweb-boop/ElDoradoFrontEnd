'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { subscriptionsApi, getApiErrorMessage } from '@/lib/api'
import { SubscriptionStatus } from '@/types'
import {
  AlertCircle, Clock, CheckCircle2,
  Tag, Shield, XCircle, Check, Lock,
} from 'lucide-react'
import Link from 'next/link'
import { PricingPlanCard } from '@/components/pricing/PricingPlanCard'

const features = [
  'Copy trading 100% automatico su XAU/USD',
  'Niente EA da installare — funziona dal tuo broker',
  'Verifica giornaliera delle credenziali',
  'Dashboard live con posizioni in tempo reale',
  'Risk management 1% per trade (fisso)',
  'Supporto dedicato via email',
  'Cancella quando vuoi — zero vincoli',
]

function BillingSkeleton() {
  return (
    <div className="p-6 space-y-5 max-w-3xl mx-auto">
      <div className="skeleton h-10 w-56 rounded-xl" />
      <div className="skeleton h-96 rounded-2xl" />
    </div>
  )
}

function BillingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuthStore()
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null)
  const [coupon, setCoupon] = useState('')
  const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [trialFeedback, setTrialFeedback] = useState<{ ok: boolean; text: string } | null>(null)
  const autoCheckoutDone = useRef(false)

  const refreshStatus = useCallback(() => {
    return subscriptionsApi.getStatus().then((r) => {
      setSubscription(r.data)
      return r.data
    })
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    refreshStatus().catch(() => setSubscription(null)).finally(() => setLoading(false))
  }, [isAuthenticated, router, refreshStatus])

  const handleCheckout = useCallback(async (billingPlan: 'monthly' | 'yearly') => {
    setActionLoading(true)
    try {
      const res = await subscriptionsApi.createCheckoutSession(billingPlan)
      window.location.href = res.data.url
    } catch (e: unknown) {
      alert(getApiErrorMessage(e, 'Errore durante il pagamento'))
    } finally {
      setActionLoading(false)
    }
  }, [])

  /** Dopo login da landing con ?checkout= — avvia Stripe una volta */
  useEffect(() => {
    if (!isAuthenticated || loading || autoCheckoutDone.current) return
    const q = searchParams.get('checkout')
    if (q !== 'monthly' && q !== 'yearly') return
    autoCheckoutDone.current = true
    void (async () => {
      await handleCheckout(q)
      router.replace('/dashboard/billing', { scroll: false })
    })()
  }, [isAuthenticated, loading, searchParams, handleCheckout, router])

  const handleCancel = async () => {
    if (!confirm('Sei sicuro di voler cancellare l\'abbonamento?')) return
    setActionLoading(true)
    try {
      await subscriptionsApi.cancel()
      const res = await subscriptionsApi.getStatus()
      setSubscription(res.data)
    } catch (_) {}
    finally {
      setActionLoading(false)
    }
  }

  const handleStartTrial = async () => {
    setTrialFeedback(null)
    setActionLoading(true)
    try {
      const res = await subscriptionsApi.startTrial()
      setSubscription(res.data)
      setTrialFeedback({ ok: true, text: 'Trial attivato: hai 7 giorni gratis. Buon trading!' })
    } catch (e: unknown) {
      setTrialFeedback({
        ok: false,
        text: getApiErrorMessage(e, 'Impossibile avviare il trial. Riprova tra un attimo.'),
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return
    setActionLoading(true)
    try {
      const validation = await subscriptionsApi.validateCoupon(coupon)
      if (!validation.data.valid) {
        setCouponMsg({ text: 'Codice non valido o scaduto.', ok: false })
        return
      }
      const isFree = validation.data.discount_type === 'PERCENT' && Number(validation.data.discount_value) >= 100
      if (isFree) {
        const res = await subscriptionsApi.redeemCoupon(coupon)
        setCouponMsg({ text: res.data.message || '🎉 Accesso attivato!', ok: true })
        const statusRes = await subscriptionsApi.getStatus()
        setSubscription(statusRes.data)
      } else {
        const disc = validation.data.discount_type === 'PERCENT'
          ? `${validation.data.discount_value}%`
          : `€${validation.data.discount_value}`
        setCouponMsg({ text: `Coupon valido! Sconto ${disc} — verrà applicato al checkout`, ok: true })
      }
    } catch (e: unknown) {
      setCouponMsg({
        text: (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Errore nella verifica del codice.',
        ok: false,
      })
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <BillingSkeleton />

  const status = subscription?.status
  const missingData = subscription == null
  const hasNone = missingData || status === 'none'
  const isTrialing = status === 'trialing'
  const isActive = status === 'active'
  const isExpired = status === 'trial_expired' || status === 'inactive'
  const trialPct = isTrialing ? Math.round(((7 - (subscription?.days_remaining ?? 0)) / 7) * 100) : 0
  const cancelPending = Boolean(subscription?.cancel_at_period_end)

  const showPricingBlock = !isActive
  const showTrialOnCard = hasNone

  let statusHeadline = ''
  let statusDetail = ''
  if (missingData) {
    statusHeadline = 'Attiva il tuo accesso'
    statusDetail = 'Scegli trial gratuito o pagamento — stesso piano della homepage.'
  } else if (hasNone) {
    statusHeadline = 'Abbonamento non ancora attivo'
    statusDetail = 'Avvia il trial di 7 giorni oppure paga con carta (mensile o annuale).'
  } else if (isTrialing) {
    statusHeadline = 'Trial attivo'
    statusDetail = `Hai ancora ${subscription?.days_remaining ?? '—'} giorni gratis. Puoi attivare il pagamento quando vuoi.`
  } else if (isExpired) {
    statusHeadline = 'Abbonamento inattivo'
    statusDetail = 'Riattiva con lo stesso piano della homepage: mensile promo o annuale scontato.'
  }

  return (
    <div className="p-5 sm:p-6 space-y-8 max-w-3xl mx-auto">

      <div>
        <h1 className="text-2xl font-black text-[var(--text-primary)]">Abbonamento</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">El Dorado Premium — copy trading XAU/USD</p>
      </div>

      {showPricingBlock && (
        <div
          className="rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3"
          style={{
            background: isTrialing ? 'rgba(240,180,41,0.08)' : 'rgba(255,61,113,0.06)',
            border: `1px solid ${isTrialing ? 'rgba(240,180,41,0.2)' : 'rgba(255,61,113,0.18)'}`,
          }}
        >
          <div className="flex items-center gap-2 flex-shrink-0">
            {isTrialing ? (
              <span className="badge-warning">Trial</span>
            ) : (
              <span className="badge-danger">Inattivo</span>
            )}
          </div>
          <div>
            <p className="font-bold text-[var(--text-primary)] text-sm">{statusHeadline}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">{statusDetail}</p>
          </div>
        </div>
      )}

      {showPricingBlock && (
        <div>
          {isTrialing && subscription && (
            <div className="mb-6 space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-xl"
                style={{ background: 'rgba(240,180,41,0.06)', border: '1px solid rgba(240,180,41,0.15)' }}>
                <Clock className="w-5 h-5 text-[#F0B429] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--text-primary)] text-sm">Periodo di prova</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Scade il{' '}
                    {subscription.trial_ends_at
                      ? new Date(subscription.trial_ends_at).toLocaleDateString('it-IT')
                      : '—'}
                  </p>
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-[var(--surface-2)]">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${trialPct}%`, background: 'linear-gradient(90deg, #C8931A, #F0B429, #FFD166)' }}
                />
              </div>
            </div>
          )}

          {trialFeedback && (
            <div
              className="mb-4 rounded-xl px-4 py-3 text-sm font-medium"
              style={{
                background: trialFeedback.ok ? 'rgba(0,230,118,0.08)' : 'rgba(255,61,113,0.08)',
                border: `1px solid ${trialFeedback.ok ? 'rgba(0,230,118,0.22)' : 'rgba(255,61,113,0.25)'}`,
                color: trialFeedback.ok ? '#00E676' : '#FF3D71',
              }}
            >
              {trialFeedback.text}
            </div>
          )}

          <PricingPlanCard
            variant="dashboard"
            compact
            showTrial={showTrialOnCard}
            actionLoading={actionLoading}
            onStartTrial={handleStartTrial}
            onCheckout={(plan) => handleCheckout(plan)}
          />
        </div>
      )}

      {isActive && (
        <div className="relative card-premium p-6 overflow-visible">
          <div
            className="absolute -inset-px rounded-[1.25rem] pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(0,230,118,0.12), transparent 60%)' }}
          />

          <div className="flex items-start justify-between mb-6 relative">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/eldorado.jpg" alt="El Dorado" style={{ width: 40, height: 40, borderRadius: '50%', border: '1.5px solid rgba(240,180,41,0.35)', objectFit: 'cover', objectPosition: 'top center' }} />
              <div>
                <div className="font-bold text-[var(--text-primary)]">El Dorado Premium</div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5">Copy Trading XAU/USD · 1 conto MT5</div>
              </div>
            </div>
            <span className="badge-success">Attivo</span>
          </div>

          <div className="relative space-y-4">
            {cancelPending && (
              <div
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{ background: 'rgba(255,209,102,0.08)', border: '1px solid rgba(255,209,102,0.25)' }}
              >
                <Clock className="w-5 h-5 text-[#FFD166] flex-shrink-0" />
                <p className="text-sm text-[var(--text-secondary)]">
                  Hai richiesto la cancellazione: l&apos;accesso resta attivo <strong className="text-[var(--text-primary)]">fino alla fine del periodo</strong> già pagato.
                </p>
              </div>
            )}
            <div className="flex items-center gap-3 p-4 rounded-xl"
              style={{ background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.15)' }}>
              <CheckCircle2 className="w-5 h-5 text-[#00E676] flex-shrink-0" />
              <div>
                <p className="font-semibold text-[var(--text-primary)] text-sm">Abbonamento attivo</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Prossimo rinnovo indicativo:{' '}
                  {subscription?.started_at
                    ? new Date(new Date(subscription.started_at).getTime() + 30 * 86400000).toLocaleDateString('it-IT')
                    : '—'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Piano', value: subscription?.plan === 'gold_yearly' ? 'Annuale' : 'Mensile' },
                {
                  label: 'Prezzo',
                  value: subscription?.plan === 'gold_yearly' ? '€694,40/anno' : '€39→€79*',
                },
                { label: 'Rinnovo', value: subscription?.plan === 'gold_yearly' ? '1× / anno' : 'Mensile' },
              ].map((item) => (
                <div key={item.label} className="text-center rounded-xl py-3"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                  <div className="text-sm font-bold text-[var(--text-primary)]">{item.value}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
            {subscription?.plan !== 'gold_yearly' && (
              <p className="text-[10px] text-[var(--text-muted)]">
                *Piano mensile: €39/mese per i primi 2 cicli di fatturazione, poi €79/mese (automatico su Stripe).
              </p>
            )}

            <button
              onClick={handleCancel}
              disabled={actionLoading || cancelPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
              style={{ background: 'rgba(255,61,113,0.06)', border: '1px solid rgba(255,61,113,0.2)', color: '#FF3D71' }}
            >
              <XCircle className="w-4 h-4" />{' '}
              {cancelPending ? 'Cancellazione già richiesta' : 'Cancella abbonamento'}
            </button>
          </div>

          <div className="relative mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5" /> Codice Promo
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Inserisci codice…"
                value={coupon}
                onChange={(e) => {
                  setCoupon(e.target.value.toUpperCase())
                  setCouponMsg(null)
                }}
                className="input-premium flex-1 text-sm"
                style={{ background: 'var(--surface-2)', color: 'var(--text-primary)' }}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={actionLoading || !coupon.trim()}
                className="btn-outline px-5 py-2.5 rounded-xl text-sm whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Riscatta'
                )}
              </button>
            </div>
            {couponMsg && (
              <div className={`flex items-center gap-2 mt-2 text-xs font-medium ${couponMsg.ok ? 'text-[#00E676]' : 'text-[#FF3D71]'}`}>
                {couponMsg.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {couponMsg.text}
              </div>
            )}
          </div>
        </div>
      )}

      {showPricingBlock && (
        <div className="relative mt-2 pt-2 border-t border-[var(--border)]">
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Tag className="w-3.5 h-3.5" /> Codice Promo
          </p>
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="Inserisci codice…"
              value={coupon}
              onChange={(e) => {
                setCoupon(e.target.value.toUpperCase())
                setCouponMsg(null)
              }}
              className="input-premium flex-1 text-sm"
              style={{ background: 'var(--surface-2)', color: 'var(--text-primary)' }}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={actionLoading || !coupon.trim()}
              className="btn-outline px-5 py-2.5 rounded-xl text-sm whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                'Riscatta'
              )}
            </button>
          </div>
          {couponMsg && (
            <div className={`flex items-center gap-2 mt-2 text-xs font-medium ${couponMsg.ok ? 'text-[#00E676]' : 'text-[#FF3D71]'}`}>
              {couponMsg.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              {couponMsg.text}
            </div>
          )}
        </div>
      )}

      <div className="card-premium p-5">
        <h3 className="font-bold text-[var(--text-primary)] text-sm mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#F0B429]" /> Cosa include il piano
        </h3>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {features.map((f) => (
            <div key={f} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.25)' }}>
                <Check className="w-3 h-3 text-[#00E676]" />
              </div>
              <span className="text-sm text-[var(--text-secondary)]">{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl"
        style={{ background: 'rgba(155,93,229,0.05)', border: '1px solid rgba(155,93,229,0.15)' }}>
        <Lock className="w-4 h-4 text-[#9B5DE5] flex-shrink-0" />
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Le credenziali MT5 sono cifrate con <strong style={{ color: 'var(--gold-dark)' }}>Fernet AES-128</strong>. I pagamenti vengono gestiti da <strong style={{ color: 'var(--gold-dark)' }}>Stripe</strong> — non salviamo mai i dati della carta.
        </p>
      </div>

      <div className="rounded-xl p-4 text-xs text-[var(--text-muted)] leading-relaxed"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        Prezzi in EUR IVA inclusa. Trial 7 giorni gratuiti senza carta. Offerta lancio: €39/mese per i primi 2 mesi, poi €79/mese con rinnovo automatico (piano mensile). Piano annuale €694,40/anno. Cancellazione senza penali.
        {' '}
        <Link href="#" className="text-[var(--gold)] hover:opacity-90 transition-opacity underline-offset-2">Termini di Servizio</Link>
      </div>
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense fallback={<BillingSkeleton />}>
      <BillingContent />
    </Suspense>
  )
}
