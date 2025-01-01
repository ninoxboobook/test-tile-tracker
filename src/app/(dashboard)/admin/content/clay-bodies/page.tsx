import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { Suspense } from 'react'
import { ClayBodiesContent } from './content'

async function getClayBodies() {
  const clayBodies = await prisma.clayBody.findMany({
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
  return clayBodies.map(clayBody => ({
    ...clayBody,
    createdAt: clayBody.createdAt.toISOString(),
    updatedAt: clayBody.updatedAt.toISOString()
  }))
}

export default async function ClayBodiesPage() {
  const clayBodies = await getClayBodies()

  return (
    <PageLayout 
      title="Clay Bodies"
      description="View and manage all clay bodies across the platform"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ClayBodiesContent clayBodies={clayBodies} />
      </Suspense>
    </PageLayout>
  )
}
