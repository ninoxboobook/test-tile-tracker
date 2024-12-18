import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { DetailLayout } from '@/components/ui/layout/detail-layout'
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

  const detailItems = [
    { label: 'Type', value: decorationWithRelations.type.name },
    { label: 'Manufacturer', value: decorationWithRelations.manufacturer },
    { label: 'Cones', value: decorationWithRelations.cone.length > 0 ? decorationWithRelations.cone.map(c => c.name).join(', ') : undefined },
    { label: 'Atmospheres', value: decorationWithRelations.atmosphere.length > 0 ? decorationWithRelations.atmosphere.map(a => a.name).join(', ') : undefined },
    { label: 'Colour', value: decorationWithRelations.colour },
    { label: 'Surface', value: decorationWithRelations.surface },
    { label: 'Transparency', value: decorationWithRelations.transparency },
    { label: 'Glazy URL', value: decorationWithRelations.glazyUrl || undefined },
    { label: 'Recipe', value: decorationWithRelations.recipe },
    { label: 'Notes', value: decorationWithRelations.notes },
  ]

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
      variant="detail"
    >
      <DetailLayout
        title="Decoration Details"
        items={detailItems}
        images={decorationWithRelations.imageUrl || undefined}
      />

      {decorationWithRelations.decorationLayers.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-medium text-clay-900 mb-4">Test Tiles</h4>
          {/* Add your test tiles list component here */}
        </div>
      )}
    </PageLayout>
  )
}
