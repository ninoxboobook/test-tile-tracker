import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/ui/layout/page-layout'
import Link from 'next/link'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { formatDate } from '@/lib/utils'

async function getUsers() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      isPublic: true,
      createdAt: true,
      _count: {
        select: {
          clayBodies: true,
          decorations: true,
          testTiles: true,
          collections: true,
        }
      }
    }
  })
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <PageLayout title="Users">
      <div className="bg-sand-light rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-clay-200">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-clay-900 sm:pl-6">
                  User
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-clay-900">
                  Role
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-clay-900">
                  Public
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-clay-900">
                  Clay Bodies
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-clay-900">
                  Decorations
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-clay-900">
                  Test Tiles
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-clay-900">
                  Collections
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-clay-900">
                  Joined
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clay-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div className="flex items-center">
                      <div>
                        <div className="font-medium text-clay-900">{user.username}</div>
                        <div className="text-clay-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-clay-500">
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-clay-500">
                    {user.isPublic ? 'Yes' : 'No'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-clay-500">{user._count.clayBodies}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-clay-500">{user._count.decorations}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-clay-500">{user._count.testTiles}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-clay-500">{user._count.collections}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-clay-500">{formatDate(user.createdAt)}</td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link href={`/admin/users/${user.id}`}>
                      <ActionButton variant="tertiary">View</ActionButton>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  )
}
