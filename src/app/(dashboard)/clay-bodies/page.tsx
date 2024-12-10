import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ClayBodiesContent } from './content'

export default async function ClayBodiesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const clayBodies = await prisma.clayBody.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      type: true,
      cone: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return <ClayBodiesContent clayBodies={clayBodies} />
}
