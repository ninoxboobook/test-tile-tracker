import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import Link from 'next/link'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { DeleteDecorationTypeButton } from './delete-decoration-type-button'

async function getDecorationTypes() {
  const types = await prisma.decorationType.findMany({
    include: {
      _count: {
        select: {
          decorations: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  return types
}

export default async function DecorationTypesPage() {
  const types = await getDecorationTypes()

  return (
    <PageLayout 
      title="Decoration Types"
      action={
        <Link href="/admin/reference-data/decoration-types/new">
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
                Used in {type._count.decorations} {type._count.decorations === 1 ? 'decoration' : 'decorations'}
              </p>
              <div className="mt-4 flex space-x-3">
                <Link
                  href={`/admin/reference-data/decoration-types/${type.id}/edit`}
                  className="inline-flex items-center px-3 py-1.5 border border-clay-300 shadow-sm text-sm font-medium rounded text-clay-700 bg-white hover:bg-clay-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clay-500"
                >
                  Edit
                </Link>
                {type._count.decorations === 0 && (
                  <DeleteDecorationTypeButton id={type.id} />
                )}
                {type._count.decorations > 0 && (
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled
                    title="Cannot delete decoration type that is being used by decorations"
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
