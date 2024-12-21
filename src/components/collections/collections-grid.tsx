'use client'

import { Collection, TestTile } from '@prisma/client'
import { DataGrid } from '@/components/ui/data/data-grid'
import { DataGridTile } from '@/components/ui/data/data-grid-tile'
import { Table } from '@tanstack/react-table'

type CollectionWithTiles = Collection & {
  testTiles: Pick<TestTile, 'id' | 'imageUrl'>[]
}

interface CollectionsGridProps {
  collections: CollectionWithTiles[]
  table?: Table<CollectionWithTiles>
}

export function CollectionsGrid({ collections, table }: CollectionsGridProps) {
  const renderCollection = (collection: CollectionWithTiles) => ({
    id: collection.id,
    href: `/collections/${collection.id}`,
    content: (
      <DataGridTile
        variant="quad"
        title={collection.name}
        images={collection.testTiles.map((tile: Pick<TestTile, 'id' | 'imageUrl'>) => tile?.imageUrl?.[0])}
        description={collection.description ?? undefined}
      />
    ),
  })

  return (
    <DataGrid
      items={collections}
      renderItem={renderCollection}
      table={table}
    />
  )
}