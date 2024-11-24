import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DecorationForm } from '@/components/decorations/decoration-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { createDecoration } from './actions'

export default async function NewDecorationPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  return (
    <FormLayout 
      title="New Decoration"
      description="Add a new glaze or surface decoration"
      backHref="/decorations"
    >
      <DecorationForm action={createDecoration} />
    </FormLayout>
  )
}
