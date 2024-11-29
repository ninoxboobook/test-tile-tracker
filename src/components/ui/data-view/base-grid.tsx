'use client'

import Link from 'next/link'

interface BaseGridProps<T> {
  items: T[]
  renderItem: (item: T) => {
    id: string
    href: string
    title: string
    content: React.ReactNode
  }
}

export function BaseGrid<T>({ items, renderItem }: BaseGridProps<T>) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const { id, href, title, content } = renderItem(item)
        return (
          <Link
            key={id}
            href={href}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white hover:border-gray-300"
          >
            {content}
          </Link>
        )
      })}
    </div>
  )
} 