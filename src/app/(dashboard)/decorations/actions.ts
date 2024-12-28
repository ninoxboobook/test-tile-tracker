'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { decorationSchema, type DecorationFormData } from '@/lib/schemas/decoration'

async function validateSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function createDecorationFromModal(formData: FormData) {
  const session = await validateSession()

  // Convert FormData to object while preserving arrays
  const entries = Array.from(formData.entries());
  const rawData = entries.reduce((acc, [key, value]) => {
    if (key === 'coneIds' || key === 'atmosphereIds' || key === 'imageUrl') {
      if (!acc[key]) {
        acc[key] = formData.getAll(key);
      }
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  const validatedData = decorationSchema.parse(rawData)

  const decoration = await prisma.decoration.create({
    data: {
      name: validatedData.name,
      type: {
        connect: { id: validatedData.typeId }
      },
      cone: validatedData.coneIds?.length ? {
        connect: validatedData.coneIds.map(id => ({ id }))
      } : undefined,
      atmosphere: validatedData.atmosphereIds?.length ? {
        connect: validatedData.atmosphereIds.map(id => ({ id }))
      } : undefined,
      manufacturer: validatedData.manufacturer,
      source: validatedData.source,
      colour: validatedData.colour,
      notes: validatedData.notes,
      imageUrl: validatedData.imageUrl ?? [],
      user: {
        connect: { id: session.user.id }
      }
    },
    include: {
      type: true,
      cone: true,
      atmosphere: true
    }
  })

  revalidatePath('/decorations')
  return decoration
}
