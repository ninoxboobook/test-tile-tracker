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

  const rawData = Object.fromEntries(formData.entries())
  const validatedData = collectionSchema.parse(rawData)

  const createData: Prisma.CollectionCreateInput = {
    name: validatedData.name,
    description: validatedData.description || null,
    createdAt: new Date(),
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