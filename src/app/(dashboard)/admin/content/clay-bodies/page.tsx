import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ClayBodiesTable } from './clay-bodies-table'
import { Suspense } from 'react'

export async function getClayBodies() {
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
    <PageLayout title="Clay Bodies">
      <Suspense fallback={<div>Loading...</div>}>
        <ClayBodiesTable clayBodies={clayBodies} />
      </Suspense>
    </PageLayout>
  )
}
