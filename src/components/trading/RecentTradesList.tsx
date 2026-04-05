'use client'

import { Trade } from '@/types'
import { formatPnL, formatTimeAgo, getPnLColor } from '@/lib/utils'
import { EmptyState } from '../ui/EmptyState'
import { History } from 'lucide-react'

interface RecentTradesListProps {
  trades: Trade[]
  limit?: number
}

export function RecentTradesList({ trades, limit = 10 }: RecentTradesListProps) {
  const recentTrades = trades.slice(0, limit)

  if (!recentTrades.length) {
    return (
      <div className="card-premium">
        <EmptyState
          icon={History}
          title="Nessun trade chiuso"
          description="I tuoi trade completati appariranno qui"
        />
      </div>
    )
  }

  return (
    <div className="card-premium space-y-2">
      <h3 className="font-semibold text-primary-text">Trade Recenti</h3>
      <div className="space-y-1">
        {recentTrades.map((trade) => {
          const pnl = trade.pnl || 0
          const isWin = pnl > 0

          return (
            <div
              key={trade.id}
              className="flex items-center justify-between rounded px-3 py-2 transition-colors hover:bg-surface/50"
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`h-2 w-2 rounded-full ${isWin ? 'bg-profit-green' : 'bg-loss-red'}`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary-text">
                    {trade.tradeType.toUpperCase()} {trade.symbol}
                  </p>
                  <p className="text-xs text-secondary-text">
                    {trade.closedAt && formatTimeAgo(trade.closedAt)}
                  </p>
                </div>
              </div>
              <div className={`text-right font-mono font-semibold ${getPnLColor(pnl)}`}>
                <p>{formatPnL(pnl)}</p>
                <p className="text-xs">
                  {trade.pnlPercent ? `${trade.pnlPercent > 0 ? '+' : ''}${trade.pnlPercent.toFixed(2)}%` : '-'}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
