import { type ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  )
} 