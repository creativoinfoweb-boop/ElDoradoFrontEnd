'use client'

import { useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string; token?: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await api.post('/auth/forgot-password', { email })
      setResult({
        ok: true,
        message: res.data.message || 'Controlla la tua email.',
        token: res.data.reset_token, // solo in development
      })
    } catch (e: any) {
      setResult({ ok: false, message: e?.response?.data?.detail || 'Errore. Riprova.' })
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
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-fit"><img src="/eldorado.jpg" alt="El Dorado" style={{ width: 72, height: 72, borderRadius: '50%', border: '1.5px solid rgba(240,180,41,0.35)', objectFit: 'cover', objectPosition: 'top center', flexShrink: 0 }} /></div>
          <h1 className="text-2xl font-black text-gradient-gold">El Dorado</h1>
          <p className="text-sm text-[#6B6B8A] mt-1">Reset Password</p>
        </div>

        <div className="rounded-2xl p-8"
          style={{
            background: 'rgba(13,13,26,0.85)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          }}>
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#F0B429]/30 to-transparent" />

          {!result ? (
            <>
              <h2 className="text-xl font-bold text-[#F0F0F5] mb-2">Password dimenticata?</h2>
              <p className="text-sm text-[#6B6B8A] mb-6">
                Inserisci la tua email e ti invieremo le istruzioni per reimpostare la password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6B6B8A] mb-1.5 uppercase tracking-wide">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D3D5C]" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="tu@esempio.com"
                      className="input-premium pl-10"
                      style={{ background: 'rgba(4,4,10,0.7)' }}
                      required
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 rounded-xl">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-[#08080F]/40 border-t-[#08080F] rounded-full animate-spin" />Invio in corso…</>
                    : 'Invia istruzioni reset'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              {result.ok ? (
                <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
                  style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)' }}>
                  <CheckCircle2 className="w-7 h-7 text-[#00E676]" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
                  style={{ background: 'rgba(255,61,113,0.1)', border: '1px solid rgba(255,61,113,0.3)' }}>
                  <AlertCircle className="w-7 h-7 text-[#FF3D71]" />
                </div>
              )}
              <p className="font-semibold text-[#F0F0F5]">{result.message}</p>

              {/* Development mode: mostra token direttamente */}
              {result.token && (
                <div className="rounded-xl p-4 text-left space-y-2"
                  style={{ background: 'rgba(240,180,41,0.06)', border: '1px solid rgba(240,180,41,0.2)' }}>
                  <p className="text-xs font-bold text-[#F0B429]">⚠️ Development Mode — Token diretto:</p>
                  <code className="text-xs text-[#F0F0F5] break-all font-mono">{result.token}</code>
                  <Link
                    href={`/auth/reset-password?token=${result.token}`}
                    className="block mt-2 text-xs text-center py-2 rounded-lg font-semibold"
                    style={{ background: 'rgba(240,180,41,0.15)', color: '#F0B429' }}>
                    Vai al Reset Password →
                  </Link>
                </div>
              )}

              {!result.ok && (
                <button onClick={() => setResult(null)} className="text-sm text-[#F0B429] hover:text-[#FFD166] transition-colors">
                  Riprova
                </button>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="flex items-center justify-center gap-1.5 text-sm text-[#6B6B8A] hover:text-[#F0B429] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Torna al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
