'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { clayBodySchema } from '@/lib/schemas/clay-body'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function updateClayBody(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id')
  if (!id || typeof id !== 'string') {
    throw new Error('Clay body ID is required')
  }

  // Convert FormData to object while preserving arrays
  const entries = Array.from(formData.entries());
  const rawData = entries.reduce((acc, [key, value]) => {
    if (key === 'cone') {
      if (!acc[key]) {
        acc[key] = formData.getAll(key);
      }
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  // Convert string numbers to actual numbers before validation
  const processedData = {
    ...rawData,
    shrinkage: rawData.shrinkage ? parseFloat(rawData.shrinkage as string) : null,
    absorption: rawData.absorption ? parseFloat(rawData.absorption as string) : null,
    meshSize: rawData.meshSize ? parseInt(rawData.meshSize as string) : null,
  }

  const validatedData = clayBodySchema.parse(processedData)

  const updateData: Prisma.ClayBodyUpdateInput = {
    name: validatedData.name,
    type: {
      connect: { id: validatedData.typeId }
    },
    manufacturer: validatedData.manufacturer,
    cone: validatedData.cone?.length ? {
      connect: validatedData.cone.map(id => ({ id }))
    } : undefined,
    firingTemperature: validatedData.firingTemperature,
    texture: validatedData.texture,
    plasticity: validatedData.plasticity,
    colourOxidation: validatedData.colourOxidation,
    colourReduction: validatedData.colourReduction,
    shrinkage: validatedData.shrinkage,
    absorption: validatedData.absorption,
    meshSize: validatedData.meshSize,
    imageUrl: validatedData.imageUrl,
    notes: validatedData.notes,
  }

  await prisma.clayBody.update({
    where: {
      id,
      userId: session.user.id
    },
    data: updateData
  })

  revalidatePath('/clay-bodies')
  redirect(`/clay-bodies/${id}`)
}
