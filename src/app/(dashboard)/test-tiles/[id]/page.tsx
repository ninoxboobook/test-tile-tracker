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

interface PageProps {
  params: Promise<{ id: string }>
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
      collections: {
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
      atmosphere: true
    },
  })

  if (!testTile) {
    return notFound()
  }

  const detailItems = [
    { 
      label: 'Clay Body', 
      value: [{ 
        href: `/clay-bodies/${testTile.clayBody.id}`,
        text: testTile.clayBody.name
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
            text: d.name
          }))
        ]
      )
    },
    { label: 'Notes', value: testTile.notes },
  ]

  return (
    <PageLayout
      title={testTile.name}
      action={
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
      }
      variant="detail"
    >
      <DetailLayout
        title="Test Tile Details"
        items={detailItems}
        images={testTile.imageUrl || undefined}
      />
      <div className="mt-6 bg-sand-light rounded-2xl p-8">
        <h2 className="text-2xl font-display font-semibold text-clay-800 mb-6">Collections this tile appears in</h2>
        <div className="mt-4">
          <TestTileCollections collections={testTile.collections} testTileId={testTile.id} />
        </div>
      </div>
    </PageLayout>
  )
}
