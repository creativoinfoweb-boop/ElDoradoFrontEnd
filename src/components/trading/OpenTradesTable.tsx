'use client'

import { Trade } from '@/types'
import { formatNumber, formatPnL, getPnLColor } from '@/lib/utils'
import { TableRowSkeleton } from '../ui/LoadingSkeleton'
import { EmptyState } from '../ui/EmptyState'
import { TrendingUp } from 'lucide-react'

interface OpenTradesTableProps {
  trades: Trade[]
  isLoading?: boolean
}

export function OpenTradesTable({ trades, isLoading = false }: OpenTradesTableProps) {
  if (isLoading) {
    return (
      <div className="card-premium overflow-hidden">
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRowSkeleton key={i} columns={8} />
          ))}
        </div>
      </div>
    )
  }

  if (!trades.length) {
    return (
      <div className="card-premium">
        <EmptyState
          icon={TrendingUp}
          title="Nessun trade aperto"
          description="I tuoi trade aperti appariranno qui"
        />
      </div>
    )
  }

  return (
    <div className="card-premium overflow-x-auto scrollbar-thin">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left font-semibold text-secondary-text">Ticket</th>
            <th className="px-4 py-3 text-left font-semibold text-secondary-text">Type</th>
            <th className="px-4 py-3 text-right font-semibold text-secondary-text">Entry</th>
            <th className="px-4 py-3 text-right font-semibold text-secondary-text">Lot</th>
            <th className="px-4 py-3 text-right font-semibold text-secondary-text">SL</th>
            <th className="px-4 py-3 text-right font-semibold text-secondary-text">TP</th>
            <th className="px-4 py-3 text-right font-semibold text-secondary-text">PnL</th>
            <th className="px-4 py-3 text-right font-semibold text-secondary-text">Durata</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {trades.map((trade) => {
            const pnl = trade.pnl || 0
            const duration = trade.entryTime
              ? Math.floor((new Date().getTime() - new Date(trade.entryTime).getTime()) / 1000)
              : 0
            const hours = Math.floor(duration / 3600)
            const minutes = Math.floor((duration % 3600) / 60)

            return (
              <tr key={trade.id} className="border-hover transition-colors hover:bg-surface/30">
                <td className="px-4 py-3 font-mono text-primary-text">{trade.ticket}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded px-2 py-1 text-xs font-semibold ${
                      trade.tradeType === 'buy'
                        ? 'bg-profit-green/20 text-profit-green'
                        : 'bg-loss-red/20 text-loss-red'
                    }`}
                  >
                    {trade.tradeType === 'buy' ? 'BUY' : 'SELL'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-primary-text">
                  {formatNumber(trade.entryPrice, 5)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-primary-text">
                  {formatNumber(trade.quantity, 2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-loss-red">
                  {formatNumber(trade.stopLoss, 5)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-profit-green">
                  {formatNumber(trade.takeProfit, 5)}
                </td>
                <td className={`px-4 py-3 text-right font-mono font-semibold ${getPnLColor(pnl)}`}>
                  {formatPnL(pnl)}
                </td>
                <td className="px-4 py-3 text-right text-secondary-text">
                  {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
