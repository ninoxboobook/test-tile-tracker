import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { TestTileForm } from '@/components/test-tiles/test-tile-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { createTestTile } from './actions'
import { ClayBody, Collection, Decoration } from '@prisma/client'
export default async function NewTestTilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Get all available data for the forms
  const [
    clayBodies, 
    decorations, 
    collections, 
    cones, 
    atmospheres,
    clayBodyTypes,
    decorationTypes
  ] = await Promise.all([
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

  return (
    <FormLayout 
      title="Add new test tile"
      backHref="/test-tiles"
    >
      <TestTileForm 
        action={createTestTile}
        clayBodies={clayBodies as ClayBody[]}
        decorations={decorations as Decoration[]}
        collections={collections as Collection[]}
        cones={cones}
        atmospheres={atmospheres}
        clayBodyTypes={clayBodyTypes}
        decorationTypes={decorationTypes}
      />
    </FormLayout>
  )
}