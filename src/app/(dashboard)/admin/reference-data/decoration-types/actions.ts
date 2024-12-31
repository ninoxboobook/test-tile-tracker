'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateDecorationType(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id')
  if (!id || typeof id !== 'string') {
    throw new Error('Decoration type ID is required')
  }

  const name = formData.get('name')
  if (!name || typeof name !== 'string') {
    throw new Error('Name is required')
  }

  await prisma.decorationType.update({
    where: { id },
    data: { name }
  })

  revalidatePath('/admin/reference-data/decoration-types')
  redirect('/admin/reference-data/decoration-types')
}

export async function deleteDecorationType(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id')
  if (!id || typeof id !== 'string') {
    throw new Error('Decoration type ID is required')
  }

  // Check if the decoration type is being used
  const decorationType = await prisma.decorationType.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          decorations: true
        }
      }
    }
  })

  if (!decorationType) {
    throw new Error('Decoration type not found')
  }

  if (decorationType._count.decorations > 0) {
    throw new Error('Cannot delete decoration type that is being used by decorations')
  }

  await prisma.decorationType.delete({
    where: { id }
  })

  revalidatePath('/admin/reference-data/decoration-types')
}

export async function createDecorationType(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name')
  if (!name || typeof name !== 'string') {
    throw new Error('Name is required')
  }

  await prisma.decorationType.create({
    data: { name }
  })

  revalidatePath('/admin/reference-data/decoration-types')
  redirect('/admin/reference-data/decoration-types')
}
