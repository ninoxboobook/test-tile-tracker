import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { UsersTable } from './users-table'

async function getUsers() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          testTiles: true,
          decorations: true,
          clayBodies: true,
          collections: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Convert dates to strings for serialization
  return users.map(user => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  }))
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <PageLayout title="Users">
      <UsersTable users={users} />
    </PageLayout>
  )
}
