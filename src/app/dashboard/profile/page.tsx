'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '@/lib/api'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, setUser } = useAuthStore()

  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const [nameForm, setNameForm] = useState({ full_name: '' })
  const [nameLoading, setNameLoading] = useState(false)
  const [nameMsg, setNameMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login')
    if (user) setNameForm({ full_name: user.full_name })
  }, [isAuthenticated, user, router])

  if (!user) return <div className="text-[var(--text-muted)]">Caricamento...</div>

  async function handleNameSave() {
    if (!nameForm.full_name.trim()) return
    setNameLoading(true)
    setNameMsg(null)
    try {
      const res = await api.patch('/auth/me', { full_name: nameForm.full_name })
      setUser(res.data)
      setNameMsg({ type: 'ok', text: 'Nome aggiornato con successo' })
    } catch {
      setNameMsg({ type: 'err', text: 'Errore durante il salvataggio' })
    } finally {
      setNameLoading(false)
    }
  }

  async function handlePasswordChange() {
    if (pwForm.new_password !== pwForm.confirm) {
      setPwMsg({ type: 'err', text: 'Le password non coincidono' })
      return
    }
    if (pwForm.new_password.length < 8) {
      setPwMsg({ type: 'err', text: 'La password deve essere di almeno 8 caratteri' })
      return
    }
    setPwLoading(true)
    setPwMsg(null)
    try {
      await api.patch('/auth/me', {
        current_password: pwForm.current_password,
        new_password: pwForm.new_password,
      })
      setPwMsg({ type: 'ok', text: 'Password aggiornata con successo' })
      setPwForm({ current_password: '', new_password: '', confirm: '' })
    } catch (e: any) {
      setPwMsg({ type: 'err', text: e?.response?.data?.detail || 'Errore durante il cambio password' })
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Profilo</h1>
        <p className="text-[var(--text-muted)] mt-1">Gestisci il tuo account El Dorado</p>
      </div>

      {/* Avatar + Info */}
      <div className="glass-gold rounded-2xl p-8">
        <div className="flex items-center gap-5 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/eldorado.jpg"
            alt="El Dorado"
            className="gold-avatar-ring"
            style={{ width: 64, height: 64 }}
          />
          <div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{user.full_name}</p>
            <p className="text-[var(--text-secondary)]">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
              <span className="text-xs text-[#00E676]">Account attivo</span>
              {user.is_admin && (
                <span className="ml-2 px-2 py-0.5 bg-[#F0B429]/15 border border-[#F0B429]/30 rounded text-xs text-[#F0B429] font-semibold">ADMIN</span>
              )}
            </div>
          </div>
        </div>

        {/* Edit Name */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Nome completo</p>
          <div className="flex gap-3">
            <input
              value={nameForm.full_name}
              onChange={e => setNameForm({ full_name: e.target.value })}
              className="input-premium flex-1"
              placeholder="Il tuo nome"
            />
            <button
              onClick={handleNameSave}
              disabled={nameLoading}
              className="btn-gold px-5 py-2 text-sm whitespace-nowrap"
            >
              {nameLoading ? 'Salvo...' : 'Salva'}
            </button>
          </div>
          {nameMsg && (
            <div className={`flex items-center gap-2 text-sm ${nameMsg.type === 'ok' ? 'text-[#00E676]' : 'text-[#FF3D71]'}`}>
              {nameMsg.type === 'ok' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {nameMsg.text}
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <p className="text-xs text-[var(--text-secondary)] mb-1">Email</p>
            <p className="text-[var(--text-primary)] font-semibold text-sm truncate">{user.email}</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <p className="text-xs text-[var(--text-secondary)] mb-1">Membro dal</p>
            <p className="text-[var(--text-primary)] font-semibold text-sm">
              {new Date(user.created_at).toLocaleDateString('it-IT', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="card-premium rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-[#00C2FF]/10 border border-[#00C2FF]/20 flex items-center justify-center">
            <Lock className="w-4 h-4 text-[#00C2FF]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Cambia Password</h2>
            <p className="text-xs text-[var(--text-secondary)]">Usa una password di almeno 8 caratteri</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 block">Password Attuale</label>
            <input
              type="password"
              value={pwForm.current_password}
              onChange={e => setPwForm(f => ({ ...f, current_password: e.target.value }))}
              className="input-premium w-full"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 block">Nuova Password</label>
            <input
              type="password"
              value={pwForm.new_password}
              onChange={e => setPwForm(f => ({ ...f, new_password: e.target.value }))}
              className="input-premium w-full"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 block">Conferma Nuova Password</label>
            <input
              type="password"
              value={pwForm.confirm}
              onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
              className="input-premium w-full"
              placeholder="••••••••"
            />
          </div>

          {pwMsg && (
            <div className={`flex items-center gap-2 text-sm ${pwMsg.type === 'ok' ? 'text-[#00E676]' : 'text-[#FF3D71]'}`}>
              {pwMsg.type === 'ok' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {pwMsg.text}
            </div>
          )}

          <button
            onClick={handlePasswordChange}
            disabled={pwLoading || !pwForm.current_password || !pwForm.new_password}
            className="btn-gold w-full mt-2"
          >
            {pwLoading ? 'Aggiornamento...' : 'Aggiorna Password'}
          </button>
        </div>
      </div>

      {/* Security Info */}
      <div className="card-premium rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#00E676]" />
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Account Protetto</p>
            <p className="text-xs text-[var(--text-secondary)]">Le credenziali MT5 sono crittografate con AES-256. I token JWT scadono ogni 60 minuti.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
