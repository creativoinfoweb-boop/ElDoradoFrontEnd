import { cn } from '@/lib/utils'

type Status = 'running' | 'paused' | 'stopped' | 'error' | 'active' | 'cancelled' | 'pending'

interface StatusBadgeProps {
  status: Status
  label?: string
  showPulse?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const statusConfig: Record<Status, { bg: string; text: string; dot: string }> = {
  running: {
    bg: 'bg-profit-green/10',
    text: 'text-profit-green',
    dot: 'bg-profit-green',
  },
  active: {
    bg: 'bg-profit-green/10',
    text: 'text-profit-green',
    dot: 'bg-profit-green',
  },
  paused: {
    bg: 'bg-warning-yellow/10',
    text: 'text-warning-yellow',
    dot: 'bg-warning-yellow',
  },
  pending: {
    bg: 'bg-warning-yellow/10',
    text: 'text-warning-yellow',
    dot: 'bg-warning-yellow',
  },
  stopped: {
    bg: 'bg-secondary-text/10',
    text: 'text-secondary-text',
    dot: 'bg-secondary-text',
  },
  error: {
    bg: 'bg-loss-red/10',
    text: 'text-loss-red',
    dot: 'bg-loss-red',
  },
  cancelled: {
    bg: 'bg-secondary-text/10',
    text: 'text-secondary-text',
    dot: 'bg-secondary-text',
  },
}

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
  lg: 'px-3 py-2 text-base',
}

const statusLabel: Record<Status, string> = {
  running: 'Running',
  active: 'Active',
  paused: 'Paused',
  pending: 'Pending',
  stopped: 'Stopped',
  error: 'Error',
  cancelled: 'Cancelled',
}

export function StatusBadge({
  status,
  label,
  showPulse = true,
  size = 'md',
}: StatusBadgeProps) {
  // If status is undefined/null, use a safe default
  const safeStatus = status || 'stopped'
  const config = statusConfig[safeStatus] || {
    bg: 'bg-secondary-text/10',
    text: 'text-secondary-text',
    dot: 'bg-secondary-text',
  }
  const displayLabel = label || statusLabel[safeStatus] || safeStatus || 'Unknown'

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full font-medium',
        config.bg,
        config.text,
        sizeConfig[size]
      )}
    >
      <div
        className={cn('h-1.5 w-1.5 rounded-full', config.dot, {
          'animate-pulse-glow': showPulse && (safeStatus === 'running' || safeStatus === 'active'),
        })}
      />
      {displayLabel}
    </div>
  )
}
