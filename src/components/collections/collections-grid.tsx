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
        details: (
          <div className="space-y-2">
            {collection.description && (
              <div className="line-clamp-2 text-sm text-gray-500">
                {collection.description}
              </div>
            )}
            {collection.testTiles.length > 0 && (
              <div className="grid grid-cols-2 gap-1">
                {collection.testTiles.slice(0, 4).map((tile) => (
                  <div key={tile.id} className="aspect-square bg-gray-100">
                    {tile.imageUrl ? (
                      <img
                        src={tile.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-50">
                        <div className="text-[8px] text-gray-400">No image</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ),
      })}
    />
  )
} 