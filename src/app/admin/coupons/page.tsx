'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { adminApi } from '@/lib/api'
import { Coupon } from '@/types'
import { Plus, Trash2 } from 'lucide-react'

export default function AdminCouponsPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENT' as const,
    discountValue: 10,
    maxUses: undefined as number | undefined,
  })

  useEffect(() => {
    if (!isAuthenticated || !user?.is_admin) {
      router.push('/dashboard')
      return
    }

    fetchCoupons()
  }, [isAuthenticated, user, router])

  const fetchCoupons = async () => {
    try {
      const res = await adminApi.listCoupons()
      setCoupons(res.data.coupons || [])
    } catch (err) {
      console.error('Error fetching coupons:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCoupon = async () => {
    try {
      await adminApi.createCoupon({
        code: formData.code,
        discount_type: formData.discountType,
        discount_value: formData.discountValue,
        max_uses: formData.maxUses,
      })
      setFormData({ code: '', discountType: 'PERCENT', discountValue: 10, maxUses: undefined })
      setShowModal(false)
      await fetchCoupons()
    } catch (err) {
      console.error('Error creating coupon:', err)
    }
  }

  const handleDeleteCoupon = async (couponId: string) => {
    if (confirm('Sei sicuro?')) {
      try {
        await adminApi.deleteCoupon(couponId)
        await fetchCoupons()
      } catch (err) {
        console.error('Error deleting coupon:', err)
      }
    }
  }

  if (loading) {
    return <div className="text-[#A1A1AA]">Caricamento...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#F4F4F5]">Gestione Coupon</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#F5A623] text-[#070710] rounded-lg font-semibold hover:bg-[#F5A623]/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nuovo Coupon
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#12121F] border border-[#1E1E35] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#F4F4F5] mb-4">Crea Coupon</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Codice coupon"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full bg-[#0A0A14] border border-[#1E1E35] rounded-lg px-3 py-2 text-[#F4F4F5] placeholder-[#A1A1AA] focus:border-[#F5A623] focus:outline-none"
              />

              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                className="w-full bg-[#0A0A14] border border-[#1E1E35] rounded-lg px-3 py-2 text-[#F4F4F5] focus:border-[#F5A623] focus:outline-none"
              >
                <option value="PERCENT">Percentuale (%)</option>
                <option value="FIXED">Fisso (€)</option>
              </select>

              <input
                type="number"
                placeholder="Valore sconto"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                className="w-full bg-[#0A0A14] border border-[#1E1E35] rounded-lg px-3 py-2 text-[#F4F4F5] placeholder-[#A1A1AA] focus:border-[#F5A623] focus:outline-none"
              />

              <input
                type="number"
                placeholder="Max utilizzi (opzionale)"
                value={formData.maxUses || ''}
                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full bg-[#0A0A14] border border-[#1E1E35] rounded-lg px-3 py-2 text-[#F4F4F5] placeholder-[#A1A1AA] focus:border-[#F5A623] focus:outline-none"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-[#1A1A2E] border border-[#1E1E35] rounded-lg text-[#F4F4F5] hover:bg-[#22121F] transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handleCreateCoupon}
                  className="flex-1 px-4 py-2 bg-[#F5A623] text-[#070710] rounded-lg font-semibold hover:bg-[#F5A623]/90 transition-colors"
                >
                  Crea
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coupons Table */}
      <div className="rounded-lg bg-[#12121F] border border-[#1E1E35] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E1E35]">
                <th className="px-6 py-3 text-left font-semibold text-[#A1A1AA]">Codice</th>
                <th className="px-6 py-3 text-left font-semibold text-[#A1A1AA]">Tipo</th>
                <th className="px-6 py-3 text-left font-semibold text-[#A1A1AA]">Valore</th>
                <th className="px-6 py-3 text-left font-semibold text-[#A1A1AA]">Utilizzi</th>
                <th className="px-6 py-3 text-left font-semibold text-[#A1A1AA]">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-[#A1A1AA]">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#71717A]">
                    Nessun coupon
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-[#1E1E35] hover:bg-[#1A1A2E] transition-colors">
                    <td className="px-6 py-3 font-mono font-semibold text-[#F5A623]">{coupon.code}</td>
                    <td className="px-6 py-3 text-[#A1A1AA]">{coupon.discount_type}</td>
                    <td className="px-6 py-3 text-[#F4F4F5]">
                      {coupon.discount_value}{coupon.discount_type === 'PERCENT' ? '%' : '€'}
                    </td>
                    <td className="px-6 py-3 text-[#A1A1AA]">
                      {coupon.uses_count}/{coupon.max_uses || '∞'}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${coupon.is_active ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-loss-red/20 text-loss-red'}`}>
                        {coupon.is_active ? 'Attivo' : 'Disabilitato'}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="text-loss-red hover:bg-loss-red/10 p-2 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
