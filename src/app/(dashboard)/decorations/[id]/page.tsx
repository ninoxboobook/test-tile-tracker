import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { deleteDecoration } from './actions'
import { type DecorationWithRelations } from '@/lib/schemas/decoration'

function DecorationImages({ imageUrl }: { imageUrl: string[] | null }) {
  if (!imageUrl?.length) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {imageUrl.map((url: string, index: number) => (
        <div key={url} className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={url}
            alt={`Decoration image ${index + 1}`}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}

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
    <PageLayout
      title={decorationWithRelations.name}
      action={
        <div className="flex space-x-3">
          <Link href={`/decorations/${decorationWithRelations.id}/edit`}>
            <ActionButton>Edit Decoration</ActionButton>
          </Link>
          <DeleteButton
            onDelete={async () => {
              'use server'
              await deleteDecoration(decorationWithRelations.id)
            }}
            itemName="Decoration"
          />
        </div>
      }
    >
      {decorationWithRelations.imageUrl && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-clay-900 mb-4">
              Images
            </h3>
            <DecorationImages imageUrl={decorationWithRelations.imageUrl} />
          </div>
        </div>
      )}

      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-clay-500">Type</dt>
          <dd className="mt-1 text-sm text-clay-900">{decorationWithRelations.type.name}</dd>
        </div>

        {decorationWithRelations.manufacturer && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-clay-500">Manufacturer</dt>
            <dd className="mt-1 text-sm text-clay-900">{decorationWithRelations.manufacturer}</dd>
          </div>
        )}

        {decorationWithRelations.cone.length > 0 && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-clay-500">Cones</dt>
            <dd className="mt-1 text-sm text-clay-900">
              {decorationWithRelations.cone.map(c => c.name).join(', ')}
            </dd>
          </div>
        )}

        {decorationWithRelations.atmosphere.length > 0 && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-clay-500">Atmospheres</dt>
            <dd className="mt-1 text-sm text-clay-900">
              {decorationWithRelations.atmosphere.map(a => a.name).join(', ')}
            </dd>
          </div>
        )}

        {decorationWithRelations.colour && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-clay-500">Colour</dt>
            <dd className="mt-1 text-sm text-clay-900">{decorationWithRelations.colour}</dd>
          </div>
        )}

        {decorationWithRelations.surface && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-clay-500">Surface</dt>
            <dd className="mt-1 text-sm text-clay-900">{decorationWithRelations.surface}</dd>
          </div>
        )}

        {decorationWithRelations.transparency && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-clay-500">Transparency</dt>
            <dd className="mt-1 text-sm text-clay-900">{decorationWithRelations.transparency}</dd>
          </div>
        )}

        {decorationWithRelations.glazyUrl && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-clay-500">Glazy URL</dt>
            <dd className="mt-1 text-sm text-clay-900">
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
            <dt className="text-sm font-medium text-clay-500">Recipe</dt>
            <dd className="mt-1 text-sm text-clay-900 whitespace-pre-wrap">{decorationWithRelations.recipe}</dd>
          </div>
        )}

        {decorationWithRelations.notes && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-clay-500">Notes</dt>
            <dd className="mt-1 text-sm text-clay-900 whitespace-pre-wrap">{decorationWithRelations.notes}</dd>
          </div>
        )}
      </dl>

      {decorationWithRelations.decorationLayers.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-medium text-clay-900 mb-4">Test Tiles</h4>
          {/* Add your test tiles list component here */}
        </div>
      )}
    </PageLayout>
  )
}
