'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { clayBodySchema } from '@/lib/schemas/clay-body'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function createClayBody(formData: FormData) {
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
    shrinkage: rawData.shrinkage ? parseFloat(rawData.shrinkage as string) : null,
    absorption: rawData.absorption ? parseFloat(rawData.absorption as string) : null,
    meshSize: rawData.meshSize ? parseInt(rawData.meshSize as string) : null,
    imageUrl: rawData.imageUrl?.filter((url: any) => typeof url === 'string') || []
  }

  const validatedData = clayBodySchema.parse(processedData)

  const createData: Prisma.ClayBodyCreateInput = {
    name: validatedData.name,
    type: {
      connect: { id: validatedData.typeId }
    },
    manufacturer: validatedData.manufacturer,
    cone: {
      connectOrCreate: validatedData.cone?.map(cone => ({
        where: { name: cone },
        create: { name: cone }
      })) ?? []
    },
    firingTemperature: validatedData.firingTemperature,
    texture: validatedData.texture,
    plasticity: validatedData.plasticity,
    colourOxidation: validatedData.colourOxidation,
    colourReduction: validatedData.colourReduction,
    shrinkage: validatedData.shrinkage,
    absorption: validatedData.absorption,
    meshSize: validatedData.meshSize,
    imageUrl: validatedData.imageUrl || [],
    notes: validatedData.notes,
    user: {
      connect: {
        id: session.user.id
      }
    }
  }

  const clayBody = await prisma.clayBody.create({
    data: createData
  })

  revalidatePath('/clay-bodies')
  redirect(`/clay-bodies/${clayBody.id}`)
}
