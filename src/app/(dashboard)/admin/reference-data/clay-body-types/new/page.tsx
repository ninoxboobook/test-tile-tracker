import { PageLayout } from '@/components/ui/layout/page-layout'
import { createClayBodyType } from '../actions'

export default function NewClayBodyTypePage() {
  return (
    <PageLayout title="New Clay Body Type">
      <form action={createClayBodyType} className="space-y-8 divide-y divide-clay-200">
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
                className="block w-full rounded-md border-clay-300 shadow-sm focus:ring-clay-500 focus:border-clay-500 sm:text-sm"
                required
              />
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-clay-600 hover:bg-clay-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clay-500"
            >
              Create
            </button>
          </div>
        </div>
      </form>
    </PageLayout>
  )
}
