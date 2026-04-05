'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { AlertCircle } from 'lucide-react'

export default function HistoryPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'EXECUTED' | 'FAILED' | 'PENDING'>('ALL')

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login')
  }, [isAuthenticated, router])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Storico Trade</h1>
        <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Cronologia di tutti i trade copiati</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'EXECUTED', 'FAILED', 'PENDING'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className="px-4 py-2 rounded-lg font-semibold transition-all text-sm"
            style={filterStatus === status
              ? { background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))', color: 'var(--text-inverse)' }
              : { background: 'var(--glass-bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
            }
          >
            {status === 'ALL' ? 'Tutti' : status}
          </button>
        ))}
      </div>

      {/* Empty State */}
      <div className="rounded-xl p-8 text-center" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border)' }}>
        <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" style={{ color: 'var(--text-secondary)' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Nessun trade nella cronologia</p>
        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
          Installa il Client EA e inizia a ricevere i segnali per vedere lo storico dei trade copiati qui.
        </p>
      </div>

      {/* Placeholder Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                {['Data','Simbolo','Direzione','Entry','SL','TP','Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td colSpan={7} className="px-6 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                  Nessun dato disponibile
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
