'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { collectionSchema } from '@/lib/schemas/collection'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

async function validateSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function getCollection(id: string) {
  const session = await validateSession()

  const collection = await prisma.collection.findUnique({
    where: { 
      id,
      userId: session.user.id 
    },
  })

  if (!collection) {
    throw new Error('Collection not found')
  }

  return collection
}

export async function createCollection(formData: FormData) {
  const session = await validateSession()

  const rawData = Object.fromEntries(formData.entries())
  const validatedData = collectionSchema.parse(rawData)

  const createData: Prisma.CollectionCreateInput = {
    name: validatedData.name,
    description: validatedData.description || null,
    user: {
      connect: {
        id: session.user.id
      }
    }
  }

  const collection = await prisma.collection.create({
    data: createData
  })

  revalidatePath('/collections')
  redirect(`/collections/${collection.id}`)
}

export async function updateCollection(formData: FormData) {
  const session = await validateSession()

  const id = formData.get('id') as string
  const rawData = Object.fromEntries(formData.entries())
  const validatedData = collectionSchema.parse(rawData)

  const updateData: Prisma.CollectionUpdateInput = {
    name: validatedData.name,
    description: validatedData.description || null,
  }

  await prisma.collection.update({
    where: {
      id,
      userId: session.user.id,
    },
    data: updateData,
  })

  revalidatePath('/collections')
  revalidatePath(`/collections/${id}`)
  redirect(`/collections/${id}`)
}

export async function deleteCollection(id: string) {
  const session = await validateSession()

  await prisma.collection.delete({
    where: {
      id,
      userId: session.user.id,
    },
  })

  revalidatePath('/collections')
  redirect('/collections')
} 