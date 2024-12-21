'use client'

import Link from 'next/link'
import { Table } from '@tanstack/react-table'

interface DataGridProps<T> {
  items: T[]
  renderItem: (item: T) => {
    id: string
    href: string
    content: React.ReactNode
  }
  table?: Table<T>
}

export function DataGrid<T>({ items, renderItem, table }: DataGridProps<T>) {
  const paginatedItems = table 
    ? table.getRowModel().rows.map(row => row.original)
    : items

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {paginatedItems.map((item) => {
        const { id, href, content } = renderItem(item)
        return (
          <Link
            key={id}
            href={href}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-clay-200 bg-clay-50 hover:border-clay-300"
          >
            {content}
          </Link>
        )
      })}
    </div>
  )
}