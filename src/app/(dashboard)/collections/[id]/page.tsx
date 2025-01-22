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
import { isAdmin } from '@/lib/auth/admin'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CollectionPage({ params }: PageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const userIsAdmin = session?.user?.id ? await isAdmin() : false

  const collection = await prisma.collection.findFirst({
    where: {
      id,
      OR: userIsAdmin ? undefined : [
        { userId: session?.user?.id },
        { isPublic: true }
      ]
    },
    include: {
      testTiles: {
        where: userIsAdmin ? undefined : {
          OR: [
            { userId: session?.user?.id },
            { isPublic: true }
          ]
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
        }
      },
      user: {
        select: {
          id: true,
          ...(userIsAdmin ? {
            username: true,
            email: true
          } : {})
        }
      }
    }
  })

  if (!collection) {
    return notFound()
  }

  const isOwner = collection.user.id === session?.user?.id || userIsAdmin

  return (
    <PageLayout
      title={collection.name}
      description={collection.description ?? undefined}
      action={isOwner ? (
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
      ) : null}
    >
      <h2 className="text-2xl font-display font-semibold text-clay-800 mb-6">Test tiles in this collection</h2>
      <CollectionTestTiles testTiles={collection.testTiles} collectionId={collection.id} />
    </PageLayout>
  )
}
