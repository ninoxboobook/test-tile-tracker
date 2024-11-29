'use client'

import Image from 'next/image'
import Link from 'next/link'

interface BaseGridProps<T> {
  items: T[]
  renderItem: (item: T) => {
    id: string
    href: string
    title: string
    imageUrl?: string | null
    details: React.ReactNode
  }
}

export function BaseGrid<T>({ items, renderItem }: BaseGridProps<T>) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const { id, href, title, imageUrl, details } = renderItem(item)
        return (
          <Link
            key={id}
            href={href}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
          >
            <div className="aspect-square bg-gray-100 group-hover:opacity-75">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  width={300}
                  height={300}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-50">
                  <div className="text-gray-400">No image</div>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col space-y-2 p-4">
              <h3 className="text-sm font-medium text-gray-900">{title}</h3>
              <div className="flex flex-1 flex-col justify-end">
                <div className="text-sm text-gray-500">{details}</div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
} 