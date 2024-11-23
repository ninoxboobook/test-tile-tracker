'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const clayBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  coneRange: z.string().optional(),
  manufacturer: z.string().optional(),
  description: z.string().optional(),
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

  const clayBody = await prisma.clayBody.findUnique({
    where: { id },
  })

  if (!clayBody) {
    throw new Error('Clay body not found')
  }

  if (clayBody.userId !== session.user.id) {
    throw new Error('Unauthorized')
  }

  return clayBody
}

export async function createClayBody(data: ClayBodyFormData) {
  const session = await validateSession()

  const validatedData = clayBodySchema.parse(data)

  const clayBody = await prisma.clayBody.create({
    data: {
      ...validatedData,
      userId: session.user.id,
    },
  })

  revalidatePath('/clay-bodies')
  redirect(`/clay-bodies/${clayBody.id}`)
}

export async function updateClayBody(id: string, data: ClayBodyFormData) {
  const session = await validateSession()

  const validatedData = clayBodySchema.parse(data)

  const clayBody = await prisma.clayBody.findUnique({
    where: { id },
  })

  if (!clayBody) {
    throw new Error('Clay body not found')
  }

  if (clayBody.userId !== session.user.id) {
    throw new Error('Unauthorized')
  }

  await prisma.clayBody.update({
    where: { id },
    data: validatedData,
  })

  revalidatePath('/clay-bodies')
  revalidatePath(`/clay-bodies/${id}`)
  redirect(`/clay-bodies/${id}`)
}

export async function deleteClayBody(id: string) {
  const session = await validateSession()

  const clayBody = await prisma.clayBody.findUnique({
    where: { id },
  })

  if (!clayBody) {
    throw new Error('Clay body not found')
  }

  if (clayBody.userId !== session.user.id) {
    throw new Error('Unauthorized')
  }

  await prisma.clayBody.delete({
    where: { id },
  })

  revalidatePath('/clay-bodies')
  redirect('/clay-bodies')
}
