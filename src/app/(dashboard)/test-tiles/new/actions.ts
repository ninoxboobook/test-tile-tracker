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
    createdAt: new Date(),
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
    decorations: validatedData.decorationIds ? {
      connect: {
        id: validatedData.decorationIds[0]
      }
    } : undefined,
    collections: validatedData.collectionIds ? {
      connect: {
        id: validatedData.collectionIds[0]
      }
    } : undefined
  }

  const testTile = await prisma.testTile.create({
    data: createData
  })

  revalidatePath('/test-tiles')
  redirect(`/test-tiles/${testTile.id}`)
} 