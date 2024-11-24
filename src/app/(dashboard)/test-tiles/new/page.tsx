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

  // Get all available clay bodies, decorations, and test series for the form
  const [clayBodies, decorations, testSeries] = await Promise.all([
    prisma.clayBodies.findMany({
      where: { user_id: session.user.id },
      select: { id: true, name: true },
    }),
    prisma.decorations.findMany({
      where: { user_id: session.user.id },
      select: { id: true, name: true },
    }),
    prisma.testSeries.findMany({
      where: { user_id: session.user.id },
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
        testSeries={testSeries}
      />
    </FormLayout>
  )
}