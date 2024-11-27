'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { decorationSchema } from '@/lib/schemas/decoration'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function createDecoration(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const rawData = Object.fromEntries(formData.entries())
  const validatedData = decorationSchema.parse(rawData)

  const createData: Prisma.DecorationCreateInput = {
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
    user: {
      connect: {
        id: session.user.id
      }
    }
  }

  const decoration = await prisma.decoration.create({
    data: createData
  })

  revalidatePath('/decorations')
  redirect(`/decorations/${decoration.id}`)
} 