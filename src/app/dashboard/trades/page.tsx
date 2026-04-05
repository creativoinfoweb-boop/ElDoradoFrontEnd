'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { Trade } from '@/types'

export default function TradesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['trades', 'open'],
    queryFn: async (): Promise<Trade[]> => {
      const response = await api.get('/trades/open')
      return response.data.data || []
    },
    staleTime: 5000,
    gcTime: 10000,
    retry: false,
  })

  const trades = data ?? []

  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0)
  const totalPnLPercent = trades.reduce((sum, trade) => sum + (trade.pnlPercent || 0), 0)

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 5 }).format(price)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value)

  return (
    <div className="space-y-6">
      {/* Header con totali */}
      <div className="glass-cyber rounded-xl p-6 relative">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Trade Aperti</h1>
          <div className="flex gap-6">
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>PnL Totale</p>
              <p className="text-2xl font-bold" style={{ color: totalPnL >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {formatCurrency(totalPnL)}
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>PnL %</p>
              <p className="text-2xl font-bold" style={{ color: totalPnLPercent >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {totalPnLPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabella Trade */}
      <div className="glass-cyber rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6"><LoadingSkeleton /></div>
        ) : trades.length === 0 ? (
          <div className="p-6"><EmptyState message="Nessun trade aperto al momento" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  {['Ticket','Tipo','Entry','Lot','SL','TP','PnL','%'].map((h, i) => (
                    <th key={h}
                      className={`px-6 py-3 text-xs font-semibold uppercase ${i >= 2 ? 'text-right' : 'text-left'}`}
                      style={{ color: 'var(--text-secondary)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--glass-bg)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  >
                    <td className="px-6 py-4 text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
                      {trade.ticket}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge
                        status={trade.tradeType === 'buy' ? 'active' : 'stopped'}
                        label={trade.tradeType === 'buy' ? 'BUY' : 'SELL'}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-mono" style={{ color: 'var(--text-primary)' }}>
                      {formatPrice(trade.entryPrice)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-mono" style={{ color: 'var(--text-primary)' }}>
                      {trade.quantity.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-mono" style={{ color: 'var(--red)' }}>
                      {formatPrice(trade.stopLoss)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-mono" style={{ color: 'var(--green)' }}>
                      {formatPrice(trade.takeProfit)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold font-mono"
                      style={{ color: (trade.pnl || 0) >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {formatCurrency(trade.pnl || 0)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold"
                      style={{ color: (trade.pnlPercent || 0) >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {((trade.pnlPercent || 0) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
