'use client'

import { useState, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts'
import { format, parseISO, subDays } from 'date-fns'
import { ChartSkeleton } from '../ui/LoadingSkeleton'
import { formatCurrency } from '@/lib/utils'

interface EquityDataPoint {
  timestamp: string
  equity: number
}

interface EquityCurveProps {
  data: EquityDataPoint[]
  isLoading?: boolean
  timeframe?: '7d' | '30d' | '90d'
  onTimeframeChange?: (timeframe: '7d' | '30d' | '90d') => void
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload[0]) {
    return (
      <div className="rounded-lg border border-border bg-surface p-3">
        <p className="text-xs text-secondary-text">
          {payload[0].payload.timestamp &&
            format(parseISO(payload[0].payload.timestamp), 'dd MMM HH:mm')}
        </p>
        <p className="font-mono font-semibold text-primary-text">
          {formatCurrency(payload[0].value || 0)}
        </p>
      </div>
    )
  }
  return null
}

export function EquityCurve({
  data,
  isLoading = false,
  timeframe = '30d',
  onTimeframeChange,
}: EquityCurveProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>(timeframe)

  const filteredData = useMemo(() => {
    if (!data.length) return []

    const now = new Date()
    const days = selectedTimeframe === '7d' ? 7 : selectedTimeframe === '30d' ? 30 : 90
    const cutoffDate = subDays(now, days)

    return data.filter((point) => new Date(point.timestamp) >= cutoffDate)
  }, [data, selectedTimeframe])

  const handleTimeframeChange = (tf: '7d' | '30d' | '90d') => {
    setSelectedTimeframe(tf)
    onTimeframeChange?.(tf)
  }

  if (isLoading) {
    return <ChartSkeleton />
  }

  return (
    <div className="card-premium space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-primary-text">Equity Curve</h3>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-all ${
                selectedTimeframe === tf
                  ? 'bg-accent-indigo/20 text-accent-indigo'
                  : 'bg-surface/50 text-secondary-text hover:bg-surface/70'
              }`}
            >
              {tf === '7d' ? '1W' : tf === '30d' ? '1M' : '3M'}
            </button>
          ))}
        </div>
      </div>

      {filteredData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => format(parseISO(value), 'dd MMM')}
              tick={{ fill: '#71717A', fontSize: 12 }}
              stroke="#1E1E2E"
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              tick={{ fill: '#71717A', fontSize: 12 }}
              stroke="#1E1E2E"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="equity"
              stroke="#6366F1"
              fillOpacity={1}
              fill="url(#colorEquity)"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-64 items-center justify-center text-secondary-text">
          Nessun dato disponibile
        </div>
      )}
    </div>
  )
}
