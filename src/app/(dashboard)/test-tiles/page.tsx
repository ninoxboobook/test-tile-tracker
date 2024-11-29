import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { TestTilesContent } from './content'

export default async function TestTilesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const testTiles = await prisma.testTile.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      clayBody: true,
      collections: true,
      decorations: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return <TestTilesContent testTiles={testTiles} />
}
