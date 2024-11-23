import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { AddTestTileButton } from '@/components/test-tiles/add-test-tile-button'
import { TestTileGrid } from '@/components/test-tiles/test-tile-grid'

export default async function TestTilesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const testTiles = await prisma.testTile.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      testSeries: true,
      clayBody: true,
      decorations: true
    },
    orderBy: {
      createdAt: 'desc'
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
