import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  const [testTileCount, testSeriesCount, clayBodiesCount, decorationsCount] = await Promise.all([
    prisma.testTile.count({
      where: { userId: session?.user?.id }
    }),
    prisma.testSeries.count({
      where: { userId: session?.user?.id }
    }),
    prisma.clayBody.count({
      where: { userId: session?.user?.id }
    }),
    prisma.decoration.count({
      where: { userId: session?.user?.id }
    }),
  ])

  const stats = [
    { name: 'Test Tiles', value: testTileCount },
    { name: 'Test Series', value: testSeriesCount },
    { name: 'Clay Bodies', value: clayBodiesCount },
    { name: 'Decorations', value: decorationsCount },
  ]

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}! Here's an overview of your pottery test tiles.
        </p>
      </div>

      <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-clay-500 p-3">
                <div className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8">
        {/* Recent items will be added here */}
      </div>
    </div>
  )
}
