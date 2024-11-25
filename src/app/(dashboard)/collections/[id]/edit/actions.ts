'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { collectionSchema } from '@/lib/schemas/collection'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function updateCollection(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

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

  revalidatePath('/collection')
  revalidatePath(`/collection/${id}`)
  redirect(`/collection/${id}`)
} 