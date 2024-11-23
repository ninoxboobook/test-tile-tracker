'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { type enum_ClayBodies_type } from '@prisma/client'
import { clayBodySchema } from '@/lib/schemas/clay-body'

export async function updateClayBody(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  const id = formData.get('id') as string
  if (!id) {
    throw new Error('No ID provided')
  }

  // Convert FormData to object and remove id
  const data = Object.fromEntries(formData.entries())
  delete data.id
  const validatedData = clayBodySchema.parse(data)

  // Extract numeric fields
  const { shrinkage, absorption, ...rest } = validatedData

  const clayBody = await prisma.clayBodies.update({
    where: {
      id,
      user_id: session.user.id,
    },
    data: {
      ...rest,
      shrinkage: shrinkage || null,
      absorption: absorption || null,
      updated_at: new Date(),
      type: validatedData.type as enum_ClayBodies_type,
    },
  })

  redirect(`/clay-bodies/${clayBody.id}`)
}
