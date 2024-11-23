import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { AddTestTileButton } from '@/components/test-tiles/add-test-tile-button'
import { TestTileGrid } from '@/components/test-tiles/test-tile-grid'

export default async function TestTilesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const testTiles = await prisma.testTiles.findMany({
    where: {
      user_id: session.user.id
    },
    include: {
      test_series: true,
      clay_body: true,
      decoration: true
    },
    orderBy: {
      created_at: 'desc'
    }
  })

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Test Tiles</h1>
          <AddTestTileButton />
        </div>

        <div className="mt-8">
          <TestTileGrid testTiles={testTiles} />
        </div>
      </div>
    </div>
  )
}
