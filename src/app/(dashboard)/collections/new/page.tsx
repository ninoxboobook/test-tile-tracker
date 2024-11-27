import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CollectionForm } from '@/components/collections/collection-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { createCollection } from './actions'

export default async function NewCollectionPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  return (
    <FormLayout 
      title="New Collection"
      description="Create a new collection of tiles"
      backHref="/collections"
    >
      <CollectionForm action={createCollection} />
    </FormLayout>
  )
}
