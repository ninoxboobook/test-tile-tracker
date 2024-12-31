'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { collectionSchema } from '@/lib/schemas/collection'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { getSessionWithAuth } from '@/lib/auth/admin'

async function validateSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function getCollection(id: string) {
  const { session, isAdmin } = await getSessionWithAuth()

  const collection = await prisma.collection.findUnique({
    where: {
      id,
      ...(isAdmin ? {} : { userId: session.user.id })
    },
    include: {
      testTiles: {
        include: {
          clayBody: true,
          cone: true,
          atmosphere: true,
          decorationLayers: {
            include: {
              decorations: true
            }
          }
        }
      }
    }
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
  const { session, isAdmin } = await getSessionWithAuth()

  const id = formData.get('id')
  if (!id || typeof id !== 'string') {
    throw new Error('Collection ID is required')
  }

  const rawData = Object.fromEntries(formData.entries())
  const processedData = {
    ...rawData,
    testTileIds: formData.getAll('testTileIds')
  }
  
  const validatedData = collectionSchema.parse(processedData)

  const updateData: Prisma.CollectionUpdateInput = {
    name: validatedData.name,
    description: validatedData.description || null,
    testTiles: {
      set: validatedData.testTileIds?.map(id => ({ id })) ?? []
    }
  }

  await prisma.collection.update({
    where: {
      id,
      ...(isAdmin ? {} : { userId: session.user.id })
    },
    data: updateData,
  })

  revalidatePath('/collections')
  revalidatePath('/admin/content/collections')
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