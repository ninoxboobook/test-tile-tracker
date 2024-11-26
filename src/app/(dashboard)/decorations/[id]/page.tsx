import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function DecorationPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return notFound()
  }

  const decoration = await prisma.decoration.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      testTiles: true,
    },
  })

  if (!decoration) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5 flex justify-between items-center">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900">{decoration.name}</h3>
        <Link
          href={`/decorations/${decoration.id}/edit`}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Edit Decoration
        </Link>
      </div>

      {decoration.imageUrl && (
        <div className="relative h-64 w-full overflow-hidden rounded-lg">
          <Image
            src={decoration.imageUrl}
            alt={decoration.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Category</dt>
          <dd className="mt-1 text-sm text-gray-900">{decoration.category}</dd>
        </div>

        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Type</dt>
          <dd className="mt-1 text-sm text-gray-900">{decoration.type}</dd>
        </div>

        {decoration.manufacturer && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
            <dd className="mt-1 text-sm text-gray-900">{decoration.manufacturer}</dd>
          </div>
        )}

        {decoration.cone && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Cone</dt>
            <dd className="mt-1 text-sm text-gray-900">{decoration.cone}</dd>
          </div>
        )}

        {decoration.atmosphere && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Atmosphere</dt>
            <dd className="mt-1 text-sm text-gray-900">{decoration.atmosphere}</dd>
          </div>
        )}

        {decoration.colour && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Colour</dt>
            <dd className="mt-1 text-sm text-gray-900">{decoration.colour}</dd>
          </div>
        )}

        {decoration.surface && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Surface</dt>
            <dd className="mt-1 text-sm text-gray-900">{decoration.surface}</dd>
          </div>
        )}

        {decoration.transparency && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Transparency</dt>
            <dd className="mt-1 text-sm text-gray-900">{decoration.transparency}</dd>
          </div>
        )}

        {decoration.glazyUrl && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Glazy URL</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <a 
                href={decoration.glazyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500"
              >
                View on Glazy
              </a>
            </dd>
          </div>
        )}

        {decoration.recipe && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Recipe</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{decoration.recipe}</dd>
          </div>
        )}

        {decoration.notes && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Notes</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{decoration.notes}</dd>
          </div>
        )}
      </dl>

      {decoration.testTiles.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Test Tiles</h4>
          {/* Add your test tiles list component here */}
        </div>
      )}
    </div>
  )
}
