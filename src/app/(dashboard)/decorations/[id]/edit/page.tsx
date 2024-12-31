import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { DecorationForm } from '@/components/decorations/decoration-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { updateDecoration } from './actions'
import { type DecorationWithRelations } from '@/lib/schemas/decoration'

export default async function EditDecorationPage(
  props: {
    params: Promise<{ id: string }>
  }
) {
  const params = await props.params;
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const [decoration, decorationTypes, cones, atmospheres] = await Promise.all([
    prisma.decoration.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        type: true,
        atmosphere: true,
        cone: true,
        decorationLayers: {
          include: {
            testTile: true
          }
        }
      }
    }),
    prisma.decorationType.findMany({
      orderBy: { name: 'asc' }
    }),
    prisma.cone.findMany({
      orderBy: { name: 'asc' }
    }),
    prisma.atmosphere.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  if (!decoration) {
    return notFound()
  }

  const decorationWithRelations: DecorationWithRelations = {
    ...decoration,
    createdAt: decoration.createdAt,
    updatedAt: decoration.updatedAt,
    decorationLayers: decoration.decorationLayers.map(layer => ({
      id: layer.id,
      testTile: layer.testTile ? {
        id: layer.testTile.id,
        name: layer.testTile.name
      } : null
    }))
  }

  return (
    <FormLayout 
      title={`Edit ${decoration.name}`}
      backHref={`/decorations/${params.id}`}
    >
      <DecorationForm 
        action={updateDecoration}
        initialData={decorationWithRelations}
        submitButtonText="Update decoration"
        decorationTypes={decorationTypes}
        cones={cones}
        atmospheres={atmospheres}
      />
    </FormLayout>
  )
}