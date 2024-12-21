'use client'

import { TestTileWithRelations } from '@/types/test-tile'
import { DataGrid } from '../ui/data/data-grid'
import { DataGridTile } from '../ui/data/data-grid-tile'
import { LozengeVariant } from '../ui/lozenge'
import { Table } from '@tanstack/react-table'

interface TestTilesGridProps {
  testTiles: TestTileWithRelations[]
  table?: Table<TestTileWithRelations>
}

export function TestTilesGrid({ testTiles, table }: TestTilesGridProps) {
  const renderTestTile = (testTile: TestTileWithRelations) => ({
    id: testTile.id,
    href: `/test-tiles/${testTile.id}`,
    content: (
      <DataGridTile
        title={testTile.name}
        images={testTile.imageUrl ?? undefined}
        subtitle={testTile.clayBody?.name ?? undefined}
        lozenges={[
          ...(testTile.atmosphere ? [{ label: testTile.atmosphere.name, lozengeVariant: 'brand-emphasis' as LozengeVariant }] : []),
          ...(testTile.cone ? [{ label: /^(Low|Mid|High)/.test(testTile.cone.name) ? testTile.cone.name : `Cone ${testTile.cone.name}`, lozengeVariant: 'brand' as LozengeVariant }] : []),
        ]}
        metadata={[
          ...(testTile.decorationLayers.length > 0 ? [{
            value: testTile.decorationLayers
              .sort((a, b) => a.order - b.order)
              .flatMap(layer => layer.decorations.map(d => d.name))
              .join(', ')
          }] : []),
        ]}
      />
    ),
  })

  return (
    <DataGrid
      items={testTiles}
      renderItem={renderTestTile}
      table={table}
    />
  )
}