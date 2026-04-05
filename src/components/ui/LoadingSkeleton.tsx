import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
  width?: string
  height?: string
}

export function LoadingSkeleton({
  className,
  width = 'w-full',
  height = 'h-4',
}: LoadingSkeletonProps) {
  return (
    <div className={cn('animate-shimmer rounded bg-secondary-text/10', width, height, className)} />
  )
}

export function KPICardSkeleton() {
  return (
    <div className="card-premium space-y-3">
      <LoadingSkeleton height="h-4" width="w-24" />
      <LoadingSkeleton height="h-8" width="w-32" />
      <LoadingSkeleton height="h-3" width="w-16" />
    </div>
  )
}

export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <tr className="border-b border-border hover:bg-surface/30">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <LoadingSkeleton height="h-4" />
        </td>
      ))}
    </tr>
  )
}

export function ChartSkeleton() {
  return (
    <div className="card-premium space-y-4">
      <LoadingSkeleton height="h-4" width="w-32" />
      <LoadingSkeleton height="h-64" />
      <div className="flex gap-2">
        <LoadingSkeleton height="h-8" width="w-16" />
        <LoadingSkeleton height="h-8" width="w-16" />
        <LoadingSkeleton height="h-8" width="w-16" />
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="card-premium space-y-4">
      <div className="flex items-start justify-between">
        <LoadingSkeleton height="h-5" width="w-32" />
        <LoadingSkeleton height="h-5" width="w-5" />
      </div>
      <LoadingSkeleton height="h-6" width="w-24" />
      <LoadingSkeleton height="h-4" width="w-40" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card-premium overflow-hidden">
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-1">
          <LoadingSkeleton height="h-4" width="w-24" />
          <LoadingSkeleton height="h-10" />
        </div>
      ))}
      <LoadingSkeleton height="h-10" width="w-20" />
    </div>
  )
}
