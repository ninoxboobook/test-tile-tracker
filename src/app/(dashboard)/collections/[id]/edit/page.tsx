import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { CollectionForm } from '@/components/collections/collection-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { updateCollection } from './actions'
import type { CollectionFormData } from '@/lib/schemas/collection'

export default async function EditCollectionPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const collection = await prisma.collection.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!collection) {
    return notFound()
  }

  const formData: CollectionFormData & { id: string } = {
    id: collection.id,
    name: collection.name,
    description: collection.description || null,
  }

  return (
    <FormLayout 
      title="Edit Collection"
      description={`Editing ${collection.name}`}
      backHref={`/collections/${params.id}`}
    >
      <CollectionForm 
        action={updateCollection}
        initialData={formData}
        submitButtonText="Update Collection"
      />
    </FormLayout>
  )
} 