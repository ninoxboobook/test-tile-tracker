import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ClayBodyForm } from '@/components/clay-bodies/clay-body-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { createClayBody } from './actions'

export default async function NewClayBodyPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  return (
    <FormLayout 
      title="New Clay Body"
      description="Add a new clay body to your database"
      backHref="/clay-bodies"
    >
      <ClayBodyForm action={createClayBody} />
    </FormLayout>
  )
}
