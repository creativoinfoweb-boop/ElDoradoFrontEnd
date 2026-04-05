'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { BotStatusCard } from '@/components/trading/BotStatusCard'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import type { BotInstance, MT5Account } from '@/types'

export default function BotsPage() {
  const [showModal, setShowModal] = useState(false)
  const [botName, setBotName] = useState('')
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const { data: bots = [], isLoading: botsLoading, refetch: refetchBots } = useQuery({
    queryKey: ['bots'],
    queryFn: async () => {
      const response = await api.get('/bots')
      return response.data || []
    },
  })

  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await api.get('/accounts/mt5')
      return response.data || []
    },
  })

  const handleStartBot = async (botId: string) => {
    setActionLoading(botId)
    try {
      await api.post(`/bots/${botId}/start`)
      refetchBots()
    } catch (error: any) {
      console.error('Start bot error:', error.response?.data)
      alert(error.response?.data?.detail || 'Errore nell\'avvio del bot')
    } finally {
      setActionLoading(null)
    }
  }

  const handleStopBot = async (botId: string) => {
    setActionLoading(botId)
    try {
      await api.post(`/bots/${botId}/stop`)
      refetchBots()
    } catch (error: any) {
      console.error('Stop bot error:', error.response?.data)
      alert(error.response?.data?.detail || 'Errore nello stop del bot')
    } finally {
      setActionLoading(null)
    }
  }

  const handlePauseBot = async (botId: string) => {
    setActionLoading(botId)
    try {
      await api.post(`/bots/${botId}/pause`)
      refetchBots()
    } catch (error: any) {
      console.error('Pause bot error:', error.response?.data)
      alert(error.response?.data?.detail || 'Errore nella pausa del bot')
    } finally {
      setActionLoading(null)
    }
  }

  const handleResumeBot = async (botId: string) => {
    setActionLoading(botId)
    try {
      await api.post(`/bots/${botId}/resume`)
      refetchBots()
    } catch (error: any) {
      console.error('Resume bot error:', error.response?.data)
      alert(error.response?.data?.detail || 'Errore nella ripresa del bot')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCreateBot = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!botName.trim() || !selectedAccountId) {
      alert('Compila tutti i campi')
      return
    }

    setIsSubmitting(true)
    try {
      await api.post('/bots', {
        name: botName,
        mt5_account_id: selectedAccountId,
        symbol: 'XAUUSD',
        risk_percent: 2.0,
        max_lot: 1.0,
        tp_strategy: { type: 'fixed', tps: [100, 200, 300] },
      })
      setBotName('')
      setSelectedAccountId('')
      setShowModal(false)
      refetchBots()
    } catch (error: any) {
      const errorDetail = error.response?.data?.detail ||
                         error.response?.data?.error ||
                         error.message ||
                         'Errore nella creazione del bot'
      console.error('Create bot error:', error.response?.data)
      alert(errorDetail)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = botsLoading || accountsLoading

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#E4E4E7]">I Miei Bot</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold rounded-lg transition-colors"
        >
          + Nuovo Bot
        </button>
      </div>

      {/* Bot Grid */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : bots.length === 0 ? (
        <EmptyState message="Nessun bot configurato. Creane uno nuovo!" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bots.map((bot: BotInstance) => (
            <BotStatusCard
              key={bot.id}
              bot={bot}
              onStart={handleStartBot}
              onStop={handleStopBot}
              onPause={handlePauseBot}
              onResume={handleResumeBot}
              isLoading={actionLoading === bot.id}
            />
          ))}
        </div>
      )}

      {/* Modal Creazione Bot */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#12121A] border border-[#1E1E2E] rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-[#E4E4E7] mb-4">
              Crea Nuovo Bot
            </h2>

            <form onSubmit={handleCreateBot} className="space-y-4">
              {/* Bot Name */}
              <div>
                <label className="block text-sm font-medium text-[#E4E4E7] mb-2">
                  Nome Bot
                </label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="Es. Bot XAU Demo"
                  className="w-full px-4 py-2 bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg text-[#E4E4E7] placeholder-[#71717A] focus:outline-none focus:border-[#6366F1] transition-colors"
                />
              </div>

              {/* Account Selection */}
              <div>
                <label className="block text-sm font-medium text-[#E4E4E7] mb-2">
                  Account MT5
                </label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg text-[#E4E4E7] focus:outline-none focus:border-[#6366F1] transition-colors"
                >
                  <option value="">-- Seleziona account --</option>
                  {accounts.map((account: MT5Account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} - {account.mt5_server}{' '}
                      {account.account_type === 'demo' ? '(Demo)' : '(Live)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-[#1E1E2E] hover:bg-[#2A2A38] text-[#E4E4E7] font-semibold rounded-lg transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Creazione...' : 'Crea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
