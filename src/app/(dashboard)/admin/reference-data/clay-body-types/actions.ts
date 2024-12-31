'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateClayBodyType(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id')
  if (!id || typeof id !== 'string') {
    throw new Error('Clay body type ID is required')
  }

  const name = formData.get('name')
  if (!name || typeof name !== 'string') {
    throw new Error('Name is required')
  }

  await prisma.clayBodyType.update({
    where: { id },
    data: { name }
  })

  revalidatePath('/admin/reference-data/clay-body-types')
  redirect('/admin/reference-data/clay-body-types')
}

export async function deleteClayBodyType(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  // Check if the clay body type is being used
  const clayBodyType = await prisma.clayBodyType.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          clayBodies: true
        }
      }
    }
  })

  if (!clayBodyType) {
    throw new Error('Clay body type not found')
  }

  if (clayBodyType._count.clayBodies > 0) {
    throw new Error('Cannot delete clay body type that is being used by clay bodies')
  }

  await prisma.clayBodyType.delete({
    where: { id }
  })

  revalidatePath('/admin/reference-data/clay-body-types')
  redirect('/admin/reference-data/clay-body-types')
}

export async function createClayBodyType(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name')
  if (!name || typeof name !== 'string') {
    throw new Error('Name is required')
  }

  await prisma.clayBodyType.create({
    data: { name }
  })

  revalidatePath('/admin/reference-data/clay-body-types')
  redirect('/admin/reference-data/clay-body-types')
}
