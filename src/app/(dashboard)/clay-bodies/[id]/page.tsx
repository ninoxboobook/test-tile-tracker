import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { deleteClayBody } from './actions'
import { PageLayout } from '@/components/ui/layout/page-layout'

function ClayBodyImages({ imageUrl }: { imageUrl: string[] | null }) {
  if (!imageUrl?.length) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {imageUrl.map((url: string, index: number) => (
        <div key={url} className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={url}
            alt={`Clay body image ${index + 1}`}
            fill
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
    >
      <ClayBodyImages imageUrl={clayBody.imageUrl} />

      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Type</dt>
          <dd className="mt-1 text-sm text-gray-900">{clayBody.type?.name}</dd>
        </div>

        {clayBody.manufacturer && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
            <dd className="mt-1 text-sm text-gray-900">{clayBody.manufacturer}</dd>
          </div>
        )}

        {clayBody.cone.length > 0 && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Cone</dt>
            <dd className="mt-1 text-sm text-gray-900">{clayBody.cone.map(c => c.name).join(', ')}</dd>
          </div>
        )}

        {clayBody.firingTemperature && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Firing Temperature (°C)</dt>
            <dd className="mt-1 text-sm text-gray-900">{clayBody.firingTemperature}</dd>
          </div>
        )}

        {clayBody.colourOxidation && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Colour (Oxidation)</dt>
            <dd className="mt-1 text-sm text-gray-900">{clayBody.colourOxidation}</dd>
          </div>
        )}

        {clayBody.colourReduction && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Colour (Reduction)</dt>
            <dd className="mt-1 text-sm text-gray-900">{clayBody.colourReduction}</dd>
          </div>
        )}

        {clayBody.texture && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Texture</dt>
            <dd className="mt-1 text-sm text-gray-900">{clayBody.texture}</dd>
          </div>
        )}

        {clayBody.plasticity && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Plasticity</dt>
            <dd className="mt-1 text-sm text-gray-900">{clayBody.plasticity}</dd>
          </div>
        )}

        {clayBody.shrinkage !== null && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Shrinkage (%)</dt>
            <dd className="mt-1 text-sm text-gray-900">{clayBody.shrinkage}</dd>
          </div>
        )}

        {clayBody.absorption !== null && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Absorption (%)</dt>
            <dd className="mt-1 text-sm text-gray-900">{clayBody.absorption}</dd>
          </div>
        )}

        {clayBody.meshSize !== null && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Mesh Size</dt>
            <dd className="mt-1 text-sm text-gray-900">{clayBody.meshSize}</dd>
          </div>
        )}

        {clayBody.notes && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Notes</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{clayBody.notes}</dd>
          </div>
        )}
      </dl>

      {clayBody.testTiles.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900">Test Tiles</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clayBody.testTiles.map((testTile) => (
              <Link
                key={testTile.id}
                href={`/test-tiles/${testTile.id}`}
                className="group relative block w-full aspect-square rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-clay-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 overflow-hidden"
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
