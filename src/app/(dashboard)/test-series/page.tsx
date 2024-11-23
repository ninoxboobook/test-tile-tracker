import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { TestSeriesTable } from '@/components/test-series/test-series-table'
import Link from 'next/link'

export default async function TestSeriesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
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
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Test Series</h1>
          <Link
            href="/test-series/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-clay-600 hover:bg-clay-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clay-500"
          >
            Add New Test Series
          </Link>
        </div>

        <div className="mt-8">
          <TestSeriesTable testSeries={testSeries} />
        </div>
      </div>
    </div>
  )
}
