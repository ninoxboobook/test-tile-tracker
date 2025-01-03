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
import { DecorationTestTiles } from '@/components/decorations/decoration-test-tiles'
import { TestTileWithRelations } from '@/types/test-tile'
import { getSessionWithAuth } from '@/lib/auth/admin'

export default async function DecorationPage(
  props: {
    params: Promise<{ id: string }>
  }
) {
  const params = await props.params;
  const { session, isAdmin } = await getSessionWithAuth()

  if (!session?.user?.id && !isAdmin) {
    redirect('/login')
  }

  const decoration = await prisma.decoration.findUnique({
    where: {
      id: params.id,
      ...(isAdmin ? {} : { userId: session.user.id })
    },
    include: {
      type: true,
      cone: true,
      atmosphere: true,
      decorationLayers: {
        include: {
          testTile: {
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
          }
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
    { 
      label: 'Colour', 
      value: decorationWithRelations.colour ? (() => {
        const { hex, category } = JSON.parse(decorationWithRelations.colour) as { hex: string; category: string }
        return {
          type: 'color' as const,
          hex,
          category
        }
      })() : undefined
    },
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
            <ActionButton>Edit decoration</ActionButton>
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
      <div className="mt-6 bg-sand-light rounded-2xl p-8">
        <h2 className="text-2xl font-display font-semibold text-clay-800 mb-6">Test tiles featuring this decoration</h2>
        <div className="mt-4">
          <DecorationTestTiles 
            testTiles={Array.from(
              new Map(
                decorationWithRelations.decorationLayers
                  .map(layer => layer.testTile)
                  .filter((testTile): testTile is TestTileWithRelations => 
                    testTile !== null && 
                    typeof testTile === 'object' &&
                    'id' in testTile
                  )
                  .map(testTile => [testTile.id, testTile])
              ).values()
            )}
            decorationId={decorationWithRelations.id} 
          />
        </div>
      </div>
    </PageLayout>
  )
}
