import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { Suspense } from 'react'
import { DecorationsContent } from './content'

async function getDecorations() {
  // No need to check isAdmin here since middleware already ensures this is an admin route
  const decorations = await prisma.decoration.findMany({
    include: {
      user: {
        select: {
          username: true,
          email: true
        }
      },
      type: true,
      _count: {
        select: {
          decorationLayers: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Convert dates to strings for serialization
  return decorations.map(decoration => ({
    ...decoration,
    createdAt: decoration.createdAt.toISOString(),
    updatedAt: decoration.updatedAt.toISOString()
  }))
}

export default async function DecorationsPage() {
  const decorations = await getDecorations()

  return (
    <PageLayout 
      title="Decorations"
      description="View and manage all decorations across the platform"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <DecorationsContent decorations={decorations} />
      </Suspense>
    </PageLayout>
  )
}
