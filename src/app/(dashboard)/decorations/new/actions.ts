'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { decorationSchema } from '@/lib/schemas/decoration'

export async function createDecoration(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  const data = Object.fromEntries(formData.entries())
  const validatedData = decorationSchema.parse(data)

  const decoration = await prisma.decorations.create({
    data: {
      ...validatedData,
      user_id: session.user.id,
      created_at: new Date(),
      updated_at: new Date(),
    },
  })

  redirect(`/decorations/${decoration.id}`)
} 