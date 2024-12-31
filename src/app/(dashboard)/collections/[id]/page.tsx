import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { deleteCollection } from './actions'
import { CollectionTestTiles } from '@/components/collections/collection-test-tiles'
import { getSessionWithAuth } from '@/lib/auth/admin'

export default async function CollectionPage(
  props: {
    params: Promise<{ id: string }>
  }
) {
  const params = await props.params;
  const { session, isAdmin } = await getSessionWithAuth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const collection = await prisma.collection.findUnique({
    where: {
      id: params.id,
      ...(isAdmin ? {} : { userId: session.user.id })
    },
    include: {
      testTiles: {
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
        }
      },
      user: isAdmin ? {
        select: {
          username: true,
          email: true
        }
      } : false
    }
  })

  if (!collection) {
    return notFound()
  }

  return (
    <PageLayout
      title={collection.name}
      description={collection.description ?? undefined}
      action={
        <div className="flex space-x-3">
          <Link href={`/collections/${collection.id}/edit`}>
            <ActionButton>Edit collection</ActionButton>
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
      <h2 className="text-2xl font-display font-semibold text-clay-800 mb-6">Test tiles in this collection</h2>
      <CollectionTestTiles testTiles={collection.testTiles} collectionId={collection.id} />
    </PageLayout>
  )
}
