import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/ui/layout/page-layout'
import Link from 'next/link'

async function getTestTiles() {
  const testTiles = await prisma.testTile.findMany({
    include: {
      user: {
        select: {
          username: true,
          email: true
        }
      },
      clayBody: {
        select: {
          name: true
        }
      },
      decoration: {
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
      },
      _count: {
        select: {
          images: true,
          collections: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return testTiles
}

export default async function TestTilesPage() {
  const testTiles = await getTestTiles()

  return (
    <PageLayout title="Test Tiles">
      <div className="space-y-6">
        <div className="bg-white shadow-sm ring-1 ring-clay-900/5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-clay-300">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-clay-900 sm:pl-6">
                  Clay Body
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-clay-900">
                  Decoration
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-clay-900">
                  Firing
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-clay-900">
                  Created By
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-clay-900">
                  Images
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-clay-900">
                  Collections
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clay-200">
              {testTiles.map((testTile) => (
                <tr key={testTile.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-clay-900 sm:pl-6">
                    {testTile.clayBody.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-clay-500">
                    {testTile.decoration.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-clay-500">
                    {testTile.cone.name}, {testTile.atmosphere.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-clay-500">
                    {testTile.user.username || testTile.user.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-clay-500">
                    {testTile._count.images}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-clay-500">
                    {testTile._count.collections}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link
                      href={`/test-tiles/${testTile.id}`}
                      className="text-brand hover:text-brand/80"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  )
}
