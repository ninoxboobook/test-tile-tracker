import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import Link from 'next/link'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { deleteCone } from './actions'

async function getCones() {
  const cones = await prisma.cone.findMany({
    include: {
      _count: {
        select: {
          testTiles: true,
          clayBodies: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })
  return cones
}

export default async function ConesPage() {
  const cones = await getCones()

  return (
    <PageLayout 
      title="Cones"
      action={
        <Link href="/admin/reference-data/cones/new">
          <ActionButton>Add new cone</ActionButton>
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cones.map((cone) => (
            <div
              key={cone.id}
              className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-clay-900">Cone {cone.name}</h3>
              <p className="mt-1 text-sm text-clay-500">
                Used in {cone._count.testTiles} test {cone._count.testTiles === 1 ? 'tile' : 'tiles'}
              </p>
              <div className="mt-4 flex space-x-3">
                <Link
                  href={`/admin/reference-data/cones/${cone.id}/edit`}
                  className="inline-flex items-center px-3 py-1.5 border border-clay-300 shadow-sm text-sm font-medium rounded text-clay-700 bg-white hover:bg-clay-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clay-500"
                >
                  Edit
                </Link>
                {(cone._count.clayBodies === 0 && cone._count.testTiles === 0) && (
                  <DeleteButton
                    onDelete={async () => {
                      'use server'
                      await deleteCone(cone.id)
                    }}
                    itemName="Cone"
                  />
                )}
                {(cone._count.clayBodies > 0 || cone._count.testTiles > 0) && (
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled
                    title="Cannot delete cone that is being used by clay bodies or test tiles"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
