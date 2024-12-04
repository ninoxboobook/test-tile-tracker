import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { DecorationsContent } from './content'

export default async function DecorationsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const decorations = await prisma.decoration.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      type: true,
      cone: true,
      atmosphere: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return <DecorationsContent decorations={decorations} />
}
