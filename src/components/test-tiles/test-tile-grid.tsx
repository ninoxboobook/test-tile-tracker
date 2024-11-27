import Link from 'next/link'
import { type TestTile, type Collection, type ClayBody, type Decoration } from '@prisma/client'
import { EmptyState } from '@/components/ui/empty-state'

export type TestTileWithRelations = TestTile & {
  collections: Collection[]
  clayBody: ClayBody
  decorations: Decoration[]
}

interface TestTileGridProps {
  testTiles: TestTileWithRelations[]
}

export function TestTileGrid({ testTiles }: TestTileGridProps) {
  if (testTiles.length === 0) {
    return (
      <EmptyState
        title="No test tiles"
        description="Get started by creating a new test tile."
        action={
          <Link
            href="/test-tiles/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-clay-600 hover:bg-clay-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clay-500"
          >
            Add New Test Tile
          </Link>
        }
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {testTiles.map((tile) => (
        <Link
          key={tile.id}
          href={`/test-tiles/${tile.id}`}
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-32 w-32 bg-gray-200 rounded flex items-center justify-center">
                {tile.imageUrl ? (
                  <img
                    src={tile.imageUrl}
                    alt={tile.name}
                    className="h-32 w-32 object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">Test Tile</span>
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {tile.name}
              </h3>
              
              <dl className="mt-2 text-sm text-gray-500 space-y-1">
                <div>
                  <dt className="inline font-medium">Clay Body: </dt>
                  <dd className="inline">{tile.clayBody.name}</dd>
                </div>
                
                {tile.decorations.length > 0 && (
                  <div>
                    <dt className="inline font-medium">Decorations: </dt>
                    <dd className="inline">
                      {tile.decorations.map(d => d.name).join(', ')}
                    </dd>
                  </div>
                )}
                
                {tile.collections.length > 0 && (
                  <div>
                    <dt className="inline font-medium">Collections: </dt>
                    <dd className="inline">
                      {tile.collections.map(c => c.name).join(', ')}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
