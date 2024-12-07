'use client'

import { TestTileWithRelations } from '@/types/test-tile'
import Link from 'next/link'
import { BaseGrid } from '../ui/data-view/base-grid'

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
        content: (
          <div className="flex flex-col">
            <div className="aspect-square bg-gray-50">
              {testTile.imageUrl ? (
                <img
                  src={testTile.imageUrl}
                  alt={testTile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-full w-full border-2 border-dashed border-gray-200" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col space-y-2 p-4">
              <h3 className="text-sm font-medium text-gray-900">{testTile.name}</h3>
              <div className="space-y-1 text-sm text-gray-500">
                {testTile.stamp && <div>Stamp: {testTile.stamp}</div>}
                <div>Clay Body: {testTile.clayBody.name}</div>
                {testTile.collections.length > 0 && (
                  <div>Collections: {testTile.collections.map(c => c.name).join(', ')}</div>
                )}
                {testTile.decorationLayers.length > 0 && (
                  <div>Decorations: {testTile.decorationLayers.map(d => d.decorations.map(dd => dd.name).join(', ')).join(', ')}</div>
                )}
              </div>
            </div>
          </div>
        ),
      })}
    />
  )
} 