import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { DataGridTile } from '@/components/ui/data/data-grid-tile'
import { EmptyState } from '@/components/ui/data/data-empty-state'
import { LozengeVariant } from '@/components/ui/lozenge'
import Link from 'next/link'
import { baseButtonStyles, buttonSizes, buttonVariants } from '@/components/ui/buttons/action-button'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

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

  const recentTestTiles = await prisma.testTile.findMany({
    where: { userId: session.user.id },
    include: {
      clayBody: true,
      cone: true,
      atmosphere: true,
      collections: {
        select: { name: true }
      },
      decorationLayers: {
        include: {
          decorations: {
            select: { name: true }
          }
        },
        orderBy: {
          order: 'asc'
        }
      }
    },
    orderBy: { updatedAt: 'desc' },
    take: 12
  })

  return (
    <PageLayout
      title={`Welcome, ${firstName}!`}
      description="Here&rsquo;s an overview of your test tiles, collections, clay bodies, and decorations."
      variant="detail"
    >
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-9 order-2 md:order-1 bg-sand-light rounded-2xl p-8">
          <div className="flex justify-between mb-10">
            <h2 className="text-2xl font-display font-semibold text-clay-800">Latest test tiles</h2>
            <Link href="/test-tiles" className={classNames(baseButtonStyles, buttonSizes.default, buttonVariants.secondary)}>
              View all
            </Link>
          </div>
          {recentTestTiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentTestTiles.map((tile) => (
                <Link key={tile.id} href={`/test-tiles/${tile.id}`} className="overflow-hidden rounded-lg border border-clay-200 bg-clay-50 hover:border-clay-300">
                  <DataGridTile
                    title={tile.name}
                    subtitle={tile.clayBody.name}
                    images={tile.imageUrl || []}
                    lozenges={[
                      {
                        label: /^(Low|Mid|High)/.test(tile.cone.name) ? tile.cone.name : `Cone ${tile.cone.name}`,
                        lozengeVariant: 'brand' as LozengeVariant
                      },
                      { label: tile.atmosphere.name, lozengeVariant: 'brand-emphasis' as LozengeVariant },
                    ]}
                    metadata={[
                      ...(tile.decorationLayers.length > 0 ? [{
                        value: tile.decorationLayers
                          .flatMap(layer => layer.decorations.map(d => d.name))
                          .join(', ')
                      }] : []),
                    ]}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No test tiles yet"
              description="Create your first test tile to start documenting your experiments."
              action={
                <Link
                  href="/test-tiles/new"
                  className={classNames(baseButtonStyles, buttonSizes.compact, buttonVariants.primary)}
                >
                  Create test tile
                </Link>
              }
            />
          )}
        </div>
        <div className="col-span-12 md:col-span-3 order-1 md:order-2 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
            <div className="col-span-2 sm:col-span-1 md:col-span-2">
              <DashboardCard
                title="Test tiles"
                count={testTileCount}
                href="/test-tiles"
                description="View all test tiles"
              />
            </div>
            <div className="col-span-2 sm:col-span-1 md:col-span-2">
              <DashboardCard
                title="Collections"
                count={collectionCount}
                href="/collections"
                description="View all collections"
              />
            </div>
            <div className="col-span-2 sm:col-span-1 md:col-span-2">
              <DashboardCard
                title="Clay bodies"
                count={clayBodiesCount}
                href="/clay-bodies"
                description="View all clay bodies"
              />
            </div>
            <div className="col-span-2 sm:col-span-1 md:col-span-2">
              <DashboardCard
                title="Decorations"
                count={decorationsCount}
                href="/decorations"
                description="View all decorations"
              />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
