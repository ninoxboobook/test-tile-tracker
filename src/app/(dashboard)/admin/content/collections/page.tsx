import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { Suspense } from 'react'
import { CollectionsContent } from './content'

async function getCollections() {
  const collections = await prisma.collection.findMany({
    include: {
      user: {
        select: {
          username: true,
          email: true
        }
      },
      _count: {
        select: {
          testTiles: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Convert dates to strings for serialization
  return collections.map(collection => ({
    ...collection,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString()
  }))
}

export default async function CollectionsPage() {
  const collections = await getCollections()

  return (
    <PageLayout 
      title="Collections"
      description="View and manage all collections across the platform"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <CollectionsContent collections={collections} />
      </Suspense>
    </PageLayout>
  )
}
