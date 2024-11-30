import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { CollectionsContent } from './content'

export default async function CollectionsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const collections = await prisma.collection.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      testTiles: {
        select: {
          id: true,
          imageUrl: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return <CollectionsContent collections={collections} />
}
