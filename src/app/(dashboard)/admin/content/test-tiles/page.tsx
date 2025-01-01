import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { Suspense } from 'react'
import { TestTilesContent } from './content'

async function getTestTiles() {
  const testTiles = await prisma.testTile.findMany({
    include: {
      user: {
        select: {
          username: true,
          email: true
        }
      },
      clayBody: true,
      decorationLayers: {
        include: {
          decorations: true
        }
      },
      cone: true,
      atmosphere: true,
      _count: {
        select: {
          collections: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Convert dates to strings for serialization
  return testTiles.map(testTile => ({
    ...testTile,
    createdAt: testTile.createdAt.toISOString(),
    updatedAt: testTile.updatedAt.toISOString()
  }))
}

export default async function TestTilesPage() {
  const testTiles = await getTestTiles()

  return (
    <PageLayout 
      title="Test Tiles"
      description="View and manage all test tiles across the platform"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <TestTilesContent testTiles={testTiles} />
      </Suspense>
    </PageLayout>
  )
}
