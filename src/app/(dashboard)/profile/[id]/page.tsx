import { getUserProfileById } from './actions'
import { FormLayout } from '@/components/ui/layout/form-layout'
import Link from 'next/link'
import Image from 'next/image'

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await getUserProfileById(params.id)

  return (
    <FormLayout
      title={`${user.username}'s Profile`}
      description="View user profile and recent test tiles"
      backHref="/dashboard"
    >
      <div className="space-y-8">
        {/* Profile Information */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center space-x-4">
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={`${user.username}'s profile picture`}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-clay-500 flex items-center justify-center">
                  <span className="text-xl text-white font-medium">
                    {user.username[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium leading-6 text-clay-900">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username}
                </h3>
                <p className="mt-1 text-sm text-clay-500">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-clay-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-clay-500">Username</dt>
                <dd className="mt-1 text-sm text-clay-900">{user.username}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-clay-500">Email</dt>
                <dd className="mt-1 text-sm text-clay-900">{user.email}</dd>
              </div>
              {user.firstName && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-clay-500">First Name</dt>
                  <dd className="mt-1 text-sm text-clay-900">{user.firstName}</dd>
                </div>
              )}
              {user.lastName && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-clay-500">Last Name</dt>
                  <dd className="mt-1 text-sm text-clay-900">{user.lastName}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Recent Test Tiles */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-clay-900">Recent Test Tiles</h3>
            <p className="mt-1 text-sm text-clay-500">Last 5 test tiles created by this user</p>
          </div>
          <div className="border-t border-clay-200">
            <ul role="list" className="divide-y divide-clay-200">
              {user.testTiles.length > 0 ? (
                user.testTiles.map((tile) => (
                  <li key={tile.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/test-tiles/${tile.id}`}
                          className="text-sm font-medium text-clay-600 hover:text-clay-900 truncate"
                        >
                          {tile.name}
                        </Link>
                        <p className="text-sm text-clay-500 truncate">
                          {tile.clayBody.name} • {tile.decorationLayers.reduce((total, layer) => total + layer.decorations.length, 0)} decorations
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-5">
                        <div className="text-sm text-clay-500">
                          {formatDate(tile.createdAt)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 sm:px-6 text-sm text-clay-500">
                  No test tiles found
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </FormLayout>
  )
}
