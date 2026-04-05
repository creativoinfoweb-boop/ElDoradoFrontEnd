'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (newPwd.length < 6) { setError('La password deve avere almeno 6 caratteri'); return }
    if (newPwd !== confirmPwd) { setError('Le password non coincidono'); return }
    if (!token) { setError('Token mancante — usa il link dall\'email'); return }

    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, new_password: newPwd })
      setSuccess(true)
      setTimeout(() => router.push('/auth/login'), 2500)
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Token non valido o scaduto.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#04040A] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="aurora-bg">
        <div className="aurora-orb aurora-orb-1" style={{ opacity: 0.06 }} />
      </div>
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-fit"><img src="/eldorado.jpg" alt="El Dorado" style={{ width: 72, height: 72, borderRadius: '50%', border: '1.5px solid rgba(240,180,41,0.35)', objectFit: 'cover', objectPosition: 'top center', flexShrink: 0 }} /></div>
          <h1 className="text-2xl font-black text-gradient-gold">El Dorado</h1>
          <p className="text-sm text-[#6B6B8A] mt-1">Nuova Password</p>
        </div>

        <div className="rounded-2xl p-8"
          style={{
            background: 'rgba(13,13,26,0.85)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          }}>

          {!success ? (
            <>
              <h2 className="text-xl font-bold text-[#F0F0F5] mb-2">Reimposta la password</h2>
              <p className="text-sm text-[#6B6B8A] mb-6">Scegli una nuova password sicura per il tuo account.</p>

              {error && (
                <div className="flex items-start gap-2 rounded-xl p-3 mb-4"
                  style={{ background: 'rgba(255,61,113,0.08)', border: '1px solid rgba(255,61,113,0.2)' }}>
                  <AlertCircle className="w-4 h-4 text-[#FF3D71] flex-shrink-0 mt-0.5" />
                  <p className="text-[#FF3D71] text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6B6B8A] mb-1.5 uppercase tracking-wide">
                    Nuova Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D3D5C]" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={newPwd}
                      onChange={e => setNewPwd(e.target.value)}
                      placeholder="Almeno 6 caratteri"
                      className="input-premium pl-10 pr-10"
                      style={{ background: 'rgba(4,4,10,0.7)' }}
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3D3D5C] hover:text-[#6B6B8A]">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B6B8A] mb-1.5 uppercase tracking-wide">
                    Conferma Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D3D5C]" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={confirmPwd}
                      onChange={e => setConfirmPwd(e.target.value)}
                      placeholder="Ripeti la password"
                      className="input-premium pl-10"
                      style={{ background: 'rgba(4,4,10,0.7)' }}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading || !newPwd || !confirmPwd}
                  className="btn-gold w-full py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-[#08080F]/40 border-t-[#08080F] rounded-full animate-spin" />Salvataggio…</>
                    : <>Salva Nuova Password <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
                style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)' }}>
                <CheckCircle2 className="w-7 h-7 text-[#00E676]" />
              </div>
              <p className="font-bold text-[#F0F0F5]">Password aggiornata!</p>
              <p className="text-sm text-[#6B6B8A]">Verrai reindirizzato al login tra pochi secondi…</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-[#6B6B8A] hover:text-[#F0B429] transition-colors">
              Torna al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#04040A]" />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
