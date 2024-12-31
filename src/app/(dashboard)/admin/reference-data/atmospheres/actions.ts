'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateAtmosphere(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id')
  if (!id || typeof id !== 'string') {
    throw new Error('Atmosphere ID is required')
  }

  const name = formData.get('name')
  if (!name || typeof name !== 'string') {
    throw new Error('Name is required')
  }

  await prisma.atmosphere.update({
    where: { id },
    data: { name }
  })

  revalidatePath('/admin/reference-data/atmospheres')
  redirect('/admin/reference-data/atmospheres')
}

export async function deleteAtmosphere(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id')
  if (!id || typeof id !== 'string') {
    throw new Error('Atmosphere ID is required')
  }

  // Check if the atmosphere is being used
  const atmosphere = await prisma.atmosphere.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          testTiles: true
        }
      }
    }
  })

  if (!atmosphere) {
    throw new Error('Atmosphere not found')
  }

  if (atmosphere._count.testTiles > 0) {
    throw new Error('Cannot delete atmosphere that is being used by test tiles')
  }

  await prisma.atmosphere.delete({
    where: { id }
  })

  revalidatePath('/admin/reference-data/atmospheres')
}

export async function createAtmosphere(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name')
  if (!name || typeof name !== 'string') {
    throw new Error('Name is required')
  }

  await prisma.atmosphere.create({
    data: { name }
  })

  revalidatePath('/admin/reference-data/atmospheres')
  redirect('/admin/reference-data/atmospheres')
}
