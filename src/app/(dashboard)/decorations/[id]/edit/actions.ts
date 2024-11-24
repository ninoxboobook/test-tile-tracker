'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { decorationSchema } from '@/lib/schemas/decoration'
import { revalidatePath } from 'next/cache'
import { enum_Decorations_atmosphere, Prisma } from '@prisma/client'

export async function updateDecoration(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const id = formData.get('id') as string
  const rawData = Object.fromEntries(formData.entries())
  const validatedData = decorationSchema.parse(rawData)

  const updateData: Prisma.DecorationsUpdateInput = {
    name: validatedData.name,
    type: validatedData.type,
    description: validatedData.description || null,
    color: validatedData.color || null,
    color_reaction: validatedData.color_reaction || null,
    cone: validatedData.cone || null,
    firing_atmosphere: validatedData.firing_atmosphere as enum_Decorations_atmosphere || null,
    firing_temperature: validatedData.firing_temperature || null,
    food_safe: validatedData.food_safe || null,
    ingredients: validatedData.ingredients ? JSON.parse(validatedData.ingredients) : null,
    manufacturer: validatedData.manufacturer || null,
    surface: validatedData.surface || null,
    transparency: validatedData.transparency || null,
  }

  await prisma.decorations.update({
    where: {
      id,
      user_id: session.user.id,
    },
    data: updateData,
  })

  revalidatePath('/decorations')
  revalidatePath(`/decorations/${id}`)
  redirect(`/decorations/${id}`)
} 