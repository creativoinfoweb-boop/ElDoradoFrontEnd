'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

export default function AdminSignalsPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !user?.is_admin) {
      router.push('/dashboard')
    }
    setLoading(false)
  }, [isAuthenticated, user, router])

  if (loading) {
    return <div className="text-[#A1A1AA]">Caricamento...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#F4F4F5]">Gestione Segnali</h1>

      {/* Placeholder */}
      <div className="rounded-lg bg-[#12121F] border border-[#1E1E35] p-8 text-center">
        <p className="text-[#A1A1AA]">Integrazione segnali in sviluppo</p>
        <p className="text-sm text-[#71717A] mt-2">Visualizza e gestisci i segnali master qui</p>
      </div>
    </div>
  )
}
