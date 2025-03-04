'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { decorationSchema } from '@/lib/schemas/decoration'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { getSessionWithAuth } from '@/lib/auth/admin'

export async function updateDecoration(formData: FormData) {
  const { session, isAdmin } = await getSessionWithAuth()

  if (!isAdmin && !session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id')
  if (!id || typeof id !== 'string') {
    throw new Error('Decoration ID is required')
  }

  // Log raw FormData entries
  console.log('Raw FormData entries:', Array.from(formData.entries()))

  // Convert FormData to object while preserving arrays
  const entries = Array.from(formData.entries());
  const rawData = entries.reduce((acc, [key, value]) => {
    if (key === 'coneIds') {
      if (!acc[key]) {
        const values = formData.getAll(key);
        acc[key] = values.map(v => typeof v === 'string' ? v : '');
      }
    } else if (key === 'atmosphereIds') {
      if (!acc[key]) {
        const values = formData.getAll(key);
        acc[key] = values.map(v => typeof v === 'string' ? v : '');
      }
    } else if (key === 'imageUrl') {
      // Handle imageUrl as array directly
      const values = formData.getAll(key);
      acc[key] = values.filter(v => typeof v === 'string');
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  // Log the processed rawData
  console.log('Processed rawData:', rawData)

  const validatedData = decorationSchema.parse({
    ...rawData,
    isPublic: formData.get('isPublic') === 'true'
  })

  // Log the validated data
  console.log('Validated data:', validatedData)

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
    imageUrl: validatedData.imageUrl || [],
    recipe: validatedData.recipe || null,
    notes: validatedData.notes || null,
    isPublic: validatedData.isPublic
  }

  // Log the update data being sent to the database
 console.log('Update data:', updateData)

  await prisma.decoration.update({
    where: {
      id,
      ...(isAdmin ? {} : { userId: session.user.id })
    },
    data: updateData
  })

  revalidatePath('/decorations')
  revalidatePath('/admin/content/decorations')
  redirect(`/decorations/${id}`)
}

export async function getDecoration(id: string, userId?: string) {
  const { isAdmin } = await getSessionWithAuth()

  return prisma.decoration.findUnique({
    where: {
      id,
      ...(isAdmin ? {} : { userId: userId! })
    },
    include: {
      type: true,
      cone: true,
      atmosphere: true,
      user: {
        select: {
          username: true,
          email: true
        }
      }
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