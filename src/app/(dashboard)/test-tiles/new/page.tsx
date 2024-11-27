import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { TestTileForm } from '@/components/test-tiles/test-tile-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { createTestTile } from './actions'

export default async function NewTestTilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Get all available clay bodies, decorations, and collections for the form
  const [clayBodies, decorations, collections] = await Promise.all([
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
  ])

  return (
    <FormLayout 
      title="New Test Tile"
      description="Document a new test tile"
      backHref="/test-tiles"
    >
      <TestTileForm 
        action={createTestTile}
        clayBodies={clayBodies}
        decorations={decorations}
        collections={collections}
      />
    </FormLayout>
  )
}