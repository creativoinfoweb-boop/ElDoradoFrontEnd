'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import type { MT5Account } from '@/types'
import {
  Server, Plus, Trash2, Shield, AlertCircle,
  CheckCircle2, XCircle, Loader2, Activity,
  Clock, Wifi, WifiOff, Info,
} from 'lucide-react'

function ConnectionBadge({ account }: { account: MT5Account & { last_check_at?: string; last_check_ok?: boolean | null; last_check_error?: string | null } }) {
  if (account.last_check_ok === null || account.last_check_ok === undefined || !account.last_check_at) {
    return (
      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
        <Clock className="w-3.5 h-3.5" />
        <span>Non ancora verificato</span>
      </div>
    )
  }
  const date = new Date(account.last_check_at).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  if (account.last_check_ok) {
    return (
      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--green)' }}>
        <Wifi className="w-3.5 h-3.5" />
        <span>Verificato {date}</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--red)' }}>
      <WifiOff className="w-3.5 h-3.5" />
      <span>Errore verifica · {account.last_check_error || 'Credenziali non valide'}</span>
    </div>
  )
}

export default function AccountsPage() {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', mt5_login: '', mt5_password: '', mt5_server: '', account_type: 'real' })
  const [testingConnection, setTestingConnection] = useState(false)
  const [testMessage, setTestMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null)

  const showToast = (text: string, ok = true) => { setToast({ text, ok }); setTimeout(() => setToast(null), 3500) }

  const { data: accounts = [], isLoading, refetch } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => { const r = await api.get('/accounts/mt5'); return r.data || [] },
  })

  const hasAccount = accounts.length > 0

  const addMutation = useMutation({
    mutationFn: (payload: typeof formData) => api.post('/accounts/mt5', payload),
    onSuccess: () => {
      setFormData({ name: '', mt5_login: '', mt5_password: '', mt5_server: '', account_type: 'real' })
      setShowModal(false); refetch(); showToast('Account MT5 collegato con successo!')
    },
    onError: (e: any) => showToast(e.response?.data?.detail || 'Errore nel salvataggio', false),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/accounts/mt5/${id}`),
    onSuccess: () => { setDeleteConfirm(null); refetch(); showToast('Account eliminato') },
    onError: (e: any) => showToast(e.response?.data?.detail || 'Errore eliminazione', false),
  })

  const handleTest = async () => {
    if (!formData.mt5_login || !formData.mt5_password || !formData.mt5_server) {
      setTestMessage({ text: 'Compila tutti i campi prima del test', ok: false }); return
    }
    setTestingConnection(true); setTestMessage(null)
    try {
      const r = await api.post('/accounts/mt5/test', {
        mt5_login: formData.mt5_login,
        mt5_password: formData.mt5_password,
        mt5_server: formData.mt5_server,
      })
      if (r.data.success) {
        setTestMessage({ text: `✅ Connessione OK — ${r.data.name || 'Account'} · Balance: $${r.data.balance?.toFixed(2) ?? '—'}`, ok: true })
      } else {
        setTestMessage({ text: r.data.error || 'Connessione fallita', ok: false })
      }
    } catch (e: any) {
      setTestMessage({ text: e.response?.data?.error || 'Errore connessione', ok: false })
    } finally {
      setTestingConnection(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const login = formData.mt5_login.trim()
    if (!login || !formData.mt5_password || !formData.mt5_server.trim()) return
    const name = formData.name.trim() || `Conto ${login}`
    addMutation.mutate({ ...formData, mt5_login: login, mt5_server: formData.mt5_server.trim(), name })
  }

  const canSave =
    Boolean(formData.mt5_login.trim()) &&
    Boolean(formData.mt5_password) &&
    Boolean(formData.mt5_server.trim())

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-3xl">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Account MT5</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Collega il tuo conto MetaTrader 5 per ricevere i trade in automatico
          </p>
        </div>
        {!hasAccount && (
          <button
            onClick={() => { setShowModal(true); setTestMessage(null) }}
            className="btn-gold px-5 py-2.5 rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Collega Account
          </button>
        )}
      </div>

      {/* Regola 1 account per abbonamento */}
      <div className="flex items-start gap-3 p-4 rounded-xl"
        style={{ background: 'rgba(240,180,41,0.06)', border: '1px solid rgba(240,180,41,0.15)' }}>
        <Info className="w-4 h-4 text-[#F0B429] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#8A8AA0] leading-relaxed">
          <strong className="text-[#F0B429]">1 account MT5 per abbonamento.</strong>{' '}
          Ogni abbonamento permette di collegare un solo conto broker. I trade vengono copiati direttamente dal nostro server — non serve MT5 aperto sul tuo computer.
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-start gap-3 p-4 rounded-xl"
        style={{ background: 'rgba(155,93,229,0.06)', border: '1px solid rgba(155,93,229,0.15)' }}>
        <Shield className="w-4 h-4 text-[#9B5DE5] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#8A8AA0] leading-relaxed">
          Le credenziali MT5 vengono cifrate con <strong className="text-[#C4A8FF]">Fernet AES-128</strong> prima di essere salvate nel database. Non vengono mai trasmesse o lette in chiaro da nessuno, neanche da noi.
        </p>
      </div>

      {/* Accounts list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
      ) : accounts.length === 0 ? (
        <div className="card-premium p-10 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(240,180,41,0.08)', border: '1px solid rgba(240,180,41,0.15)' }}>
            <Server className="w-6 h-6" style={{ color: 'var(--gold)' }} />
          </div>
          <div>
            <p className="font-bold" style={{ color: 'var(--text-primary)' }}>Nessun account collegato</p>
            <p className="text-sm mt-1 max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              Inserisci le credenziali del tuo conto MT5 — il nostro server copierà i trade automaticamente
            </p>
          </div>
          <button onClick={() => { setShowModal(true); setTestMessage(null) }} className="btn-gold px-6 py-2.5 rounded-xl">
            <Plus className="w-4 h-4" /> Collega Account MT5
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {(accounts as any[]).map((acc) => (
            <div key={acc.id} className="card-premium p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={
                      acc.last_check_ok === true
                        ? { background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.25)' }
                        : acc.last_check_ok === false
                        ? { background: 'rgba(255,61,113,0.08)', border: '1px solid rgba(255,61,113,0.2)' }
                        : { background: 'rgba(240,180,41,0.08)', border: '1px solid rgba(240,180,41,0.2)' }
                    }
                  >
                    <Activity
                      className="w-5 h-5"
                      style={{ color: acc.last_check_ok === true ? '#00E676' : acc.last_check_ok === false ? '#FF3D71' : '#F0B429' }}
                    />
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{acc.name}</p>
                    <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-secondary)' }}>{acc.mt5_server}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={acc.account_type === 'demo' ? 'badge-warning' : 'badge-success'}>
                    {acc.account_type === 'demo' ? 'Demo' : 'Live'}
                  </span>
                  <button
                    onClick={() => setDeleteConfirm(acc.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: 'rgba(255,61,113,0.06)', border: '1px solid rgba(255,61,113,0.2)' }}
                    title="Elimina account"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#FF3D71]" />
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />

              {/* Status connessione */}
              <div className="flex items-center justify-between">
                <ConnectionBadge account={acc} />
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Verifica automatica ogni giorno alle 10:00</p>
              </div>

              {/* Errore visibile se c'è */}
              {acc.last_check_ok === false && acc.last_check_error && (
                <div className="flex items-start gap-2 p-3 rounded-xl"
                  style={{ background: 'rgba(255,61,113,0.06)', border: '1px solid rgba(255,61,113,0.15)' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--red)' }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--red)' }}>Credenziali non valide — i trade non verranno copiati</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{acc.last_check_error}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Elimina l'account e reinserisci le credenziali corrette.</p>
                  </div>
                </div>
              )}

              {/* Prima verifica */}
              {(acc.last_check_ok === null || acc.last_check_ok === undefined) && (
                <div className="flex items-start gap-2 p-3 rounded-xl"
                  style={{ background: 'rgba(240,180,41,0.05)', border: '1px solid rgba(240,180,41,0.12)' }}>
                  <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    La prima verifica automatica avverrà domani mattina alle <strong style={{ color: 'var(--gold)' }}>10:00</strong>. Se vuoi, usa il pulsante Test per verificare subito (solo su VPS Windows con MT5 attivo).
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Banner "1 account per piano" */}
          <div className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--green)' }} />
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Hai raggiunto il limite di 1 account MT5 per abbonamento. Per collegare un altro conto, elimina prima quello attuale.
            </p>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowModal(false)}>
          <div
            className="card-premium w-full max-w-md max-h-[min(92vh,640px)] flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 pb-0 flex-shrink-0">
              <h2 className="text-lg font-black mb-1" style={{ color: 'var(--text-primary)' }}>Collega Account MT5</h2>
              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                Inserisci login, password e server. In basso usa <strong className="text-[var(--text-primary)]">Salva e collega</strong> per confermare.
              </p>
            </div>

            <form id="mt5-link-form" onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1 min-h-0">

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Nome in dashboard <span className="normal-case font-normal opacity-70">(opzionale)</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Es. Exness Live — se vuoto usiamo «Conto + login»"
                  className="input-premium w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  MT5 Login (numero conto)
                </label>
                <input
                  type="text"
                  value={formData.mt5_login}
                  onChange={e => setFormData({ ...formData, mt5_login: e.target.value })}
                  placeholder="Es. 12345678"
                  className="input-premium w-full text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Password di Trading
                </label>
                <input
                  type="password"
                  value={formData.mt5_password}
                  onChange={e => setFormData({ ...formData, mt5_password: e.target.value })}
                  placeholder="Password principale (non investor)"
                  className="input-premium w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Server Broker
                </label>
                <input
                  type="text"
                  value={formData.mt5_server}
                  onChange={e => setFormData({ ...formData, mt5_server: e.target.value })}
                  placeholder="Es. Exness-MT5Real"
                  className="input-premium w-full text-sm font-mono"
                />
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  Trovalo in MT5: File → Apri Conto → cerca il tuo broker
                </p>
              </div>

              {/* Tipo account */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Tipo Conto
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[{ v: 'real', label: 'Live / Reale', color: '#00E676' }, { v: 'demo', label: 'Demo', color: '#F0B429' }].map(opt => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setFormData({ ...formData, account_type: opt.v })}
                      className="py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={
                        formData.account_type === opt.v
                          ? { background: `${opt.color}15`, border: `1px solid ${opt.color}40`, color: opt.color }
                          : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#3D3D5C' }
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <details className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <summary
                  className="px-3 py-2.5 text-xs font-semibold cursor-pointer flex items-center justify-between gap-2 [&::-webkit-details-marker]:hidden"
                  style={{ color: '#6B6B8A', background: 'rgba(255,255,255,0.02)', listStyle: 'none' }}
                >
                  <span>Test connessione (opzionale — solo se hai VPS con MT5)</span>
                  <span className="text-[10px] opacity-70">▼</span>
                </summary>
                <div className="p-3 pt-0 space-y-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={handleTest}
                    disabled={testingConnection}
                    className="w-full py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2"
                    style={{ background: 'rgba(0,194,255,0.06)', border: '1px solid rgba(0,194,255,0.15)', color: '#00C2FF' }}
                  >
                    {testingConnection ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Test in corso…
                      </>
                    ) : (
                      <>
                        <Wifi className="w-3.5 h-3.5" /> Esegui test
                      </>
                    )}
                  </button>
                  <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Su Mac / senza bot VPS il test spesso fallisce: puoi comunque salvare — la verifica automatica è alle 10:00.
                  </p>
                  {testMessage && (
                    <div
                      className="flex items-start gap-2 p-2.5 rounded-lg text-xs"
                      style={{
                        background: testMessage.ok ? 'rgba(0,230,118,0.06)' : 'rgba(255,61,113,0.06)',
                        border: `1px solid ${testMessage.ok ? 'rgba(0,230,118,0.2)' : 'rgba(255,61,113,0.2)'}`,
                        color: testMessage.ok ? '#00E676' : '#FF3D71',
                      }}
                    >
                      {testMessage.ok ? (
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      )}
                      <span>{testMessage.text}</span>
                    </div>
                  )}
                </div>
              </details>

              {!canSave && (
                <p className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
                  Compila <strong className="text-[var(--text-secondary)]">login</strong>,{' '}
                  <strong className="text-[var(--text-secondary)]">password</strong> e{' '}
                  <strong className="text-[var(--text-secondary)]">server</strong> per abilitare il salvataggio.
                </p>
              )}
              </div>

              <div
                className="flex gap-3 p-4 pt-3 flex-shrink-0 border-t"
                style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#6B6B8A' }}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={addMutation.isPending || !canSave}
                  className="flex-[1.35] btn-gold py-3 rounded-xl text-sm font-bold disabled:opacity-45 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                >
                  {addMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvataggio…
                    </>
                  ) : (
                    'Salva e collega conto'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
          onClick={() => setDeleteConfirm(null)}>
          <div className="card-premium p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,61,113,0.1)', border: '1px solid rgba(255,61,113,0.25)' }}>
                <AlertCircle className="w-5 h-5" style={{ color: 'var(--red)' }} />
              </div>
              <h2 className="font-black" style={{ color: 'var(--text-primary)' }}>Elimina Account MT5</h2>
            </div>
            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
              I trade non verranno più copiati su questo conto. Puoi aggiungerne uno nuovo in qualsiasi momento.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                Annulla
              </button>
              <button onClick={() => deleteMutation.mutate(deleteConfirm!)} disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'rgba(255,61,113,0.12)', border: '1px solid rgba(255,61,113,0.35)', color: 'var(--red)' }}>
                {deleteMutation.isPending ? 'Eliminazione…' : 'Elimina'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl z-50 animate-fade-in"
          style={{
            background: toast.ok ? 'rgba(0,230,118,0.15)' : 'rgba(255,61,113,0.15)',
            border: `1px solid ${toast.ok ? 'rgba(0,230,118,0.3)' : 'rgba(255,61,113,0.3)'}`,
            color: toast.ok ? '#00E676' : '#FF3D71',
          }}>
          {toast.text}
        </div>
      )}
    </div>
  )
}
