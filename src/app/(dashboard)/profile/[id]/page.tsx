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
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-4">
          <div className="bg-sand-light rounded-2xl p-8">
            <div className="flex flex-col items-center space-y-6">
              {user.imageUrl ? (
                <div className="relative h-40 w-40 overflow-hidden rounded-full ring-2 ring-brand ring-offset-2">
                  <Image
                    src={user.imageUrl}
                    alt={`${user.username}'s profile picture`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 w-40 rounded-full bg-clay-500 flex items-center justify-center">
                  <span className="text-xl text-white font-medium">
                    {user.username[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div className="text-center">
                {user?.firstName && user?.lastName ? (
                  <>
                    <h2 className="text-2xl font-semibold text-clay-800">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-clay-500">@{user?.username}
                    </p>
                  </>
                ) : (
                  <h2 className="text-2xl font-semibold text-clay-800">
                    {user?.username}
                  </h2>
                )}
              </div>
            </div>
          </div>
        </div>


        <div className="col-span-8 bg-sand-light rounded-2xl">
          <div className="p-8">
            <h3 className="text-2xl font-semibold text-clay-800">Recent test tiles</h3>
            <p className="mt-2 text-clay-600">Last 5 test tiles created by {user?.username}</p>
          </div>
          <div className="border-t border-clay-200">
            <ul role="list" className="divide-y divide-clay-200">
              {user.testTiles.length > 0 ? (
                user.testTiles.map((tile) => (
                  <li key={tile.id} className="px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/test-tiles/${tile.id}`}
                          className="font-semibold text-brand hover:text-clay-900 truncate"
                        >
                          {tile.name}
                        </Link>
                        <p className="text-clay-600 truncate">
                          {tile.clayBody.name} • {tile.decorationLayers.reduce((total, layer) => total + layer.decorations.length, 0)} decorations
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-5">
                        <div className="text-clay-500">
                          {formatDate(tile.createdAt)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 sm:px-6 text-clay-500">
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
