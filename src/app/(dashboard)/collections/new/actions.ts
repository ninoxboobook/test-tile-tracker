'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { collectionSchema } from '@/lib/schemas/collection'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function createCollection(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const rawData = {
    ...Object.fromEntries(formData.entries()),
    testTileIds: formData.getAll('testTileIds')
  }

  const validatedData = collectionSchema.parse(rawData)

  const createData: Prisma.CollectionCreateInput = {
    name: validatedData.name,
    description: validatedData.description || null,
    user: {
      connect: {
        id: session.user.id
      }
    },
    testTiles: validatedData.testTileIds?.length ? {
      connect: validatedData.testTileIds.map(id => ({ id }))
    } : undefined
  }

  const collection = await prisma.collection.create({
    data: createData
  })

  console.log('Raw form data:', Object.fromEntries(formData.entries()))
  console.log('All entries:', Array.from(formData.entries()))
  
  revalidatePath('/collections')
  redirect(`/collections/${collection.id}`)
} 