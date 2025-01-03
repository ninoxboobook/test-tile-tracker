import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { CollectionForm } from '@/components/collections/collection-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { createCollection } from './actions'

export default async function NewCollectionPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Fetch test tiles for the current user
  const testTiles = await prisma.testTile.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  })

  return (
    <FormLayout 
      title="Add new collection"
      backHref="/collections"
    >
      <CollectionForm 
        action={createCollection} 
        testTiles={testTiles}
      />
    </FormLayout>
  )
}
