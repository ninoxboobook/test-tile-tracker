import Link from 'next/link'
import Image from 'next/image'
import { TestTiles, TestSeries, ClayBodies, Decorations } from '@prisma/client'

type TestTileWithRelations = TestTiles & {
  TestSeries: TestSeries | null
  ClayBodies: ClayBodies | null
  Decorations: Decorations | null
}

interface TestTileGridProps {
  testTiles: TestTileWithRelations[]
}

export function TestTileGrid({ testTiles }: TestTileGridProps) {
  if (!testTiles.length) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">No test tiles</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new test tile.</p>
        <div className="mt-6">
          <Link
            href="/test-tiles/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-clay-600 hover:bg-clay-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clay-500"
          >
            Add New Test Tile
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {testTiles.map((tile) => (
        <div key={tile.id} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {tile.imageUrl ? (
                  <Image
                    className="h-32 w-32 object-cover rounded"
                    src={tile.imageUrl}
                    alt={`Test tile ${tile.name}`}
                    width={128}
                    height={128}
                  />
                ) : (
                  <div className="h-32 w-32 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="ml-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {tile.name}
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Series: {tile.TestSeries?.name ?? 'None'}</p>
                  <p>Clay: {tile.ClayBodies?.name ?? 'None'}</p>
                  <p>Decoration: {tile.Decorations?.name ?? 'None'}</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href={`/test-tiles/${tile.id}`}
                className="text-sm font-medium text-clay-600 hover:text-clay-500"
              >
                View Details <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
