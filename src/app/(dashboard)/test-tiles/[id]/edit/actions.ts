'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { testTileSchema } from '@/lib/schemas/test-tile'
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

export async function getTestTile(id: string) {
  const { session, isAdmin } = await getSessionWithAuth()

  const testTile = await prisma.testTile.findUnique({
    where: {
      id,
      ...(isAdmin ? {} : { userId: session.user.id })
    },
    include: {
      clayBody: true,
      cone: true,
      atmosphere: true,
      decorationLayers: {
        include: {
          decorations: true
        },
        orderBy: {
          order: 'asc'
        }
      },
      collections: true,
      user: isAdmin ? {
        select: {
          username: true,
          email: true
        }
      } : false
    }
  })

  if (!testTile) {
    throw new Error('Test tile not found')
  }

  return testTile
}

export async function updateTestTile(formData: FormData) {
  const { session, isAdmin } = await getSessionWithAuth()

  const id = formData.get('id')
  if (!id || typeof id !== 'string') {
    throw new Error('Test tile ID is required')
  }

  // Extract decoration layers data
  const decorationLayers: Array<{ order: number; decorationIds: string[] }> = []
  const entries = Array.from(formData.entries())
  
  entries.forEach(([key, value]) => {
    if (key.startsWith('decorationLayers[')) {
      const matches = key.match(/decorationLayers\[(\d+)\]\[(\w+)\](?:\[\])?/)
      if (matches) {
        const [, indexStr, field] = matches
        const index = parseInt(indexStr)
        
        if (!decorationLayers[index]) {
          decorationLayers[index] = { order: index + 1, decorationIds: [] }
        }
        
        if (field === 'order') {
          decorationLayers[index].order = parseInt(value as string)
        } else if (field === 'decorationIds') {
          if (!decorationLayers[index].decorationIds.includes(value as string)) {
            decorationLayers[index].decorationIds.push(value as string)
          }
        }
      }
    }
  })

  const processedData = {
    ...Object.fromEntries(formData.entries()),
    decorationLayers: decorationLayers.filter(layer => layer.decorationIds.length > 0),
    collectionIds: formData.getAll('collectionIds'),
    imageUrl: formData.getAll('imageUrl').filter(url => typeof url === 'string')
  }

  const validatedData = testTileSchema.parse(processedData)

  const updateData: Prisma.TestTileUpdateInput = {
    name: validatedData.name,
    stamp: validatedData.stamp || null,
    notes: validatedData.notes || null,
    imageUrl: validatedData.imageUrl || [],
    clayBody: {
      connect: { id: validatedData.clayBodyId }
    },
    cone: validatedData.coneId ? { connect: { id: validatedData.coneId } } : undefined,
    atmosphere: {
      connect: { id: validatedData.atmosphereId }
    },
    decorationLayers: {
      deleteMany: {},
      create: validatedData.decorationLayers.map(layer => ({
        order: layer.order,
        decorations: {
          connect: layer.decorationIds.map(id => ({ id }))
        }
      }))
    },
    collections: {
      set: validatedData.collectionIds?.map(id => ({ id })) ?? []
    }
  }

  await prisma.testTile.update({
    where: {
      id,
      ...(isAdmin ? {} : { userId: session.user.id })
    },
    data: updateData,
    include: {
      clayBody: true,
      decorationLayers: {
        include: {
          decorations: true
        }
      },
      collections: true,
      cone: true,
      atmosphere: true,
    }
  })

  revalidatePath('/test-tiles')
  revalidatePath('/admin/content/test-tiles')
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