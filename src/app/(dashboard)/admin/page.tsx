'use server'

import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { DashboardCard } from '@/components/dashboard/dashboard-card'

async function getAdminMetrics() {
  const [
    totalUsers,
    activeUsers,
    adminUsers,
    totalClayBodies,
    totalDecorations,
    totalTestTiles,
    totalCollections,
    lastWeekUsers,
    lastWeekClayBodies,
    lastWeekDecorations,
    lastWeekTestTiles,
    lastWeekCollections,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.user.count({
      where: {
        role: 'ADMIN'
      }
    }),
    prisma.clayBody.count(),
    prisma.decoration.count(),
    prisma.testTile.count(),
    prisma.collection.count(),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.clayBody.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.decoration.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.testTile.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.collection.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    }),
  ])

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      admins: adminUsers,
      newLastWeek: lastWeekUsers,
    },
    content: {
      clayBodies: totalClayBodies,
      decorations: totalDecorations,
      testTiles: totalTestTiles,
      collections: totalCollections,
    },
    lastWeekCreated: {
      clayBodies: lastWeekClayBodies,
      decorations: lastWeekDecorations,
      testTiles: lastWeekTestTiles,
      collections: lastWeekCollections,
    },
  }
}

export default async function Page() {
  const metrics = await getAdminMetrics()

  return (
    <PageLayout title="Admin Dashboard">
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-clay-900 mb-4">Users</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="Total Users"
              count={metrics.users.total}
              href="/admin/users"
              description="View all users"
            />
            <DashboardCard
              title="Active Users (7d)"
              count={metrics.users.active}
              href="/admin/users?filter=active"
              description="View active users"
            />
            <DashboardCard
              title="New Users (7d)"
              count={metrics.users.newLastWeek}
              href="/admin/users?filter=new"
              description="View new users"
            />
            <DashboardCard
              title="Admin Users"
              count={metrics.users.admins}
              href="/admin/users?filter=admin"
              description="View admin users"
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-clay-900 mb-4">Content</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="Clay Bodies"
              count={metrics.content.clayBodies}
              href="/admin/content/clay-bodies"
              description={`${metrics.lastWeekCreated.clayBodies} new this week`}
            />
            <DashboardCard
              title="Decorations"
              count={metrics.content.decorations}
              href="/admin/content/decorations"
              description={`${metrics.lastWeekCreated.decorations} new this week`}
            />
            <DashboardCard
              title="Test Tiles"
              count={metrics.content.testTiles}
              href="/admin/content/test-tiles"
              description={`${metrics.lastWeekCreated.testTiles} new this week`}
            />
            <DashboardCard
              title="Collections"
              count={metrics.content.collections}
              href="/admin/content/collections"
              description={`${metrics.lastWeekCreated.collections} new this week`}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
