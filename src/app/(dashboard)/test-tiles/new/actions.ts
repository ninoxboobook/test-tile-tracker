'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { testTileSchema } from '@/lib/schemas/test-tile'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function createTestTile(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const rawData = Object.fromEntries(formData.entries())
  const validatedData = testTileSchema.parse(rawData)

  const createData: Prisma.TestTileCreateInput = {
    name: validatedData.name,
    stamp: validatedData.stamp || null,
    notes: validatedData.notes || null,
    imageUrl: validatedData.imageUrl || null,
    user: {
      connect: {
        id: session.user.id
      }
    },
    clayBody: {
      connect: {
        id: validatedData.clayBodyId
      }
    },
    decorations: validatedData.decorationIds?.length ? {
      connect: validatedData.decorationIds.map(id => ({ id }))
    } : undefined,
    collections: validatedData.collectionIds?.length ? {
      connect: validatedData.collectionIds.map(id => ({ id }))
    } : undefined
  }

  const testTile = await prisma.testTile.create({
    data: createData
  })

  revalidatePath('/test-tiles')
  redirect(`/test-tiles/${testTile.id}`)
} 