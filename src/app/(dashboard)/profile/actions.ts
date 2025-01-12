'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { deleteBlob } from '@/lib/blob'

export async function getUserProfile() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      imageUrl: true,
      isPublic: true,
    },
  })

  return user
}

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  const email = formData.get('email') as string
  const username = formData.get('username') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string
  const imageUrl = formData.get('imageUrl') as string
  const isPublicRaw = formData.get('isPublic')
  console.log('Raw isPublic value:', isPublicRaw)
  const isPublic = isPublicRaw === 'true'
  console.log('Processed isPublic value:', isPublic)

  const updateData: any = {
    email,
    username,
    firstName: firstName || null,
    lastName: lastName || null,
    imageUrl: imageUrl || null,
    isPublic,
  }

  if (currentPassword && newPassword) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      throw new Error('Current password is incorrect')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    updateData.password = hashedPassword
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
  })

  revalidatePath('/profile')
  revalidatePath(`/profile/${session.user.id}`)
}

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

export async function deleteAccount() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  // Get all image URLs before deleting the content
  const imageUrls = await getImageUrlsForUser(session.user.id)

  // Delete all related records in the correct order
  await prisma.$transaction(async (tx) => {
    // First, delete all test tiles as they might have decoration layers
    await tx.testTile.deleteMany({
      where: { userId: session.user.id! },
    })

    // Delete collections
    await tx.collection.deleteMany({
      where: { userId: session.user.id! },
    })

    // Delete decorations
    await tx.decoration.deleteMany({
      where: { userId: session.user.id! },
    })

    // Delete clay bodies
    await tx.clayBody.deleteMany({
      where: { userId: session.user.id! },
    })

    // Finally, delete the user
    await tx.user.delete({
      where: { id: session.user.id! },
    })
  })

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
  
  revalidatePath('/')
}
