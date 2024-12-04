import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { deleteClayBody } from './actions'

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
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5 flex justify-between items-center">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900">{clayBody.name}</h3>
        <div className="flex space-x-3">
          <Link
            href={`/clay-bodies/${clayBody.id}/edit`}
            className="inline-flex items-center rounded-md bg-clay-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-clay-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-600"
          >
            Edit Clay Body
          </Link>
          <DeleteButton
            onDelete={async () => {
              'use server'
              await deleteClayBody(clayBody.id)
            }}
            itemName="Clay Body"
          />
        </div>
      </div>

      {clayBody.imageUrl && (
        <div className="relative h-64 w-full overflow-hidden rounded-lg">
          <Image
            src={clayBody.imageUrl}
            alt={clayBody.name}
            fill
            className="object-cover"
          />
        </div>
      )}

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
                {testTile.imageUrl && (
                  <Image
                    src={testTile.imageUrl}
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
    </div>
  )
}
