'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { testTileSchema } from '@/lib/schemas/test-tile'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function createTestTile(formData: FormData) {
  console.log('Raw form data:', Object.fromEntries(formData.entries()))
  console.log('All entries:', Array.from(formData.entries()))
  
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Process the form data
  const rawData = Object.fromEntries(formData.entries())
  
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
    ...rawData,
    decorationLayers: decorationLayers.filter(layer => layer.decorationIds.length > 0),
    collectionIds: formData.getAll('collectionIds'),
  }

  console.log('Processed data:', processedData)

  const validatedData = testTileSchema.parse(processedData)

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
    decorationLayers: {
      create: validatedData.decorationLayers.map(layer => ({
        order: layer.order,
        decorations: {
          connect: layer.decorationIds.map(id => ({ id }))
        }
      }))
    },
    collections: validatedData.collectionIds?.length ? {
      connect: validatedData.collectionIds.map(id => ({ id }))
    } : undefined
  }

  const testTile = await prisma.testTile.create({
    data: createData,
    include: {
      decorationLayers: {
        include: {
          decorations: true
        }
      }
    }
  })

  revalidatePath('/test-tiles')
  redirect(`/test-tiles/${testTile.id}`)
} 