'use client'

import { Collection, TestTile } from '@prisma/client'
import { DataGrid } from '@/components/ui/data/data-grid'
import { DataGridTile } from '@/components/ui/data/data-grid-tile'

interface CollectionsGridProps {
  collections: (Collection & {
    testTiles: Pick<TestTile, 'id' | 'imageUrl'>[]
  })[]
}

export function CollectionsGrid({ collections }: CollectionsGridProps) {
  return (
    <DataGrid
      items={collections}
      renderItem={(collection) => ({
        id: collection.id,
        href: `/collections/${collection.id}`,
        content: (
          <DataGridTile
            variant="quad"
            title={collection.name}
            images={collection.testTiles.map(tile => tile?.imageUrl?.[0])}
            description={collection.description ?? undefined}
          />
        ),
      })}
    />
  )
}