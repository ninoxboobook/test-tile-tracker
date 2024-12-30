import { type ReactNode } from 'react'
import { PhotoIcon } from '@heroicons/react/24/outline'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
  size?: 'small' | 'large'
  image?: ReactNode
}

export function EmptyState({ title, description, action, size = 'large', image }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-12">
      {image}
      <h3 className={`${size === 'large' ? 'text-base' : 'text-sm'} mt-2 font-medium text-clay-700`}>
        {title}
      </h3>
      <p className={`${size === 'large' ? 'text-base' : 'text-sm'} mt-1 text-clay-600`}>
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