import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { TestSeriesForm } from '@/components/test-series/test-series-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { updateTestSeries } from './actions'
import type { TestSeriesFormData } from '@/lib/schemas/test-series'

// Helper function to convert JSON to string
function jsonToString(value: any): string | undefined {
  if (!value) return undefined
  return typeof value === 'string' ? value : JSON.stringify(value)
}

export default async function EditTestSeriesPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const testSeries = await prisma.testSeries.findFirst({
    where: {
      id: params.id,
      user_id: session.user.id,
    },
  })

  if (!testSeries) {
    return notFound()
  }

  const formData: TestSeriesFormData = {
    name: testSeries.name,
    description: testSeries.description || undefined,
    variables: jsonToString(testSeries.variables),
    goal: testSeries.goal || undefined,
    status: testSeries.status,
    conclusions: testSeries.conclusions || undefined,
  }

  return (
    <FormLayout 
      title="Edit Test Series"
      description={`Editing ${testSeries.name}`}
      backHref={`/test-series/${params.id}`}
    >
      <TestSeriesForm 
        action={updateTestSeries}
        initialData={formData}
        submitButtonText="Update Test Series"
      />
    </FormLayout>
  )
} 