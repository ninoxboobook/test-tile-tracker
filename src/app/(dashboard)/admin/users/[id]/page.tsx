import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'

async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
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

  if (!user) {
    notFound()
  }

  return user
}

export default async function UserPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await getUser(params.id)

  return (
    <PageLayout title={`User: ${user.username || user.email}`}>
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-clay-900">Basic Information</h3>
            <div className="mt-5 border-t border-clay-200">
              <dl className="divide-y divide-clay-200">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-clay-500">Username</dt>
                  <dd className="mt-1 text-sm text-clay-900 sm:col-span-2 sm:mt-0">{user.username || '-'}</dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-clay-500">Email</dt>
                  <dd className="mt-1 text-sm text-clay-900 sm:col-span-2 sm:mt-0">{user.email}</dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-clay-500">Role</dt>
                  <dd className="mt-1 text-sm text-clay-900 sm:col-span-2 sm:mt-0">{user.role}</dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-clay-500">Name</dt>
                  <dd className="mt-1 text-sm text-clay-900 sm:col-span-2 sm:mt-0">
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '-'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Activity Statistics */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-clay-900">Activity Statistics</h3>
            <div className="mt-5 border-t border-clay-200">
              <dl className="divide-y divide-clay-200">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-clay-500">Clay Bodies</dt>
                  <dd className="mt-1 text-sm text-clay-900 sm:col-span-2 sm:mt-0">{user._count.clayBodies}</dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-clay-500">Decorations</dt>
                  <dd className="mt-1 text-sm text-clay-900 sm:col-span-2 sm:mt-0">{user._count.decorations}</dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-clay-500">Test Tiles</dt>
                  <dd className="mt-1 text-sm text-clay-900 sm:col-span-2 sm:mt-0">{user._count.testTiles}</dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-clay-500">Collections</dt>
                  <dd className="mt-1 text-sm text-clay-900 sm:col-span-2 sm:mt-0">{user._count.collections}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Account Dates */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-clay-900">Account Information</h3>
            <div className="mt-5 border-t border-clay-200">
              <dl className="divide-y divide-clay-200">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-clay-500">Created</dt>
                  <dd className="mt-1 text-sm text-clay-900 sm:col-span-2 sm:mt-0">
                    {formatDate(new Date(user.createdAt))}
                  </dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-clay-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-clay-900 sm:col-span-2 sm:mt-0">
                    {formatDate(new Date(user.updatedAt))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
