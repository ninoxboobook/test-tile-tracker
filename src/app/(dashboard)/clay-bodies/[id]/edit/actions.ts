'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { clayBodySchema } from '@/lib/schemas/clay-body'
import { revalidatePath } from 'next/cache'

export async function updateClayBody(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const id = formData.get('id') as string
  const rawData = Object.fromEntries(formData.entries())
  
  // Convert string numbers to actual numbers before validation
  const processedData = {
    ...rawData,
    shrinkage: rawData.shrinkage ? parseFloat(rawData.shrinkage as string) : undefined,
    absorption: rawData.absorption ? parseFloat(rawData.absorption as string) : undefined,
    meshSize: rawData.meshSize ? parseInt(rawData.meshSize as string) : undefined,
  }

  const validatedData = clayBodySchema.parse(processedData)

  await prisma.clayBody.update({
    where: {
      id,
      userId: session.user.id,
    },
    data: {
      name: validatedData.name,
      type: validatedData.type,
      manufacturer: validatedData.manufacturer,
      cone: validatedData.cone,
      firingTemperature: validatedData.firingTemperature,
      plasticity: validatedData.plasticity,
      texture: validatedData.texture,
      colourOxidation: validatedData.colourOxidation,
      colourReduction: validatedData.colourReduction,
      shrinkage: validatedData.shrinkage,
      absorption: validatedData.absorption,
      meshSize: validatedData.meshSize,
      imageUrl: validatedData.imageUrl,
      notes: validatedData.notes,
    },
  })

  revalidatePath('/clay-bodies')
  revalidatePath(`/clay-bodies/${id}`)
  redirect(`/clay-bodies/${id}`)
}
