import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { CollectionForm } from '@/components/collections/collection-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { updateCollection } from './actions'
import { getSessionWithAuth } from '@/lib/auth/admin'
import type { CollectionFormData } from '@/lib/schemas/collection'

export default async function EditCollectionPage(
  props: {
    params: Promise<{ id: string }>
  }
) {
  const params = await props.params;
  const { session, isAdmin } = await getSessionWithAuth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const collection = await prisma.collection.findUnique({
    where: {
      id: params.id,
      ...(isAdmin ? {} : { userId: session.user.id })
    },
    include: {
      testTiles: true,
    },
  })

  if (!collection) {
    return notFound()
  }

  const testTiles = await prisma.testTile.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  })

  const formData: CollectionFormData & { id: string } = {
    id: collection.id,
    name: collection.name,
    description: collection.description || null,
    testTileIds: collection.testTiles.map(tile => tile.id),
    isPublic: collection.isPublic
  }

  return (
    <FormLayout 
      title={`Edit ${collection.name}`}
      backHref={`/collections/${params.id}`}
    >
      <CollectionForm 
        action={updateCollection}
        initialData={formData}
        submitButtonText="Update collection"
        testTiles={testTiles}
      />
    </FormLayout>
  )
}