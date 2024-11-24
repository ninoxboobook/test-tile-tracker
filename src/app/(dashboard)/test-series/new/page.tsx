import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TestSeriesForm } from '@/components/test-series/test-series-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { createTestSeries } from './actions'

export default async function NewTestSeriesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  return (
    <FormLayout 
      title="New Test Series"
      description="Create a new series of related test tiles"
      backHref="/test-series"
    >
      <TestSeriesForm action={createTestSeries} />
    </FormLayout>
  )
}
