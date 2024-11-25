'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { decorationSchema } from '@/lib/schemas/decoration'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function updateDecoration(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const id = formData.get('id') as string
  const rawData = Object.fromEntries(formData.entries())
  const validatedData = decorationSchema.parse(rawData)

  const updateData: Prisma.DecorationUpdateInput = {
    name: validatedData.name,
    type: validatedData.type,
    cone: validatedData.cone || null,
    manufacturer: validatedData.manufacturer || null,
    surface: validatedData.surface || null,
    transparency: validatedData.transparency || null,
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