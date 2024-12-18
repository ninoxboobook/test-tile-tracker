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
      collections: true,
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
      value: `/clay-bodies/${testTile.clayBody.id}|${testTile.clayBody.name}` 
    },
    { label: 'Stamp', value: testTile.stamp },
    { label: 'Cone', value: testTile.cone?.name },
    { label: 'Atmosphere', value: testTile.atmosphere?.name },
    { 
      label: 'Decorations', 
      value: testTile.decorationLayers.length > 0 
        ? testTile.decorationLayers.flatMap(layer => 
            layer.decorations.map(decoration => 
              `/decorations/${decoration.id}|${decoration.name}`
            )
          ).join('\n')
        : undefined
    },
    { 
      label: 'Collections', 
      value: testTile.collections.length > 0
        ? testTile.collections
            .map(collection => `/collections/${collection.id}|${collection.name}`)
            .join('\n')
        : undefined
    },
    { label: 'Notes', value: testTile.notes },
  ]

  return (
    <PageLayout
      title={testTile.name}
      action={
        <div className="flex space-x-3">
          <Link href={`/test-tiles/${testTile.id}/edit`}>
            <ActionButton>Edit Test Tile</ActionButton>
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
    </PageLayout>
  )
}
