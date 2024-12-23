'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function getUserProfileById(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      imageUrl: true,
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

  return user
}
