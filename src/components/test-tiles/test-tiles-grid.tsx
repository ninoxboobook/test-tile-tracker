'use client'

import { TestTileWithRelations } from '@/types/test-tile'
import { DataGrid } from '../ui/data/data-grid'
import { DataGridTile } from '../ui/data/data-grid-tile'

interface TestTilesGridProps {
  testTiles: TestTileWithRelations[]
}

export function TestTilesGrid({ testTiles }: TestTilesGridProps) {
  return (
    <DataGrid
      items={testTiles}
      renderItem={(testTile) => ({
        id: testTile.id,
        href: `/test-tiles/${testTile.id}`,
        content: (
          <DataGridTile
            title={testTile.name}
            images={testTile.imageUrl ?? undefined}
            metadata={[
              ...(testTile.clayBody ? [{ label: 'Clay Body', value: testTile.clayBody.name }] : []),
              ...(testTile.atmosphere ? [{ label: 'Atmosphere', value: testTile.atmosphere.name }] : []),
              ...(testTile.cone ? [{ label: 'Cone', value: testTile.cone.name }] : []),
            ]}
          />
        ),
      })}
    />
  )
}