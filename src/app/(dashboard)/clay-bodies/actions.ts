'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { clayBodySchema, type ClayBodyFormData } from '@/lib/schemas/clay-body'

async function validateSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function getClayBody(id: string) {
  const session = await validateSession()

  const clayBody = await prisma.clayBody.findUnique({
    where: { 
      id,
      userId: session.user.id 
    },
  })

  if (!clayBody) {
    throw new Error('Clay body not found')
  }

  return clayBody
}

export async function createClayBody(data: ClayBodyFormData) {
  const session = await validateSession()

  // Convert string numbers to actual numbers before validation
  const processedData = {
    ...data,
    shrinkage: data.shrinkage ?? null,
    absorption: data.absorption ?? null,
    meshSize: data.meshSize ?? null,
  }

  const validatedData = clayBodySchema.parse(processedData)

  const clayBody = await prisma.clayBody.create({
    data: {
      name: validatedData.name,
      type: {
        connect: { id: validatedData.typeId }
      },
      cone: validatedData.cone ? {
        connectOrCreate: validatedData.cone.map(cone => ({
          where: { name: cone },
          create: { name: cone }
        }))
      } : undefined,
      manufacturer: validatedData.manufacturer,
      firingTemperature: validatedData.firingTemperature,
      plasticity: validatedData.plasticity,
      texture: validatedData.texture,
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
    },
  })

  revalidatePath('/clay-bodies')
  redirect(`/clay-bodies/${clayBody.id}`)
}

export async function createClayBodyFromModal(formData: FormData) {
  const session = await validateSession()

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

  const clayBody = await prisma.clayBody.create({
    data: {
      name: validatedData.name,
      type: {
        connect: { id: validatedData.typeId }
      },
      cone: validatedData.cone?.length ? {
        connect: validatedData.cone.map(id => ({ id }))
      } : undefined,
      manufacturer: validatedData.manufacturer,
      firingTemperature: validatedData.firingTemperature,
      plasticity: validatedData.plasticity,
      texture: validatedData.texture,
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
    },
    include: {
      type: true,
      cone: true
    }
  })

  revalidatePath('/clay-bodies')
  return clayBody
}

export async function updateClayBody(id: string, data: ClayBodyFormData) {
  const session = await validateSession()

  // Convert string numbers to actual numbers before validation
  const processedData = {
    ...data,
    shrinkage: data.shrinkage ?? null,
    absorption: data.absorption ?? null,
    meshSize: data.meshSize ?? null,
  }

  const validatedData = clayBodySchema.parse(processedData)

  await prisma.clayBody.update({
    where: { 
      id,
      userId: session.user.id 
    },
    data: {
      name: validatedData.name,
      type: {
        connect: { id: validatedData.typeId }
      },
      cone: {
        set: [],
        connectOrCreate: validatedData.cone?.map(cone => ({
          where: { name: cone },
          create: { name: cone }
        })) ?? []
      },
      manufacturer: validatedData.manufacturer,
      firingTemperature: validatedData.firingTemperature,
      plasticity: validatedData.plasticity,
      texture: validatedData.texture,
      colourOxidation: validatedData.colourOxidation,
      colourReduction: validatedData.colourReduction,
      shrinkage: validatedData.shrinkage,
      absorption: validatedData.absorption,
      meshSize: validatedData.meshSize,
      imageUrl: validatedData.imageUrl || [],
      notes: validatedData.notes,
    },
  })

  revalidatePath('/clay-bodies')
  revalidatePath(`/clay-bodies/${id}`)
  redirect(`/clay-bodies/${id}`)
}

export async function deleteClayBody(id: string) {
  const session = await validateSession()

  await prisma.clayBody.delete({
    where: { 
      id,
      userId: session.user.id 
    },
  })

  revalidatePath('/clay-bodies')
  redirect('/clay-bodies')
}
