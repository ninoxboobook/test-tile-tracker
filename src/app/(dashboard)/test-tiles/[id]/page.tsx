import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { deleteTestTile } from './actions'

interface PageProps {
  params: Promise<{ id: string }>
}

function TestTileImages({ imageUrl }: { imageUrl: string[] | null }) {
  if (!imageUrl?.length) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {imageUrl.map((url: string, index: number) => (
        <div key={url} className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={url}
            alt={`Test tile image ${index + 1}`}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}

export default async function TestTilePage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  const { id } = await params

  if (!session?.user?.id) {
    redirect('/login')
  }

  const testTile = await prisma.testTile.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      clayBody: true,
      decorationLayers: {
        include: {
          decorations: true
        },
        orderBy: {
          order: 'asc'
        }
      },
      collections: true,
      cone: true,
      atmosphere: true
    },
  })

  if (!testTile) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5 flex justify-between items-center">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900">{testTile.name}</h3>
        <div className="flex space-x-3">
          <Link
            href={`/test-tiles/${testTile.id}/edit`}
            className="inline-flex items-center rounded-md bg-clay-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-clay-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-600"
          >
            Edit Test Tile
          </Link>
          <DeleteButton
            onDelete={async () => {
              'use server'
              await deleteTestTile(testTile.id)
            }}
            itemName="Test Tile"
          />
        </div>
      </div>

      <TestTileImages imageUrl={testTile.imageUrl} />

      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Clay Body</dt>
          <dd className="mt-1 text-sm text-gray-900">
            <Link href={`/clay-bodies/${testTile.clayBody.id}`} className="text-indigo-600 hover:text-indigo-500">
              {testTile.clayBody.name}
            </Link>
          </dd>
        </div>

        {testTile.stamp && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Stamp</dt>
            <dd className="mt-1 text-sm text-gray-900">{testTile.stamp}</dd>
          </div>
        )}

        {testTile.decorationLayers.length > 0 && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Decorations</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <ul className="space-y-1">
                {testTile.decorationLayers.map(layer => (
                  <li key={layer.id}>
                    <Link href={`/decorations/${layer.id}`} className="text-indigo-600 hover:text-indigo-500">
                      {layer.decorations.map(d => d.name).join(', ')}
                    </Link>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}

        {testTile.collections.length > 0 && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Collections</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <ul className="space-y-1">
                {testTile.collections.map(collection => (
                  <li key={collection.id}>
                    <Link href={`/collections/${collection.id}`} className="text-indigo-600 hover:text-indigo-500">
                      {collection.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}

        {testTile.notes && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Notes</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{testTile.notes}</dd>
          </div>
        )}
      </dl>
    </div>
  )
}
