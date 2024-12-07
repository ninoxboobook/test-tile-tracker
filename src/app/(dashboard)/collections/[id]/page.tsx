import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { deleteCollection } from './actions'

export default async function CollectionPage(
  props: {
    params: Promise<{ id: string }>
  }
) {
  const params = await props.params;
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const collection = await prisma.collection.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      testTiles: true,
    },
  })

  if (!collection) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5 flex justify-between items-center">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900">
          {collection.name}
        </h3>
        <div className="flex space-x-3">
          <Link
            href={`/collections/${collection.id}/edit`}
            className="inline-flex items-center rounded-md bg-clay-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-clay-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-600"
          >
            Edit Collection
          </Link>
          <DeleteButton
            onDelete={async () => {
              'use server'
              await deleteCollection(collection.id)
            }}
            itemName="Collection"
          />
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        {collection.description && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{collection.description}</dd>
          </div>
        )}
      </dl>

      {collection.testTiles.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900">Test Tiles</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collection.testTiles.map((testTile) => (
              <Link
                key={testTile.id}
                href={`/test-tiles/${testTile.id}`}
                className="group relative block w-full aspect-square rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-clay-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 overflow-hidden"
              >
                {testTile.imageUrl && (
                  <Image
                    src={testTile.imageUrl}
                    alt={testTile.name || ''}
                    fill
                    className="pointer-events-none object-cover group-hover:opacity-75"
                  />
                )}
                <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/50 to-transparent">
                  <p className="text-sm font-medium text-white">{testTile.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
