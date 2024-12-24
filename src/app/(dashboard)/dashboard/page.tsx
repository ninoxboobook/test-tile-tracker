import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { PageLayout } from '@/components/ui/layout/page-layout'
import Link from 'next/link'

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) {
    return 'Good morning'
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon'
  } else if (hour >= 17 || hour < 5) {
    return 'Good evening'
  }
  return 'Welcome'
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const currentHour = new Date().getHours()
  const greeting = getGreeting(currentHour)

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { firstName: true, username: true }
  })

  const firstName = user?.firstName || user?.username || session.user.username

  const [testTileCount, collectionCount, clayBodiesCount, decorationsCount] = await Promise.all([
    prisma.testTile.count({
      where: { userId: session.user.id }
    }),
    prisma.collection.count({
      where: { userId: session.user.id }
    }),
    prisma.clayBody.count({
      where: { userId: session.user.id }
    }),
    prisma.decoration.count({
      where: { userId: session.user.id }
    })
  ])

  return (
    <PageLayout
      title={`${greeting}, ${firstName}!`}
      description="Here&rsquo;s an overview of your test tiles, collections, clay bodies, and decorations."
      variant="detail"
    >
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-9 bg-sand-light rounded-2xl p-8">
          <div className="flex justify-between mb-10">
          <h2 className="text-2xl font-display font-semibold text-clay-800">Latest test tiles</h2>
          <Link href="/test-tiles" className="px-4 py-2 inline-flex items-center border border-transparent rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 text-brand bg-sand-light border-brand hover:bg-clay-50 focus:ring-clay-500 disabled:opacity-50">
            View all
          </Link>
          </div>
        </div>
        <div className="col-span-3 space-y-8">
          <DashboardCard
            title="Test tiles"
            count={testTileCount}
            href="/test-tiles"
            description="View all test tiles"
          />
          <DashboardCard
            title="Collections"
            count={collectionCount}
            href="/collections"
            description="View all collections"
          />
          <DashboardCard
            title="Clay bodies"
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
    </PageLayout>
  )
}
