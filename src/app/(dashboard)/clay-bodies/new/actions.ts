'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { clayBodySchema } from '@/lib/schemas/clay-body'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function createClayBody(formData: FormData, redirectOnSuccess = true) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Convert FormData to object while preserving arrays
  const entries = Array.from(formData.entries());
  const rawData = entries.reduce((acc, [key, value]) => {
    if (key === 'cone' || key === 'imageUrl') {
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
    shrinkageWetToDry: rawData.shrinkageWetToDry ? parseFloat(rawData.shrinkageWetToDry as string) : null,
    shrinkageWetToBisque: rawData.shrinkageWetToBisque ? parseFloat(rawData.shrinkageWetToBisque as string) : null,
    shrinkageWetToFired: rawData.shrinkageWetToFired ? parseFloat(rawData.shrinkageWetToFired as string) : null,
    absorption: rawData.absorption ? parseFloat(rawData.absorption as string) : null,
    meshSize: rawData.meshSize ? parseInt(rawData.meshSize as string) : null,
    imageUrl: rawData.imageUrl?.filter((url: any) => typeof url === 'string') || [],
    isPublic: formData.get('isPublic') === 'true'
  }

  const validatedData = clayBodySchema.parse(processedData)

  const createData: Prisma.ClayBodyCreateInput = {
    name: validatedData.name,
    type: {
      connect: { id: validatedData.typeId }
    },
    manufacturer: validatedData.manufacturer,
    cone: validatedData.cone?.length ? {
      connect: validatedData.cone.map(id => ({ id }))
    } : undefined,
    firingRange: validatedData.firingRange,
    bisqueTemperature: validatedData.bisqueTemperature,
    vitreousTemperature: validatedData.vitreousTemperature,
    texture: validatedData.texture,
    plasticity: validatedData.plasticity,
    colourOxidation: validatedData.colourOxidation,
    colourReduction: validatedData.colourReduction,
    shrinkageWetToDry: validatedData.shrinkageWetToDry,
    shrinkageWetToBisque: validatedData.shrinkageWetToBisque,
    shrinkageWetToFired: validatedData.shrinkageWetToFired,
    absorption: validatedData.absorption,
    meshSize: validatedData.meshSize,
    imageUrl: validatedData.imageUrl || [],
    notes: validatedData.notes,
    isPublic: validatedData.isPublic,
    user: {
      connect: {
        id: session.user.id
      }
    }
  }

  const clayBody = await prisma.clayBody.create({
    data: createData,
    include: {
      type: true,
      cone: true
    }
  })

  revalidatePath('/clay-bodies')
  
  if (redirectOnSuccess) {
    redirect(`/clay-bodies/${clayBody.id}`)
  }
  console.log("DA CLAYBODY IS", clayBody)
  return clayBody
}

// Wrapper that always redirects and returns void
export async function createClayBodyAndRedirect(formData: FormData) {
  'use server'
  await createClayBody(formData, true)
}
