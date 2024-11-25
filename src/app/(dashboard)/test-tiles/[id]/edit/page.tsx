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

  const testTile = await prisma.testTile.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      clayBody: true,
      decorations: true,
      collections: true,
    },
  })

  if (!testTile) {
    return notFound()
  }

  // Get all available clay bodies, decorations, and test series for the form
  const [clayBodies, decorations, testSeries] = await Promise.all([
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
  
  // Transform the Prisma data into form data format
  const formData: TestTileFormData = {
    name: testTile.name,
    clay_body_id: testTile.clayBodyId,
    decoration_id: testTile.decorations.length > 0 ? testTile.decorations[0].id : undefined,
    test_series_id: testTile.collections.length > 0 ? testTile.collections[0].id : undefined,
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