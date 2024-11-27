import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function CollectionPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return notFound()
  }

  const collection = await prisma.collection.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      testTiles: true,
    },
  })

  if (!collection) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5 flex justify-between items-center">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900">{collection.name}</h3>
        <Link
          href={`/collections/${collection.id}/edit`}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Edit Collection
        </Link>
      </div>

      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        {collection.description && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{collection.description}</dd>
          </div>
        )}
      </dl>

      {collection.testTiles.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Test Tiles</h4>
          {/* Add your test tiles list component here */}
        </div>
      )}
    </div>
  )
}
