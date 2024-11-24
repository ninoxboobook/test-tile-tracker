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

  const createData: Prisma.TestTilesCreateInput = {
    name: validatedData.name,
    description: validatedData.description || null,
    created_at: new Date(),
    user: {
      connect: {
        id: session.user.id
      }
    },
    clay_body: {
      connect: {
        id: validatedData.clay_body_id
      }
    },
    decoration: validatedData.decoration_id ? {
      connect: {
        id: validatedData.decoration_id
      }
    } : undefined,
    test_series: validatedData.test_series_id ? {
      connect: {
        id: validatedData.test_series_id
      }
    } : undefined
  }

  const testTile = await prisma.testTiles.create({
    data: createData
  })

  revalidatePath('/test-tiles')
  redirect(`/test-tiles/${testTile.id}`)
} 