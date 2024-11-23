'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { decorationSchema } from '@/lib/schemas/decoration'

export async function updateDecoration(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  const id = formData.get('id') as string
  if (!id) {
    throw new Error('No ID provided')
  }

  const data = Object.fromEntries(formData.entries())
  delete data.id
  const validatedData = decorationSchema.parse(data)

  const decoration = await prisma.decorations.update({
    where: {
      id,
      user_id: session.user.id,
    },
    data: {
      ...validatedData,
      updated_at: new Date(),
    },
  })

  redirect(`/decorations/${decoration.id}`)
} 