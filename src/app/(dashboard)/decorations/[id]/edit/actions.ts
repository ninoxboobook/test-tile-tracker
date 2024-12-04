'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { decorationSchema } from '@/lib/schemas/decoration'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function updateDecoration(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id')
  if (!id || typeof id !== 'string') {
    throw new Error('Decoration ID is required')
  }

  const rawData = Object.fromEntries(formData.entries())
  
  // Handle array fields from FormData
  const coneIds = formData.getAll('coneIds[]').map(id => id.toString())
  const atmosphereIds = formData.getAll('atmosphereIds[]').map(id => id.toString())
  
  const validatedData = decorationSchema.parse({
    ...rawData,
    coneIds,
    atmosphereIds
  })

  const updateData: Prisma.DecorationUpdateInput = {
    name: validatedData.name,
    type: {
      connect: { id: validatedData.typeId }
    },
    source: validatedData.source || null,
    manufacturer: validatedData.manufacturer || null,
    cone: {
      set: [], // Clear existing relationships
      connect: validatedData.coneIds?.map(id => ({ id })) ?? []
    },
    atmosphere: {
      set: [], // Clear existing relationships
      connect: validatedData.atmosphereIds?.map(id => ({ id })) ?? []
    },
    colour: validatedData.colour || null,
    surface: validatedData.surface || null,
    transparency: validatedData.transparency || null,
    glazyUrl: validatedData.glazyUrl || null,
    imageUrl: validatedData.imageUrl || null,
    recipe: validatedData.recipe || null,
    notes: validatedData.notes || null,
  }

  await prisma.decoration.update({
    where: {
      id,
      userId: session.user.id
    },
    data: updateData
  })

  revalidatePath('/decorations')
  redirect(`/decorations/${id}`)
}

export async function getDecoration(id: string, userId: string) {
  return prisma.decoration.findUnique({
    where: {
      id,
      userId
    },
    include: {
      type: true,
      cone: true,
      atmosphere: true
    }
  })
}

export async function getDecorationTypes() {
  return prisma.decorationType.findMany({
    orderBy: {
      name: 'asc'
    }
  })
}

export async function getCones() {
  return prisma.cone.findMany({
    orderBy: {
      name: 'asc'
    }
  })
}

export async function getAtmospheres() {
  return prisma.atmosphere.findMany({
    orderBy: {
      name: 'asc'
    }
  })
}