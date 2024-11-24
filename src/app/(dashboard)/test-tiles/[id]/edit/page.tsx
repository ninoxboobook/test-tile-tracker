import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { TestTileForm } from '@/components/test-tiles/test-tile-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { updateTestTile } from './actions'
import type { TestTileFormData } from '@/lib/schemas/test-tile'

export default async function EditTestTilePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const testTile = await prisma.testTiles.findFirst({
    where: {
      id: params.id,
      user_id: session.user.id,
    },
    include: {
      clay_body: true,
      decoration: true,
      test_series: true,
    },
  })

  if (!testTile) {
    return notFound()
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

  // Transform the Prisma data into form data format
  const formData: TestTileFormData = {
    name: testTile.name,
    description: testTile.description || undefined,
    clay_body_id: testTile.clay_body_id,
    decoration_id: testTile.decoration_id || undefined,
    test_series_id: testTile.test_series_id || undefined,
  }

  return (
    <FormLayout 
      title="Edit Test Tile"
      description={`Editing ${testTile.name}`}
      backHref={`/test-tiles/${params.id}`}
    >
      <TestTileForm 
        action={updateTestTile}
        initialData={formData}
        submitButtonText="Update Test Tile"
        clayBodies={clayBodies}
        decorations={decorations}
        testSeries={testSeries}
      />
    </FormLayout>
  )
} 