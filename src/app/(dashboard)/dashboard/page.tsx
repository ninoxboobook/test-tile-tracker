import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { PageLayout } from '@/components/ui/layout/page-layout'

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
    <PageLayout 
      title="Dashboard"
      description="Overview of your pottery documentation"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
    </PageLayout>
  )
}
