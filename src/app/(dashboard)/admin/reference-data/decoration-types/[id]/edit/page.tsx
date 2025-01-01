import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { updateDecorationType } from '../../actions'

async function getDecorationType(id: string) {
  const decorationType = await prisma.decorationType.findUnique({
    where: { id }
  })

  if (!decorationType) {
    notFound()
  }

  return decorationType
}

export default async function EditDecorationTypePage(
  props: {
    params: Promise<{ id: string }>
  }
) {
  const params = await props.params;
  const decorationType = await getDecorationType(params.id)

  return (
    <PageLayout title="Edit Decoration Type">
      <form action={updateDecorationType} className="space-y-8 divide-y divide-clay-200">
        <div className="space-y-6 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-clay-700 sm:mt-px sm:pt-2"
            >
              Name
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={decorationType.name}
                className="block w-full rounded-md border-clay-300 shadow-sm focus:ring-clay-500 focus:border-clay-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <input type="hidden" name="id" value={decorationType.id} />

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-clay-600 hover:bg-clay-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clay-500"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </PageLayout>
  )
}
