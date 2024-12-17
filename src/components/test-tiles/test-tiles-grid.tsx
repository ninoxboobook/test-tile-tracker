'use client'

import { TestTileWithRelations } from '@/types/test-tile'
import { DataGrid } from '../ui/data/data-grid'
import { DataGridTile } from '../ui/data/data-grid-tile'
import { LozengeVariant } from '../ui/lozenge'

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
            lozenges={[
              ...(testTile.atmosphere ? [{ label: testTile.atmosphere.name, lozengeVariant: 'brand-emphasis' as LozengeVariant }] : []),
              ...(testTile.cone ? [{ label: /^(Low|Mid|High)/.test(testTile.cone.name) ? testTile.cone.name : `Cone ${testTile.cone.name}`, lozengeVariant: 'brand' as LozengeVariant }] : []),
            ]}
            metadata={[
              ...(testTile.clayBody ? [{ value: testTile.clayBody.name }] : []),
              ...(testTile.decorationLayers.length > 0 ? [{
                value: testTile.decorationLayers
                  .sort((a, b) => a.order - b.order)
                  .flatMap(layer => layer.decorations.map(d => d.name))
                  .join(', ')
              }] : []),
            ]}
          />
        ),
      })}
    />
  )
}