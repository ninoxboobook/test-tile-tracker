'use server'

import { getSessionWithAuth } from '@/lib/auth/admin'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { deleteBlob } from '@/lib/blob'

async function getImageUrlsForUser(userId: string) {
  const [user, testTiles, clayBodies, decorations] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { imageUrl: true }
    }),
    prisma.testTile.findMany({
      where: { userId },
      select: { imageUrl: true }
    }),
    prisma.clayBody.findMany({
      where: { userId },
      select: { imageUrl: true }
    }),
    prisma.decoration.findMany({
      where: { userId },
      select: { imageUrl: true }
    })
  ])

  const imageUrls: string[] = []
  
  if (user?.imageUrl) imageUrls.push(user.imageUrl)
  testTiles.forEach(t => t.imageUrl && imageUrls.push(...t.imageUrl))
  clayBodies.forEach(c => c.imageUrl && imageUrls.push(...c.imageUrl))
  decorations.forEach(d => d.imageUrl && imageUrls.push(...d.imageUrl))

  return imageUrls
}

export async function updateUserRole(userId: string, role: 'USER' | 'ADMIN') {
  const { isAdmin } = await getSessionWithAuth()
  if (!isAdmin) throw new Error('Unauthorized')

  await prisma.user.update({
    where: { id: userId },
    data: { role }
  })

  revalidatePath('/admin/users')
}

export async function deleteUser(userId: string) {
  const { isAdmin } = await getSessionWithAuth()
  if (!isAdmin) throw new Error('Unauthorized')

  // Get all image URLs before deleting the user and their content
  const imageUrls = await getImageUrlsForUser(userId)

  // Delete all user content
  await prisma.$transaction([
    prisma.testTile.deleteMany({ where: { userId } }),
    prisma.decoration.deleteMany({ where: { userId } }),
    prisma.clayBody.deleteMany({ where: { userId } }),
    prisma.collection.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } })
  ])

  // Delete all associated images from blob storage
  await Promise.all(
    imageUrls.map(async (url) => {
      try {
        await deleteBlob(url)
      } catch (error) {
        console.error('Failed to delete blob:', url, error)
      }
    })
  )

  revalidatePath('/admin/users')
}
