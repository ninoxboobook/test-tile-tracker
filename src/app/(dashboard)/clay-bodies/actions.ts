'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { type enum_ClayBodies_type } from '@prisma/client'

const clayBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  coneRange: z.string().optional(),
  manufacturer: z.string().optional(),
  description: z.string().optional(),
  firingTemperature: z.string().optional(),
  cone: z.string().optional(),
  color: z.string().optional(),
  shrinkage: z.number().optional(),
  absorption: z.number().optional(),
  plasticity: z.string().optional(),
  texture: z.string().optional(),
  composition: z.any().optional(),
})

export type ClayBodyFormData = z.infer<typeof clayBodySchema>

async function validateSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function getClayBody(id: string) {
  const session = await validateSession()

  const clayBody = await prisma.clayBodies.findUnique({
    where: { id },
  })

  if (!clayBody) {
    throw new Error('Clay body not found')
  }

  if (clayBody.user_id !== session.user.id) {
    throw new Error('Unauthorized')
  }

  return clayBody
}

export async function createClayBody(data: ClayBodyFormData) {
  const session = await validateSession()

  const validatedData = clayBodySchema.parse(data)

  const clayBody = await prisma.clayBodies.create({
    data: {
      ...validatedData,
      user_id: session.user.id,
      created_at: new Date(),
      updated_at: new Date(),
      type: validatedData.type as enum_ClayBodies_type,
    },
  })

  revalidatePath('/clay-bodies')
  redirect(`/clay-bodies/${clayBody.id}`)
}

export async function updateClayBody(id: string, data: ClayBodyFormData) {
  const session = await validateSession()

  const validatedData = clayBodySchema.parse(data)

  const clayBody = await prisma.clayBodies.findUnique({
    where: { id },
  })

  if (!clayBody) {
    throw new Error('Clay body not found')
  }

  if (clayBody.user_id !== session.user.id) {
    throw new Error('Unauthorized')
  }

  await prisma.clayBodies.update({
    where: { id },
    data: {
      ...validatedData,
      updated_at: new Date(),
      type: validatedData.type as enum_ClayBodies_type,
    },
  })

  revalidatePath('/clay-bodies')
  revalidatePath(`/clay-bodies/${id}`)
  redirect(`/clay-bodies/${id}`)
}

export async function deleteClayBody(id: string) {
  const session = await validateSession()

  const clayBody = await prisma.clayBodies.findUnique({
    where: { id },
  })

  if (!clayBody) {
    throw new Error('Clay body not found')
  }

  if (clayBody.user_id !== session.user.id) {
    throw new Error('Unauthorized')
  }

  await prisma.clayBodies.delete({
    where: { id },
  })

  revalidatePath('/clay-bodies')
  redirect('/clay-bodies')
}
