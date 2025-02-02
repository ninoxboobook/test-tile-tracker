'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notFound } from 'next/navigation'

export async function getUserProfileById(id: string) {
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
    return notFound()
  }

  return user
}
