'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LoadingSkeleton } from '../ui/LoadingSkeleton'

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  variant?: 'default' | 'success' | 'danger'
  isLoading?: boolean
  className?: string
  suffix?: string
  prefix?: string
}

export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  variant = 'default',
  isLoading = false,
  className,
  suffix,
  prefix,
}: KPICardProps) {
  const changeColor = change && change >= 0 ? 'text-profit-green' : 'text-loss-red'
  const changeSign = change && change >= 0 ? '+' : ''

  if (isLoading) {
    return <LoadingSkeleton className={className} height="h-32" />
  }

  return (
    <div className={cn('card-premium group', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-text">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-primary-text font-mono">
              {prefix && <span className="text-xl">{prefix}</span>}
              {value}
              {suffix && <span className="text-xl">{suffix}</span>}
            </h3>
            {change !== undefined && (
              <span className={cn('text-sm font-semibold', changeColor)}>
                {changeSign}{change.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
        <div
          className={cn('rounded-lg p-3 transition-all', {
            'bg-profit-green/10 text-profit-green': variant === 'success',
            'bg-loss-red/10 text-loss-red': variant === 'danger',
            'bg-accent-indigo/10 text-accent-indigo': variant === 'default',
          })}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
