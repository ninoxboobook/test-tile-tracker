import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { DecorationsContent } from './content'
import { type DecorationWithRelations } from '@/lib/schemas/decoration'

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
      atmosphere: true,
      decorationLayers: {
        include: {
          testTile: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const decorationsWithRelations: DecorationWithRelations[] = decorations.map(decoration => ({
    ...decoration,
    createdAt: decoration.createdAt,
    updatedAt: decoration.updatedAt,
    decorationLayers: decoration.decorationLayers.map(layer => ({
      id: layer.id,
      testTile: layer.testTile ? {
        id: layer.testTile.id,
        name: layer.testTile.name
      } : null
    }))
  }))

  return <DecorationsContent decorations={decorationsWithRelations} />
}
