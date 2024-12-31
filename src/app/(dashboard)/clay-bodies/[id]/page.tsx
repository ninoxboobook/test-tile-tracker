import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { deleteClayBody } from './actions'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { DetailLayout } from '@/components/ui/layout/detail-layout'
import { ClayBodyTestTiles } from '@/components/clay-bodies/clay-body-test-tiles'

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

export default async function ClayBodyPage(
  props: {
    params: Promise<{ id: string }>
  }
) {
  const params = await props.params;
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return notFound()
  }

  const clayBody = await prisma.clayBody.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
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
      cone: true
    },
  })

  if (!clayBody) {
    return notFound()
  }

  const detailItems = [
    { label: 'Type', value: clayBody.type?.name },
    { label: 'Manufacturer', value: clayBody.manufacturer },
    { label: 'Cone', value: clayBody.cone.length > 0 ? clayBody.cone.map(c => c.name).join(', ') : undefined },
    { label: 'Firing Range (°C)', value: clayBody.firingRange },
    { label: 'Bisque Temperature (°C)', value: clayBody.bisqueTemperature },
    { label: 'Vitreous Temperature (°C)', value: clayBody.vitreousTemperature },
    { label: 'Colour (Oxidation)', value: clayBody.colourOxidation },
    { label: 'Colour (Reduction)', value: clayBody.colourReduction },
    { label: 'Texture', value: clayBody.texture },
    { label: 'Plasticity', value: clayBody.plasticity },
    { label: 'Shrinkage (Wet to Dry) (%)', value: clayBody.shrinkageWetToDry?.toString() },
    { label: 'Shrinkage (Wet to Bisque) (%)', value: clayBody.shrinkageWetToBisque?.toString() },
    { label: 'Shrinkage (Wet to Fired) (%)', value: clayBody.shrinkageWetToFired?.toString() },
    { label: 'Absorption (%)', value: clayBody.absorption?.toString() },
    { label: 'Mesh Size', value: clayBody.meshSize?.toString() },
    { label: 'Notes', value: clayBody.notes },
  ]

  return (
    <PageLayout
      title={clayBody.name}
      action={
        <div className="flex space-x-3">
          <Link href={`/clay-bodies/${clayBody.id}/edit`}>
            <ActionButton>Edit Clay Body</ActionButton>
          </Link>
          <DeleteButton
            onDelete={async () => {
              'use server'
              await deleteClayBody(clayBody.id)
            }}
            itemName="Clay Body"
          />
        </div>
      }
      variant="detail"
    >
      <DetailLayout
        title="Clay Body Details"
        items={detailItems}
        images={clayBody.imageUrl}
      />
      <div className="mt-6 bg-sand-light rounded-2xl p-8">
        <h2 className="text-2xl font-display font-semibold text-clay-800 mb-6">Test tiles featuring this clay body</h2>
        <div className="mt-4">
          <ClayBodyTestTiles testTiles={clayBody.testTiles} clayBodyId={clayBody.id} />
        </div>
      </div>
    </PageLayout>
  )
}
