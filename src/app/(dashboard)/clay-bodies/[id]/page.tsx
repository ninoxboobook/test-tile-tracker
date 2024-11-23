import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ClayBodyPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return notFound()
  }

  const clayBody = await prisma.clayBodies.findFirst({
    where: {
      id: params.id,
      user_id: session.user.id,
    },
  })

  if (!clayBody) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5 flex justify-between items-center">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900">{clayBody.name}</h3>
        <Link
          href={`/clay-bodies/${clayBody.id}/edit`}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Edit Clay Body
        </Link>
      </div>

      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Type</dt>
          <dd className="mt-1 text-sm text-gray-900">{clayBody.type}</dd>
        </div>

        {clayBody.manufacturer && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
            <dd className="mt-1 text-sm text-gray-900">{clayBody.manufacturer}</dd>
          </div>
        )}

        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Cone</dt>
          <dd className="mt-1 text-sm text-gray-900">{clayBody.cone}</dd>
        </div>

        {clayBody.firing_temperature && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Firing Temperature (°C)</dt>
            <dd className="mt-1 text-sm text-gray-900">{clayBody.firing_temperature}</dd>
          </div>
        )}

        {clayBody.colour_oxidation && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Colour (Oxidation)</dt>
            <dd className="mt-1 text-sm text-gray-900">{clayBody.colour_oxidation}</dd>
          </div>
        )}

        {clayBody.colour_reduction && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Colour (Reduction)</dt>
            <dd className="mt-1 text-sm text-gray-900">{clayBody.colour_reduction}</dd>
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

        {clayBody.plasticity && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Plasticity</dt>
            <dd className="mt-1 text-sm text-gray-900">{clayBody.plasticity}</dd>
          </div>
        )}

        {clayBody.texture && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Texture</dt>
            <dd className="mt-1 text-sm text-gray-900">{clayBody.texture}</dd>
          </div>
        )}

        {clayBody.description && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">{clayBody.description}</dd>
          </div>
        )}

        {clayBody.composition && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Composition</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <pre className="whitespace-pre-wrap">{JSON.stringify(clayBody.composition, null, 2)}</pre>
            </dd>
          </div>
        )}
      </dl>
    </div>
  )
}
