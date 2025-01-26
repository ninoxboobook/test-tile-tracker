import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { FormLayout } from '@/components/ui/layout/form-layout'
import Link from 'next/link'
import Image from 'next/image'
import { isAdmin } from '@/lib/auth/admin'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { TestTilesGrid, CollectionsGrid, DecorationsGrid, ClayBodiesGrid } from '@/components/profile/profile-grids'

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatUrl(url: string): string {
  if (!url) return url;
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
}

interface ProfilePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProfilePage(props: ProfilePageProps) {
  const params = await props.params;
  const session = await getServerSession(authOptions)
  const userIsAdmin = session?.user?.id ? await isAdmin() : false

  const user = await prisma.user.findFirst({
    where: {
      id: params.id,
      OR: userIsAdmin ? undefined : [
        { id: session?.user?.id },
        { isPublic: true }
      ]
    },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      imageUrl: true,
      isPublic: true,
      socials: true,
      testTiles: {
        where: {
          isPublic: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          imageUrl: true,
          atmosphere: {
            select: {
              name: true
            }
          },
          cone: {
            select: {
              name: true
            }
          },
          clayBody: {
            select: {
              name: true
            }
          },
          decorationLayers: {
            orderBy: {
              order: 'asc'
            },
            select: {
              order: true,
              decorations: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      },
      collections: {
        where: {
          isPublic: true
        },
        select: {
          id: true,
          name: true,
          description: true,
          testTiles: {
            select: {
              id: true,
              imageUrl: true
            }
          }
        }
      },
      decorations: {
        where: {
          isPublic: true
        },
        select: {
          id: true,
          name: true,
          imageUrl: true,
          source: true,
          manufacturer: true,
          type: {
            select: {
              name: true
            }
          },
          cone: {
            select: {
              name: true
            }
          },
          atmosphere: {
            select: {
              name: true
            }
          }
        }
      },
      clayBodies: {
        where: {
          isPublic: true
        },
        select: {
          id: true,
          name: true,
          imageUrl: true,
          manufacturer: true,
          type: {
            select: {
              name: true
            }
          },
          cone: {
            select: {
              name: true
            }
          }
        }
      }
    }
  })

  if (!user) {
    return notFound()
  }

  return (
    <FormLayout
      title={`${user.username}'s Profile`}
      description="View user profile and recent test tiles"
      backHref="/dashboard"
    >
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-4">
          <div className="bg-sand-light rounded-2xl p-8">
            <div className="flex flex-col items-center space-y-6">
              {user.imageUrl ? (
                <div className="relative h-40 w-40 overflow-hidden rounded-full ring-2 ring-brand ring-offset-2">
                  <Image
                    src={user.imageUrl}
                    alt={`${user.username}'s profile picture`}
                    height={160}
                    width={160}
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
              {user.socials && (
                <div className="flex items-center gap-4 mt-4">
                  {(() => {
                    try {
                      const socials = JSON.parse(user.socials);
                      return (
                        <>
                          {socials.instagram && (
                            <Link
                              href={formatUrl(socials.instagram)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-clay-600 hover:text-clay-800 flex items-center gap-2"
                            >
                              <div className="h-8 w-8 bg-clay-100 rounded-full flex items-center justify-center">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                              </div>
                              <span className="font-medium text-brand">Instagram</span>
                            </Link>
                          )}
                          {socials.website && (
                            <Link
                              href={formatUrl(socials.website)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-clay-600 hover:text-clay-800 flex items-center gap-2"
                            >
                              <div className="h-8 w-8 bg-clay-100 rounded-full flex items-center justify-center">
                                <GlobeAltIcon className="h-6 w-6" />
                              </div>
                              <span className="font-medium text-brand">Website</span>
                            </Link>
                          )}
                        </>
                      );
                    } catch (error) {
                      console.error('Error parsing socials:', error);
                      return null;
                    }
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-8 space-y-8">
          <div className="bg-sand-light rounded-2xl">
            <div className="p-8">
              <h3 className="text-2xl font-semibold text-clay-800">Recent activity</h3>
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
        <div className="col-span-12 space-y-8">
          {user.testTiles.length > 0 && (
            <div className="bg-sand-light rounded-2xl">
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-clay-800">Test tiles</h3>
                <p className="mt-2 text-clay-600">{user?.username}'s public test tiles</p>
              </div>
              <div className="border-t border-clay-200 p-8">
                <TestTilesGrid testTiles={user.testTiles} />
              </div>
            </div>
          )}

          {user.collections.length > 0 && (
            <div className="bg-sand-light rounded-2xl">
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-clay-800">Collections</h3>
                <p className="mt-2 text-clay-600">{user?.username}'s public collections</p>
              </div>
              <div className="border-t border-clay-200 p-8">
                <CollectionsGrid collections={user.collections} />
              </div>
            </div>
          )}

          {user.decorations.length > 0 && (
            <div className="bg-sand-light rounded-2xl">
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-clay-800">Decorations</h3>
                <p className="mt-2 text-clay-600">{user?.username}'s public decorations</p>
              </div>
              <div className="border-t border-clay-200 p-8">
                <DecorationsGrid decorations={user.decorations} />
              </div>
            </div>
          )}

          {user.clayBodies.length > 0 && (
            <div className="bg-sand-light rounded-2xl">
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-clay-800">Clay bodies</h3>
                <p className="mt-2 text-clay-600">{user?.username}'s public clay bodies</p>
              </div>
              <div className="border-t border-clay-200 p-8">
                <ClayBodiesGrid clayBodies={user.clayBodies} />
              </div>
            </div>
          )}
        </div>
      </div>
    </FormLayout>
  )
}
