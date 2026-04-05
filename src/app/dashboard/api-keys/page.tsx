'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { apiKeysApi } from '@/lib/api'
import { ApiKey, ApiKeyWithSecret } from '@/types'
import { Copy, Trash2, Plus, Key, Check, Shield, X } from 'lucide-react'

export default function ApiKeysPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [label, setLabel] = useState('')
  const [newKey, setNewKey] = useState<ApiKeyWithSecret | null>(null)
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return }
    fetchKeys()
  }, [isAuthenticated, router])

  const fetchKeys = async () => {
    try {
      const res = await apiKeysApi.list()
      setKeys(res.data.keys)
    } catch (_) {}
    finally { setLoading(false) }
  }

  const handleGenerateKey = async () => {
    setGenerating(true)
    try {
      const res = await apiKeysApi.create(label || undefined)
      setNewKey(res.data)
      setShowModal(false)
      setLabel('')
      await fetchKeys()
    } catch (_) {}
    finally { setGenerating(false) }
  }

  const handleCopy = () => {
    if (newKey?.key) {
      navigator.clipboard.writeText(newKey.key)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleRevoke = async (keyId: string) => {
    if (!confirm('Revocare questa API Key? L\'EA che la usa smetterà di funzionare.')) return
    try { await apiKeysApi.revoke(keyId); await fetchKeys() } catch (_) {}
  }

  return (
    <div className="p-5 sm:p-6 space-y-5 max-w-3xl">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">API Keys</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Chiavi di autenticazione per il Client EA</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-gold px-5 py-2.5 rounded-xl text-sm">
          <Plus className="w-4 h-4" /> Nuova Chiave
        </button>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 rounded-2xl p-4"
        style={{ background: 'rgba(255,61,113,0.06)', border: '1px solid rgba(255,61,113,0.18)' }}>
        <Shield className="w-5 h-5 text-[#FF3D71] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-[#FF3D71] text-sm">Sicurezza API Key</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
            Tratta le API Keys come password. Non condividerle mai con nessuno. Non includerle in screenshot o video pubblici.
          </p>
        </div>
      </div>

      {/* New key display */}
      {newKey && (
        <div className="rounded-2xl p-5 relative animate-fade-in"
          style={{ background: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.2)' }}>
          <button onClick={() => setNewKey(null)}
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            style={{ background: 'var(--gold-subtle)' }}>
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.25)' }}>
              <Key className="w-4 h-4 text-[#00E676]" />
            </div>
            <div>
              <p className="font-bold text-[#00E676] text-sm">API Key Generata!</p>
              <p className="text-[10px] text-[var(--text-secondary)]">Questa è l'unica volta che la vedrai — salvala subito</p>
            </div>
          </div>

          <div className="rounded-xl p-3 font-mono text-xs break-all text-[#00E676] mb-3"
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,230,118,0.15)' }}>
            {newKey.key}
          </div>

          <button onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: copied ? 'rgba(0,230,118,0.15)' : 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.25)', color: '#00E676' }}>
            {copied ? <><Check className="w-4 h-4" /> Copiato!</> : <><Copy className="w-4 h-4" /> Copia Chiave</>}
          </button>
        </div>
      )}

      {/* Keys table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </div>
      ) : keys.length === 0 ? (
        <div className="rounded-2xl p-10 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(240,180,41,0.08)', border: '1px solid rgba(240,180,41,0.15)' }}>
            <Key className="w-6 h-6 text-[#F0B429] opacity-60" />
          </div>
          <h3 className="font-bold text-[var(--text-primary)] mb-2">Nessuna API Key</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Genera la tua prima chiave per connettere il Client EA.</p>
          <button onClick={() => setShowModal(true)} className="btn-gold px-6 py-2.5 rounded-xl text-sm">
            <Plus className="w-4 h-4" /> Genera Prima Chiave
          </button>
        </div>
      ) : (
        <div className="card-premium overflow-hidden p-0">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b"
            style={{ borderColor: 'var(--border)' }}>
            {['Label', 'Creata', 'Ultimo uso', 'Status', ''].map((h, i) => (
              <div key={i} className={`text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider ${i === 0 ? 'col-span-3' : i === 4 ? 'col-span-2 text-right' : 'col-span-2'}`}>
                {h}
              </div>
            ))}
          </div>
          {keys.map((key) => (
            <div key={key.id}
              className="grid grid-cols-12 gap-4 items-center px-5 py-4 border-b last:border-0 transition-all hover-row-dashboard"
              style={{ borderColor: 'var(--border)' }}>
              {/* Label */}
              <div className="col-span-3 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(240,180,41,0.1)', border: '1px solid rgba(240,180,41,0.15)' }}>
                  <Key className="w-3.5 h-3.5 text-[#F0B429]" />
                </div>
                <span className="text-sm font-semibold text-[var(--text-primary)] truncate">{key.label || 'Default'}</span>
              </div>
              {/* Created */}
              <div className="col-span-2 text-xs text-[var(--text-secondary)]">
                {new Date(key.created_at).toLocaleDateString('it-IT')}
              </div>
              {/* Last used */}
              <div className="col-span-2 text-xs text-[var(--text-secondary)]">
                {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString('it-IT') : 'Mai'}
              </div>
              {/* Status */}
              <div className="col-span-3">
                {key.is_active
                  ? <span className="badge-success text-xs">Attiva</span>
                  : <span className="badge-danger text-xs">Revocata</span>
                }
              </div>
              {/* Action */}
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={() => handleRevoke(key.id)}
                  disabled={!key.is_active}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ color: '#FF3D71', background: 'rgba(255,61,113,0.05)', border: '1px solid rgba(255,61,113,0.15)' }}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Revoca
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'color-mix(in srgb, var(--text-primary) 45%, transparent)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 animate-fade-in-up"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Nuova API Key</h2>
              <button onClick={() => { setShowModal(false); setLabel('') }}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--gold-subtle)] transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mb-5">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                Label (opzionale)
              </label>
              <input
                type="text"
                placeholder="es: EA principale, Laptop trading"
                value={label}
                onChange={e => setLabel(e.target.value)}
                className="input-premium"
                style={{ background: 'var(--surface-2)' }}
                onKeyDown={e => e.key === 'Enter' && handleGenerateKey()}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowModal(false); setLabel('') }}
                className="btn-ghost flex-1 py-2.5 rounded-xl border border-[var(--border)]">
                Annulla
              </button>
              <button onClick={handleGenerateKey} disabled={generating}
                className="btn-gold flex-1 py-2.5 rounded-xl">
                {generating
                  ? <><div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'color-mix(in srgb, var(--text-primary) 25%, transparent)', borderTopColor: 'var(--text-primary)' }} />Generazione…</>
                  : <><Key className="w-4 h-4" />Genera</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
