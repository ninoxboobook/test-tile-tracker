'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { decorationSchema } from '@/lib/schemas/decoration'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

async function validateSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function getDecoration(id: string) {
  const session = await validateSession()

  const decoration = await prisma.decoration.findUnique({
    where: { 
      id,
      userId: session.user.id 
    },
  })

  if (!decoration) {
    throw new Error('Decoration not found')
  }

  return decoration
}

export async function updateDecoration(formData: FormData) {
  const session = await validateSession()

  const id = formData.get('id') as string
  const rawData = Object.fromEntries(formData.entries())
  const validatedData = decorationSchema.parse(rawData)

  const updateData: Prisma.DecorationUpdateInput = {
    name: validatedData.name,
    category: validatedData.category,
    type: validatedData.type,
    manufacturer: validatedData.manufacturer || null,
    cone: validatedData.cone || null,
    atmosphere: validatedData.atmosphere || null,
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
      userId: session.user.id,
    },
    data: updateData,
  })

  revalidatePath('/decorations')
  revalidatePath(`/decorations/${id}`)
  redirect(`/decorations/${id}`)
}

export async function deleteDecoration(id: string) {
  const session = await validateSession()

  await prisma.decoration.delete({
    where: {
      id,
      userId: session.user.id,
    },
  })

  revalidatePath('/decorations')
  redirect('/decorations')
} 