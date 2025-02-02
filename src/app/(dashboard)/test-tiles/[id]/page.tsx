import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { DetailLayout } from '@/components/ui/layout/detail-layout'
import { deleteTestTile } from './actions'
import { TestTileCollections } from '@/components/test-tiles/test-tile-collections'
import { isAdmin } from '@/lib/auth/admin'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TestTilePage({ params }: PageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const userIsAdmin = session?.user?.id ? await isAdmin() : false

  const testTile = await prisma.testTile.findFirst({
    where: {
      id,
      OR: userIsAdmin ? undefined : [
        { userId: session?.user?.id },
        { isPublic: true }
      ]
    },
    include: {
      clayBody: {
        select: {
          id: true,
          name: true,
          isPublic: true,
          userId: true
        }
      },
      decorationLayers: {
        include: {
          decorations: {
            select: {
              id: true,
              name: true,
              isPublic: true,
              userId: true
            }
          }
        },
        orderBy: {
          order: 'asc'
        }
      },
      collections: {
        where: {
          OR: [
            { userId: session?.user?.id }, // Show all collections if user is owner
            { isPublic: true } // Show only public collections for other users
          ]
        },
        include: {
          testTiles: {
            select: {
              id: true,
              imageUrl: true
            }
          }
        }
      },
      cone: true,
      atmosphere: true,
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

  if (!testTile) {
    return notFound()
  }

  // Handle private test tiles - redirect unauthenticated users to login, others to dashboard
  if (!testTile.isPublic && !userIsAdmin && testTile.user.id !== session?.user?.id) {
    if (!session?.user?.id) {
      redirect('/login')
    }
    redirect('/dashboard')
  }

  const isOwner = testTile.user.id === session?.user?.id || userIsAdmin

  const detailItems = [
    { 
      label: 'Clay Body', 
      value: [{ 
        href: `/clay-bodies/${testTile.clayBody.id}`,
        text: testTile.clayBody.name,
        isPublic: testTile.clayBody.isPublic || testTile.clayBody.userId === session?.user?.id
      }]
    },
    { label: 'Stamp', value: testTile.stamp },
    { label: 'Cone', value: testTile.cone?.name },
    { label: 'Atmosphere', value: testTile.atmosphere?.name },
    { 
      label: 'Decorations', 
      value: testTile.decorationLayers.flatMap((layer, index) =>
        [
          { href: '#', text: `Layer ${index + 1}:` },
          ...layer.decorations.map(d => ({
            href: `/decorations/${d.id}`,
            text: d.name,
            isPublic: d.isPublic || d.userId === session?.user?.id
          }))
        ]
      )
    },
    { label: 'Notes', value: testTile.notes },
  ]

  return (
    <PageLayout
      title={testTile.name}
      variant="detail"
      isPublic={testTile.isPublic}
      action={isOwner ? (
        <div className="flex space-x-3">
          <Link href={`/test-tiles/${testTile.id}/edit`}>
            <ActionButton>Edit test tile</ActionButton>
          </Link>
          <DeleteButton
            onDelete={async () => {
              'use server'
              await deleteTestTile(testTile.id)
            }}
            itemName="Test Tile"
          />
        </div>
      ) : null}
    >
      <DetailLayout
        title="Test tile details"
        items={detailItems}
        images={testTile.imageUrl}
        isOwner={testTile.user.id === session?.user?.id}
      />
      <div className="mt-6 bg-sand-light rounded-2xl p-8">
        <h2 className="text-2xl font-display font-semibold text-clay-800 mb-6">Collections this tile appears in</h2>
        <div className="mt-4">
          <TestTileCollections 
            collections={testTile.collections} 
            testTileId={testTile.id}
            isOwner={testTile.userId === session?.user?.id}
          />
        </div>
      </div>
    </PageLayout>
  )
}
