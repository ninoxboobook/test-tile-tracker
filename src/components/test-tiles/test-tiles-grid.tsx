'use client'

import { TestTile, ClayBody, Collection, Decoration } from '@prisma/client'
import { BaseGrid } from '@/components/ui/data-view/base-grid'

type TestTileWithRelations = TestTile & {
  clayBody: ClayBody
  collections: Collection[]
  decorations: Decoration[]
}

interface TestTilesGridProps {
  testTiles: TestTileWithRelations[]
}

export function TestTilesGrid({ testTiles }: TestTilesGridProps) {
  return (
    <BaseGrid
      items={testTiles}
      renderItem={(testTile) => ({
        id: testTile.id,
        href: `/test-tiles/${testTile.id}`,
        title: testTile.name,
        imageUrl: testTile.imageUrl,
        details: (
          <div className="space-y-1">
            {testTile.stamp && (
              <div>Stamp: {testTile.stamp}</div>
            )}
            <div>Clay Body: {testTile.clayBody.name}</div>
            {testTile.collections.length > 0 && (
              <div>
                Collections: {testTile.collections.map(c => c.name).join(', ')}
              </div>
            )}
            {testTile.decorations.length > 0 && (
              <div>
                Decorations: {testTile.decorations.map(d => d.name).join(', ')}
              </div>
            )}
          </div>
        ),
      })}
    />
  )
} 