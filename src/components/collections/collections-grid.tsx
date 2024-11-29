'use client'

import { Collection, TestTile } from '@prisma/client'
import { BaseGrid } from '@/components/ui/data-view/base-grid'

interface CollectionsGridProps {
  collections: (Collection & {
    testTiles: Pick<TestTile, 'id' | 'imageUrl'>[]
  })[]
}

export function CollectionsGrid({ collections }: CollectionsGridProps) {
  return (
    <BaseGrid
      items={collections}
      renderItem={(collection) => ({
        id: collection.id,
        href: `/collections/${collection.id}`,
        title: collection.name,
        content: (
          <div className="flex flex-col">
            <div className="grid grid-cols-2 gap-1 p-2">
              {Array.from({ length: 4 }).map((_, index) => {
                const tile = collection.testTiles[index]
                return (
                  <div key={tile?.id ?? index} className="aspect-square bg-gray-50">
                    {tile?.imageUrl ? (
                      <img
                        src={tile.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full border-2 border-dashed border-gray-200" />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex flex-1 flex-col space-y-2 p-4 pt-2">
              <h3 className="text-sm font-medium text-gray-900">{collection.name}</h3>
              {collection.description && (
                <div className="line-clamp-2 text-sm text-gray-500">
                  {collection.description}
                </div>
              )}
            </div>
          </div>
        ),
      })}
    />
  )
} 