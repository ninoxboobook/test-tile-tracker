import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { ClayBodiesTable } from '@/components/clay-bodies/clay-bodies-table'
import Link from 'next/link'

export default async function ClayBodiesPage() {
  const session = await getServerSession(authOptions) as Session

  if (!session?.user?.id) {
    redirect('/login')
  }

  const clayBodies = await prisma.clayBodies.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Clay Bodies</h1>
          <Link
            href="/clay-bodies/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-clay-600 hover:bg-clay-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clay-500"
          >
            Add New Clay Body
          </Link>
        </div>

        <div className="mt-8">
          <ClayBodiesTable clayBodies={clayBodies} />
        </div>
      </div>
    </div>
  )
}
