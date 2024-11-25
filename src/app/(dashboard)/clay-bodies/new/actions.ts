'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const clayBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  cone_range: z.string().optional(),
  manufacturer: z.string().optional(),
  description: z.string().optional(),
  firing_temperature: z.string().optional(),
  cone: z.string().optional(),
  shrinkage: z.coerce.number().optional(),
  absorption: z.coerce.number().optional(),
  plasticity: z.string().optional(),
  texture: z.string().optional(),
  composition: z.any().optional(),
  colour_oxidation: z.string().optional(),
  colour_reduction: z.string().optional(),
})

export async function createClayBody(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  // Convert FormData to object
  const data = Object.fromEntries(formData.entries())
  const validatedData = clayBodySchema.parse(data)

  // Extract numeric fields
  const { shrinkage, absorption, ...rest } = validatedData

  const clayBody = await prisma.clayBody.create({
    data: {
      ...rest,
      shrinkage: shrinkage || null,
      absorption: absorption || null,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: validatedData.type,
    },
  })

  redirect(`/clay-bodies/${clayBody.id}`)
}
