'use client'

import Link from 'next/link'

interface DataGridProps<T> {
  items: T[]
  renderItem: (item: T) => {
    id: string
    href: string
    content: React.ReactNode
  }
}

export function DataGrid<T>({ items, renderItem }: DataGridProps<T>) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const { id, href, content } = renderItem(item)
        return (
          <Link
            key={id}
            href={href}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-clay-200 bg-white hover:border-clay-300"
          >
            {content}
          </Link>
        )
      })}
    </div>
  )
}