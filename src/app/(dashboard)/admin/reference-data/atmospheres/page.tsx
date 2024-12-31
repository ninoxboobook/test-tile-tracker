import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import Link from 'next/link'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { deleteAtmosphere } from './actions'

async function getAtmospheres() {
  const atmospheres = await prisma.atmosphere.findMany({
    include: {
      _count: {
        select: {
          testTiles: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  return atmospheres
}

export default async function AtmospheresPage() {
  const atmospheres = await getAtmospheres()

  return (
    <PageLayout 
      title="Atmospheres"
      action={
        <Link href="/admin/reference-data/atmospheres/new">
          <ActionButton>Add new atmosphere</ActionButton>
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {atmospheres.map((atmosphere) => (
            <div
              key={atmosphere.id}
              className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-clay-900">{atmosphere.name}</h3>
              <p className="mt-1 text-sm text-clay-500">
                Used in {atmosphere._count.testTiles} test {atmosphere._count.testTiles === 1 ? 'tile' : 'tiles'}
              </p>
              <div className="mt-4 flex space-x-3">
                <Link
                  href={`/admin/reference-data/atmospheres/${atmosphere.id}/edit`}
                  className="inline-flex items-center px-3 py-1.5 border border-clay-300 shadow-sm text-sm font-medium rounded text-clay-700 bg-white hover:bg-clay-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clay-500"
                >
                  Edit
                </Link>
                {atmosphere._count.testTiles === 0 && (
                  <DeleteButton
                    onDelete={async () => {
                      'use server'
                      await deleteAtmosphere(atmosphere.id)
                    }}
                    itemName="Atmosphere"
                  />
                )}
                {atmosphere._count.testTiles > 0 && (
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled
                    title="Cannot delete atmosphere that is being used by test tiles"
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
