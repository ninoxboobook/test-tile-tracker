'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { testTileSchema } from '@/lib/schemas/test-tile'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function updateTestTile(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const id = formData.get('id') as string
  const rawData = Object.fromEntries(formData.entries())
  const validatedData = testTileSchema.parse(rawData)

  const updateData: Prisma.TestTilesUpdateInput = {
    name: validatedData.name,
    description: validatedData.description || null,
    clay_body: {
      connect: { id: validatedData.clay_body_id }
    },
    decoration: validatedData.decoration_id ? {
      connect: { id: validatedData.decoration_id }
    } : {
      disconnect: true
    },
    test_series: validatedData.test_series_id ? {
      connect: { id: validatedData.test_series_id }
    } : {
      disconnect: true
    }
  }

  await prisma.testTiles.update({
    where: {
      id,
      user_id: session.user.id,
    },
    data: updateData
  })

  revalidatePath('/test-tiles')
  revalidatePath(`/test-tiles/${id}`)
  redirect(`/test-tiles/${id}`)
} 