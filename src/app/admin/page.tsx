'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { adminApi } from '@/lib/api'
import { AdminStats } from '@/types'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !user?.is_admin) {
      router.push('/dashboard')
      return
    }

    const fetchStats = async () => {
      try {
        const res = await adminApi.getStats()
        setStats(res.data)
      } catch (err) {
        console.error('Error fetching admin stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated, user, router])

  if (loading) {
    return <div className="text-[#A1A1AA]">Caricamento...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#F4F4F5]">Admin Dashboard</h1>
        <p className="text-[#A1A1AA] mt-2">Panoramica del sistema</p>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-[#12121F] border border-[#1E1E35] p-6">
            <p className="text-[#A1A1AA] text-sm font-medium">Utenti Totali</p>
            <p className="text-4xl font-bold text-[#F4F4F5] mt-2">{stats.users_total}</p>
          </div>
          <div className="rounded-lg bg-[#12121F] border border-[#1E1E35] p-6">
            <p className="text-[#A1A1AA] text-sm font-medium">Subscription Attive</p>
            <p className="text-4xl font-bold text-[#22C55E] mt-2">{stats.subscriptions_active}</p>
          </div>
          <div className="rounded-lg bg-[#12121F] border border-[#1E1E35] p-6">
            <p className="text-[#A1A1AA] text-sm font-medium">Trial Attivi</p>
            <p className="text-4xl font-bold text-[#F5A623] mt-2">{stats.trials_active}</p>
          </div>
          <div className="rounded-lg bg-[#12121F] border border-[#1E1E35] p-6">
            <p className="text-[#A1A1AA] text-sm font-medium">Segnali Oggi</p>
            <p className="text-4xl font-bold text-[#6366F1] mt-2">{stats.signals_today}</p>
          </div>
        </div>
      )}

      {/* Recent Signals */}
      <div className="rounded-lg bg-[#12121F] border border-[#1E1E35] p-6">
        <h2 className="text-lg font-semibold text-[#F4F4F5] mb-4">Ultimi Segnali</h2>
        <div className="text-[#A1A1AA] text-center py-8">
          Nessun dato disponibile. Integrazione segnali in corso...
        </div>
      </div>
    </div>
  )
}
