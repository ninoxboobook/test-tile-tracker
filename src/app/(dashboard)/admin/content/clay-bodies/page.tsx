import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/ui/layout/page-layout'
import Link from 'next/link'

async function getClayBodies() {
  const clayBodies = await prisma.clayBody.findMany({
    include: {
      user: {
        select: {
          username: true,
          email: true
        }
      },
      type: true,
      _count: {
        select: {
          testTiles: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return clayBodies
}

export default async function ClayBodiesPage() {
  const clayBodies = await getClayBodies()

  return (
    <PageLayout title="Clay Bodies">
      <div className="space-y-6">
        <div className="bg-white shadow-sm ring-1 ring-clay-900/5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-clay-300">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-clay-900 sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-clay-900">
                  Type
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-clay-900">
                  Created By
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-clay-900">
                  Test Tiles
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-clay-900">
                  Created
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clay-200">
              {clayBodies.map((clayBody) => (
                <tr key={clayBody.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-clay-900 sm:pl-6">
                    {clayBody.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-clay-500">
                    {clayBody.type.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-clay-500">
                    {clayBody.user.username || clayBody.user.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-clay-500">
                    {clayBody._count.testTiles}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-clay-500">
                    {new Date(clayBody.createdAt).toLocaleDateString()}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link
                      href={`/clay-bodies/${clayBody.id}`}
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
