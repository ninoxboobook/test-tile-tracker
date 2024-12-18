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
      testTiles: true,
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
    { label: 'Firing Temperature (°C)', value: clayBody.firingTemperature?.toString() },
    { label: 'Colour (Oxidation)', value: clayBody.colourOxidation },
    { label: 'Colour (Reduction)', value: clayBody.colourReduction },
    { label: 'Texture', value: clayBody.texture },
    { label: 'Plasticity', value: clayBody.plasticity },
    { label: 'Shrinkage (%)', value: clayBody.shrinkage?.toString() },
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
      {clayBody.testTiles.length > 0 && (
        <div className="border-t border-clay-200 pt-6">
          <h3 className="text-lg font-medium text-clay-900">Test Tiles</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clayBody.testTiles.map((testTile) => (
              <Link
                key={testTile.id}
                href={`/test-tiles/${testTile.id}`}
                className="group relative block w-full aspect-square rounded-lg bg-clay-100 focus-within:ring-2 focus-within:ring-clay-500 focus-within:ring-offset-2 focus-within:ring-offset-clay-100 overflow-hidden"
              >
                {testTile.imageUrl?.[0] && (
                  <img
                    src={testTile.imageUrl[0]}
                    alt={testTile.name || ''}
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
