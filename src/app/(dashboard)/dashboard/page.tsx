import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { DashboardCard } from '@/components/dashboard/dashboard-card'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const [testTileCount, testSeriesCount, clayBodiesCount, decorationsCount] = await Promise.all([
    prisma.testTiles.count({
      where: { user_id: session.user.id }
    }),
    prisma.testSeries.count({
      where: { user_id: session.user.id }
    }),
    prisma.clayBodies.count({
      where: { user_id: session.user.id }
    }),
    prisma.decorations.count({
      where: { user_id: session.user.id }
    })
  ])

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Test Tiles"
            count={testTileCount}
            href="/test-tiles"
            description="View all test tiles"
          />
          <DashboardCard
            title="Test Series"
            count={testSeriesCount}
            href="/test-series"
            description="View all test series"
          />
          <DashboardCard
            title="Clay Bodies"
            count={clayBodiesCount}
            href="/clay-bodies"
            description="View all clay bodies"
          />
          <DashboardCard
            title="Decorations"
            count={decorationsCount}
            href="/decorations"
            description="View all decorations"
          />
        </div>
      </div>
    </div>
  )
}
