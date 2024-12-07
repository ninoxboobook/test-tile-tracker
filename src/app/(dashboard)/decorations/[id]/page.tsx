import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { deleteDecoration } from './actions'
import { type DecorationWithRelations } from '@/lib/schemas/decoration'

export default async function DecorationPage(
  props: {
    params: Promise<{ id: string }>
  }
) {
  const params = await props.params;
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const decoration = await prisma.decoration.findUnique({
    where: {
      id: params.id,
      userId: session.user.id
    },
    include: {
      type: true,
      cone: true,
      atmosphere: true,
      decorationLayers: {
        include: {
          testTile: true
        }
      }
    }
  })

  if (!decoration) {
    return notFound()
  }

  const decorationWithRelations: DecorationWithRelations = {
    ...decoration,
    createdAt: decoration.createdAt,
    updatedAt: decoration.updatedAt
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5 flex justify-between items-center">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900">{decorationWithRelations.name}</h3>
        <div className="flex space-x-3">
          <Link
            href={`/decorations/${decorationWithRelations.id}/edit`}
            className="inline-flex items-center rounded-md bg-clay-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-clay-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-600"
          >
            Edit Decoration
          </Link>
          <DeleteButton
            onDelete={async () => {
              'use server'
              await deleteDecoration(decorationWithRelations.id)
            }}
            itemName="Decoration"
          />
        </div>
      </div>

      {decorationWithRelations.imageUrl && (
        <div className="relative h-64 w-full overflow-hidden rounded-lg">
          <Image
            src={decorationWithRelations.imageUrl}
            alt={decorationWithRelations.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Type</dt>
          <dd className="mt-1 text-sm text-gray-900">{decorationWithRelations.type.name}</dd>
        </div>

        {decorationWithRelations.manufacturer && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
            <dd className="mt-1 text-sm text-gray-900">{decorationWithRelations.manufacturer}</dd>
          </div>
        )}

        {decorationWithRelations.cone.length > 0 && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Cones</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {decorationWithRelations.cone.map(c => c.name).join(', ')}
            </dd>
          </div>
        )}

        {decorationWithRelations.atmosphere.length > 0 && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Atmospheres</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {decorationWithRelations.atmosphere.map(a => a.name).join(', ')}
            </dd>
          </div>
        )}

        {decorationWithRelations.colour && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Colour</dt>
            <dd className="mt-1 text-sm text-gray-900">{decorationWithRelations.colour}</dd>
          </div>
        )}

        {decorationWithRelations.surface && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Surface</dt>
            <dd className="mt-1 text-sm text-gray-900">{decorationWithRelations.surface}</dd>
          </div>
        )}

        {decorationWithRelations.transparency && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Transparency</dt>
            <dd className="mt-1 text-sm text-gray-900">{decorationWithRelations.transparency}</dd>
          </div>
        )}

        {decorationWithRelations.glazyUrl && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Glazy URL</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <a 
                href={decorationWithRelations.glazyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500"
              >
                View on Glazy
              </a>
            </dd>
          </div>
        )}

        {decorationWithRelations.recipe && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Recipe</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{decorationWithRelations.recipe}</dd>
          </div>
        )}

        {decorationWithRelations.notes && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Notes</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{decorationWithRelations.notes}</dd>
          </div>
        )}
      </dl>

      {decorationWithRelations.decorationLayers.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Test Tiles</h4>
          {/* Add your test tiles list component here */}
        </div>
      )}
    </div>
  )
}
