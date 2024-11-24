import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { TestSeriesTable } from '@/components/test-series/test-series-table'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import Link from 'next/link'

export default async function TestSeriesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const testSeries = await prisma.testSeries.findMany({
    where: {
      user_id: session.user.id
    },
    orderBy: {
      created_at: 'desc'
    }
  })

  return (
    <PageLayout 
      title="Test Series"
      description="Organize your test tiles into series"
      action={
        <Link href="/test-series/new">
          <ActionButton>Add New Test Series</ActionButton>
        </Link>
      }
    >
      <TestSeriesTable testSeries={testSeries} />
    </PageLayout>
  )
}
