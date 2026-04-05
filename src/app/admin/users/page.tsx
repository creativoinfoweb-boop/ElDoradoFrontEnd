'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { adminApi } from '@/lib/api'
import { AdminUser } from '@/types'

export default function AdminUsersPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !user?.is_admin) {
      router.push('/dashboard')
      return
    }

    const fetchUsers = async () => {
      try {
        const res = await adminApi.listUsers()
        setUsers(res.data.users || [])
      } catch (err) {
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [isAuthenticated, user, router])

  if (loading) {
    return <div className="text-[#A1A1AA]">Caricamento...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#F4F4F5]">Gestione Utenti</h1>

      {/* Users Table */}
      <div className="rounded-lg bg-[#12121F] border border-[#1E1E35] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E1E35]">
                <th className="px-6 py-3 text-left font-semibold text-[#A1A1AA]">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-[#A1A1AA]">Username</th>
                <th className="px-6 py-3 text-left font-semibold text-[#A1A1AA]">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-[#A1A1AA]">Subscription</th>
                <th className="px-6 py-3 text-left font-semibold text-[#A1A1AA]">Data Registrazione</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#71717A]">
                    Nessun utente trovato
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-[#1E1E35] hover:bg-[#1A1A2E] transition-colors">
                    <td className="px-6 py-3 font-semibold text-[#F4F4F5]">{u.email}</td>
                    <td className="px-6 py-3 text-[#A1A1AA]">{u.username}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          u.is_active ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-loss-red/20 text-loss-red'
                        }`}
                      >
                        {u.is_active ? 'Attivo' : 'Inattivo'}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          u.subscription_status ? 'bg-[#F5A623]/20 text-[#F5A623]' : 'bg-[#1E1E35]/30 text-[#71717A]'
                        }`}
                      >
                        {u.subscription_status ? 'Attiva' : 'Nessuno'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[#A1A1AA] text-xs">
                      {new Date(u.created_at).toLocaleDateString('it-IT')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
