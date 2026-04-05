import { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

type EmptyStateAction = {
  label: string
  onClick: () => void
}

// Support both:
// - legacy usage: <EmptyState message="..." />
// - rich usage:   <EmptyState icon={...} title="..." description="..." />
type EmptyStateProps =
  | {
      message: string
      className?: string
      action?: EmptyStateAction
    }
  | {
      icon?: LucideIcon
      title: string
      description: string
      className?: string
      action?: EmptyStateAction
    }

export function EmptyState({
  className = '',
  action,
  ...rest
}: EmptyStateProps) {
  const Icon =
    'icon' in rest && rest.icon ? rest.icon : Inbox
  const title = 'title' in rest ? rest.title : 'Nessun dato'
  const description = 'description' in rest ? rest.description : rest.message

  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <Icon className="mb-4 h-12 w-12 text-secondary-text opacity-50" />
      <h3 className="mb-1 text-lg font-semibold text-primary-text">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-secondary-text">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 rounded-lg bg-accent-indigo px-4 py-2 font-medium text-white transition-all hover:bg-accent-indigo/90"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
