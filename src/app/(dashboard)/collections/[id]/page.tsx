import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { PageLayout } from '@/components/ui/layout/page-layout'
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
    <PageLayout
      title={collection.name}
      action={
        <div className="flex space-x-3">
          <Link href={`/collections/${collection.id}/edit`}>
            <ActionButton>Edit Collection</ActionButton>
          </Link>
          <DeleteButton
            onDelete={async () => {
              'use server'
              await deleteCollection(collection.id)
            }}
            itemName="Collection"
          />
        </div>
      }
    >
      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        {collection.description && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-clay-500">Description</dt>
            <dd className="mt-1 text-sm text-clay-900 whitespace-pre-wrap">{collection.description}</dd>
          </div>
        )}
      </dl>

      {collection.testTiles.length > 0 && (
        <div className="border-t border-clay-200 pt-6">
          <h3 className="text-lg font-medium text-clay-900">Test Tiles</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collection.testTiles.map((testTile) => (
              <Link
                key={testTile.id}
                href={`/test-tiles/${testTile.id}`}
                className="group relative block w-full aspect-square rounded-lg bg-clay-100 focus-within:ring-2 focus-within:ring-clay-500 focus-within:ring-offset-2 focus-within:ring-offset-clay-100 overflow-hidden"
              >
                {testTile.imageUrl?.[0] && (
                  <Image
                    src={testTile.imageUrl[0]}
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
    </PageLayout>
  )
}
