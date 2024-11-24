'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { clayBodySchema } from '@/lib/schemas/clay-body'
import { revalidatePath } from 'next/cache'

// Helper function to convert form type to database type
function convertClayBodyType(type: string): 'Raku' | 'Earthenware' | 'Stoneware' | 'Porcelain' | 'Wild' | 'Bone_China' {
  return type === 'Bone China' ? 'Bone_China' : type as any
}

export async function updateClayBody(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const id = formData.get('id') as string
  const rawData = Object.fromEntries(formData.entries())
  const validatedData = clayBodySchema.parse(rawData)

  await prisma.clayBodies.update({
    where: {
      id,
      user_id: session.user.id,
    },
    data: {
      name: validatedData.name,
      type: convertClayBodyType(validatedData.type),
      cone: validatedData.cone,
      description: validatedData.description,
      cone_range: validatedData.cone_range,
      manufacturer: validatedData.manufacturer,
      firing_temperature: validatedData.firing_temperature,
      plasticity: validatedData.plasticity,
      texture: validatedData.texture,
      composition: validatedData.composition ? JSON.parse(validatedData.composition) : null,
      colour_oxidation: validatedData.colour_oxidation,
      colour_reduction: validatedData.colour_reduction,
      shrinkage: validatedData.shrinkage ? parseFloat(validatedData.shrinkage) : null,
      absorption: validatedData.absorption ? parseFloat(validatedData.absorption) : null,
      notes: validatedData.notes,
    },
  })

  revalidatePath('/clay-bodies')
  revalidatePath(`/clay-bodies/${id}`)
  redirect(`/clay-bodies/${id}`)
}
