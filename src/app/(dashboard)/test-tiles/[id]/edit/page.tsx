import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { TestTileForm } from '@/components/test-tiles/test-tile-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { updateTestTile } from './actions'
import type { TestTileFormData } from '@/lib/schemas/test-tile'
import { ClayBody, Collection, Decoration } from '@prisma/client'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditTestTilePage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  const { id } = await params

  if (!session?.user?.id) {
    redirect('/login')
  }

  const testTile = await prisma.testTile.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
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
    },
  })

  if (!testTile) {
    return notFound()
  }

  const [clayBodies, decorations, collections, cones, atmospheres, clayBodyTypes, decorationTypes] = await Promise.all([
    prisma.clayBody.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true },
    }),
    prisma.decoration.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true },
    }),
    prisma.collection.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true },
    }),
    prisma.cone.findMany({
      select: { id: true, name: true, createdAt: true, updatedAt: true },
    }),
    prisma.atmosphere.findMany({
      select: { id: true, name: true, createdAt: true, updatedAt: true },
    }),
    prisma.clayBodyType.findMany({
      select: { id: true, name: true, createdAt: true, updatedAt: true },
    }),
    prisma.decorationType.findMany({
      select: { id: true, name: true, createdAt: true, updatedAt: true },
    }),
  ])

  const formData: TestTileFormData & { id: string } = {
    id: testTile.id,
    name: testTile.name,
    stamp: testTile.stamp || undefined,
    notes: testTile.notes || undefined,
    imageUrl: testTile.imageUrl || undefined,
    clayBodyId: testTile.clayBodyId,
    coneId: testTile.coneId,
    atmosphereId: testTile.atmosphereId,
    decorationLayers: testTile.decorationLayers.map(layer => ({
      order: layer.order,
      decorationIds: layer.decorations.map(d => d.id)
    })),
    collectionIds: testTile.collections.map(collection => collection.id),
  }

  return (
    <FormLayout 
      title={`Edit ${testTile.name}`}
      backHref={`/test-tiles/${id}`}
    >
      <TestTileForm 
        action={updateTestTile}
        initialData={formData}
        submitButtonText="Update Test Tile"
        cones={cones}
        atmospheres={atmospheres}
        clayBodies={clayBodies as ClayBody[]}
        decorations={decorations as Decoration[]}
        collections={collections as Collection[]}
        clayBodyTypes={clayBodyTypes}
        decorationTypes={decorationTypes}
      />
    </FormLayout>
  )
} 