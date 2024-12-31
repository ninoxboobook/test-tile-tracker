import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import Link from 'next/link'
import { ActionButton } from '@/components/ui/buttons/action-button'

async function getClayBodyTypes() {
  const types = await prisma.clayBodyType.findMany({
    include: {
      _count: {
        select: {
          clayBodies: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  return types
}

export default async function ClayBodyTypesPage() {
  const types = await getClayBodyTypes()

  return (
    <PageLayout 
      title="Clay Body Types"
      action={
        <Link href="/admin/reference-data/clay-body-types/new">
        <ActionButton>Add new type</ActionButton>
      </Link>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {types.map((type) => (
            <div
              key={type.id}
              className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-clay-900">{type.name}</h3>
              <p className="mt-1 text-sm text-clay-500">
                Used in {type._count.clayBodies} clay {type._count.clayBodies === 1 ? 'body' : 'bodies'}
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-clay-300 shadow-sm text-sm font-medium rounded text-clay-700 bg-white hover:bg-clay-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clay-500"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={type._count.clayBodies > 0}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
