'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateCone(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id')
  if (!id || typeof id !== 'string') {
    throw new Error('Cone ID is required')
  }

  const name = formData.get('name')
  if (!name || typeof name !== 'string') {
    throw new Error('Name is required')
  }

  await prisma.cone.update({
    where: { id },
    data: { name }
  })

  revalidatePath('/admin/reference-data/cones')
  redirect('/admin/reference-data/cones')
}

export async function deleteCone(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id')
  if (!id || typeof id !== 'string') {
    throw new Error('Cone ID is required')
  }

  // Check if the cone is being used
  const cone = await prisma.cone.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          clayBodies: true,
          testTiles: true
        }
      }
    }
  })

  if (!cone) {
    throw new Error('Cone not found')
  }

  if (cone._count.clayBodies > 0 || cone._count.testTiles > 0) {
    throw new Error('Cannot delete cone that is being used by clay bodies or test tiles')
  }

  await prisma.cone.delete({
    where: { id }
  })

  revalidatePath('/admin/reference-data/cones')
}

export async function createCone(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name')
  if (!name || typeof name !== 'string') {
    throw new Error('Name is required')
  }

  await prisma.cone.create({
    data: { name }
  })

  revalidatePath('/admin/reference-data/cones')
  redirect('/admin/reference-data/cones')
}
