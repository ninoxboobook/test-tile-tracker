import { PageLayout } from '@/components/ui/layout/page-layout'

export default function SettingsPage() {
  return (
    <PageLayout title="Admin Settings">
      <div className="space-y-6">
        {/* Site Settings */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-clay-900">Site Settings</h3>
            <div className="mt-5 space-y-6">
              <div>
                <label htmlFor="site-name" className="block text-sm font-medium text-clay-700">
                  Site Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="site-name"
                    id="site-name"
                    className="block w-full rounded-md border-clay-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                    defaultValue="Test Tile Tracker"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="site-description" className="block text-sm font-medium text-clay-700">
                  Site Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="site-description"
                    name="site-description"
                    rows={3}
                    className="block w-full rounded-md border-clay-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                    defaultValue="Track and manage your pottery test tiles"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Settings */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-clay-900">Registration Settings</h3>
            <div className="mt-5 space-y-6">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="allow-registration"
                    name="allow-registration"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-clay-300 text-brand focus:ring-brand"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="allow-registration" className="font-medium text-clay-700">
                    Allow New User Registration
                  </label>
                  <p className="text-clay-500">Enable or disable new user registration on the site.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="require-approval"
                    name="require-approval"
                    type="checkbox"
                    className="h-4 w-4 rounded border-clay-300 text-brand focus:ring-brand"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="require-approval" className="font-medium text-clay-700">
                    Require Admin Approval
                  </label>
                  <p className="text-clay-500">New users must be approved by an admin before they can log in.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Settings */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-clay-900">Content Settings</h3>
            <div className="mt-5 space-y-6">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="moderate-content"
                    name="moderate-content"
                    type="checkbox"
                    className="h-4 w-4 rounded border-clay-300 text-brand focus:ring-brand"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="moderate-content" className="font-medium text-clay-700">
                    Moderate New Content
                  </label>
                  <p className="text-clay-500">New clay bodies and decorations must be approved before being published.</p>
                </div>
              </div>

              <div>
                <label htmlFor="max-images" className="block text-sm font-medium text-clay-700">
                  Maximum Images per Test Tile
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="max-images"
                    id="max-images"
                    className="block w-full rounded-md border-clay-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                    defaultValue="5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
          >
            Save Settings
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
