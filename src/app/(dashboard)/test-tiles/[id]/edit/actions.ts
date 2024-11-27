'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { testTileSchema } from '@/lib/schemas/test-tile'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

async function validateSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function getTestTile(id: string) {
  const session = await validateSession()

  const testTile = await prisma.testTile.findUnique({
    where: { 
      id,
      userId: session.user.id 
    },
    include: {
      decorations: true,
      collections: true,
      clayBody: true,
    }
  })

  if (!testTile) {
    throw new Error('Test tile not found')
  }

  return testTile
}

export async function updateTestTile(formData: FormData) {
  const session = await validateSession()

  const id = formData.get('id') as string
  const rawData = Object.fromEntries(formData.entries())
  const validatedData = testTileSchema.parse(rawData)

  const updateData: Prisma.TestTileUpdateInput = {
    name: validatedData.name,
    stamp: validatedData.stamp || null,
    notes: validatedData.notes || null,
    imageUrl: validatedData.imageUrl || null,
    clayBody: {
      connect: { id: validatedData.clayBodyId }
    },
    decorations: validatedData.decorationIds?.length ? {
      set: validatedData.decorationIds.map(id => ({ id }))
    } : undefined,
    collections: validatedData.collectionIds?.length ? {
      set: validatedData.collectionIds.map(id => ({ id }))
    } : undefined,
  }

  await prisma.testTile.update({
    where: {
      id,
      userId: session.user.id,
    },
    data: updateData
  })

  revalidatePath('/test-tiles')
  revalidatePath(`/test-tiles/${id}`)
  redirect(`/test-tiles/${id}`)
}

export async function deleteTestTile(id: string) {
  const session = await validateSession()

  await prisma.testTile.delete({
    where: {
      id,
      userId: session.user.id,
    },
  })

  revalidatePath('/test-tiles')
  redirect('/test-tiles')
} 