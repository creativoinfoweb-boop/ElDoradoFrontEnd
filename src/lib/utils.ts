import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { it } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  value: number,
  currency: string = 'USD',
  decimals: number = 2
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatPnL(pnl: number, includeSign: boolean = true): string {
  const sign = pnl >= 0 ? '+' : ''
  return includeSign ? `${sign}${formatCurrency(pnl)}` : formatCurrency(pnl)
}

export function formatPnLPercent(percent: number): string {
  const sign = percent >= 0 ? '+' : ''
  return `${sign}${formatNumber(percent, 2)}%`
}

export function getPnLColor(value: number): string {
  if (value > 0) return 'text-profit-green'
  if (value < 0) return 'text-loss-red'
  return 'text-secondary-text'
}

export function getPnLBgColor(value: number): string {
  if (value > 0) return 'bg-profit-green/10'
  if (value < 0) return 'bg-loss-red/10'
  return 'bg-secondary-text/10'
}

export function formatDate(date: string | Date, pattern: string = 'dd/MM/yyyy HH:mm'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, pattern, { locale: it })
  } catch {
    return 'Invalid date'
  }
}

export function formatDateShort(date: string | Date): string {
  return formatDate(date, 'dd MMM')
}

export function formatDateLong(date: string | Date): string {
  return formatDate(date, 'EEEE, dd MMMM yyyy')
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm:ss')
}

export function formatTimeAgo(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: it })
  } catch {
    return 'Invalid date'
  }
}

export function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h`
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  }
  return `${seconds}s`
}

export function formatWinRate(wins: number, total: number): string {
  if (total === 0) return '0%'
  const rate = (wins / total) * 100
  return `${formatNumber(rate, 1)}%`
}

export function getTradeTypeColor(type: 'buy' | 'sell'): string {
  return type === 'buy' ? 'text-profit-green' : 'text-loss-red'
}

export function getTradeTypeBgColor(type: 'buy' | 'sell'): string {
  return type === 'buy' ? 'bg-profit-green/10' : 'bg-loss-red/10'
}

export function getTradeTypeLabel(type: 'buy' | 'sell'): string {
  return type === 'buy' ? 'BUY' : 'SELL'
}

export function getStatusColor(
  status: 'running' | 'paused' | 'stopped' | 'error' | 'active' | 'cancelled' | 'pending'
): string {
  const colors: Record<string, string> = {
    running: 'text-profit-green',
    active: 'text-profit-green',
    paused: 'text-warning-yellow',
    pending: 'text-warning-yellow',
    stopped: 'text-secondary-text',
    error: 'text-loss-red',
    cancelled: 'text-secondary-text',
  }
  return colors[status] || 'text-secondary-text'
}

export function getStatusBgColor(
  status: 'running' | 'paused' | 'stopped' | 'error' | 'active' | 'cancelled' | 'pending'
): string {
  const colors: Record<string, string> = {
    running: 'bg-profit-green/10',
    active: 'bg-profit-green/10',
    paused: 'bg-warning-yellow/10',
    pending: 'bg-warning-yellow/10',
    stopped: 'bg-secondary-text/10',
    error: 'bg-loss-red/10',
    cancelled: 'bg-secondary-text/10',
  }
  return colors[status] || 'bg-secondary-text/10'
}

export function truncateAddress(address: string, chars: number = 4): string {
  if (address.length <= chars * 2 + 2) return address
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`
}

export function calculateRiskLot(
  balance: number,
  riskPercent: number,
  stopLossPips: number,
  pipValue: number = 10
): number {
  const riskAmount = balance * (riskPercent / 100)
  const lot = riskAmount / (stopLossPips * pipValue)
  return Math.round(lot * 100) / 100
}

export function calculateMaxLot(
  equity: number,
  maxRiskPercent: number,
  entryPrice: number,
  stopLoss: number
): number {
  const riskAmount = equity * (maxRiskPercent / 100)
  const pipsRisk = Math.abs(entryPrice - stopLoss)
  if (pipsRisk === 0) return 0
  const lot = riskAmount / (pipsRisk * 100000)
  return Math.round(lot * 100) / 100
}

export function calculatePnL(
  entryPrice: number,
  closePrice: number,
  quantity: number,
  isShort: boolean = false
): number {
  const priceDiff = closePrice - entryPrice
  const multiplier = isShort ? -1 : 1
  return priceDiff * quantity * multiplier
}

export function calculatePnLPercent(entryPrice: number, closePrice: number): number {
  return ((closePrice - entryPrice) / entryPrice) * 100
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function generateRandomColor(): string {
  const colors = ['bg-accent-indigo', 'bg-profit-green', 'bg-loss-red', 'bg-warning-yellow']
  return colors[Math.floor(Math.random() * colors.length)]
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
