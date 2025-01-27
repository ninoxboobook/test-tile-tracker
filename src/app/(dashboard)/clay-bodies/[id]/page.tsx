import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { deleteClayBody } from './actions'
import { isAdmin } from '@/lib/auth/admin'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { DetailLayout } from '@/components/ui/layout/detail-layout'
import { ClayBodyTestTiles } from '@/components/clay-bodies/clay-body-test-tiles'

interface PageProps {
  params: Promise<{ id: string }>
}

function ClayBodyImages({ imageUrl }: { imageUrl: string[] | null }) {
  if (!imageUrl?.length) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {imageUrl.map((url: string, index: number) => (
        <div key={url} className="relative aspect-square overflow-hidden rounded-lg">
          <img
            src={url}
            alt={`Clay body image ${index + 1}`}
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}

export default async function ClayBodyPage({ params }: PageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const userIsAdmin = session?.user?.id ? await isAdmin() : false

  const clayBody = await prisma.clayBody.findFirst({
    where: {
      id,
      OR: userIsAdmin ? undefined : [
        { userId: session?.user?.id },
        { isPublic: true }
      ]
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
      type: true,
      cone: true,
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

  if (!clayBody) {
    return notFound()
  }

  const isOwner = clayBody.user.id === session?.user?.id || userIsAdmin

  const detailItems = [
    { label: 'Type', value: clayBody.type?.name },
    { label: 'Manufacturer', value: clayBody.manufacturer },
    { label: 'Cone', value: clayBody.cone.length > 0 ? clayBody.cone.map(c => c.name).join(', ') : undefined },
    { label: 'Firing range (°C/°F)', value: clayBody.firingRange },
    { label: 'Bisque temperature (°C/°F)', value: clayBody.bisqueTemperature },
    { label: 'Vitreous temperature (°C/°F)', value: clayBody.vitreousTemperature },
    { label: 'Colour (oxidation)', value: clayBody.colourOxidation },
    { label: 'Colour (reduction)', value: clayBody.colourReduction },
    { label: 'Texture', value: clayBody.texture },
    { label: 'Plasticity', value: clayBody.plasticity },
    { label: 'Shrinkage % (wet to dry)', value: clayBody.shrinkageWetToDry?.toString() },
    { label: 'Shrinkage % (wet to bisque)', value: clayBody.shrinkageWetToBisque?.toString() },
    { label: 'Shrinkage % (wet to fired)', value: clayBody.shrinkageWetToFired?.toString() },
    { label: 'Absorption (%)', value: clayBody.absorption?.toString() },
    { label: 'Mesh size', value: clayBody.meshSize?.toString() },
    { label: 'Notes', value: clayBody.notes },
  ]

  return (
    <PageLayout
      title={clayBody.name}
      action={isOwner ? (
        <div className="flex space-x-3">
          <Link href={`/clay-bodies/${clayBody.id}/edit`}>
            <ActionButton>Edit clay body</ActionButton>
          </Link>
          <DeleteButton
            onDelete={async () => {
              'use server'
              await deleteClayBody(clayBody.id)
            }}
            itemName="Clay Body"
          />
        </div>
      ) : null}
      variant="detail"
    >
      <DetailLayout
        title={clayBody.name}
        items={detailItems}
        images={clayBody.imageUrl}
        isOwner={clayBody.userId === session?.user?.id}
      />
      <div className="mt-6 bg-sand-light rounded-2xl p-8">
        <h2 className="text-2xl font-display font-semibold text-clay-800 mb-6">Test tiles featuring this clay body</h2>
        <div className="mt-4">
          <ClayBodyTestTiles 
            testTiles={clayBody.testTiles} 
            clayBodyId={clayBody.id}
            isOwner={clayBody.userId === session?.user?.id}
          />
        </div>
      </div>
    </PageLayout>
  )
}
