'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function getUserProfileById(id: string) {
  const session = await getServerSession(authOptions)
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      imageUrl: true,
      isPublic: true,
      testTiles: {
        select: {
          id: true,
          name: true,
          createdAt: true,
          clayBody: {
            select: {
              id: true,
              name: true,
            }
          },
          decorationLayers: {
            select: {
              decorations: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      }
    }
  })

  if (!user) {
    redirect('/404')
  }

  if (user?.isPublic) {
    console.log('Public user:', user)
    return user
  } else {
    if (!session?.user?.id) {
      redirect('/login')
    } else if (session?.user.id === user.id) {
      return user
    } else {
      redirect('/dashboard')
    }
  }
}
