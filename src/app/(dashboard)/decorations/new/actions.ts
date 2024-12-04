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
  
  // Handle array fields from FormData
  const coneIds = formData.getAll('coneIds[]').map(id => id.toString())
  const atmosphereIds = formData.getAll('atmosphereIds[]').map(id => id.toString())
  
  const validatedData = decorationSchema.parse({
    ...rawData,
    coneIds,
    atmosphereIds
  })

  const createData: Prisma.DecorationCreateInput = {
    name: validatedData.name,
    type: {
      connect: { id: validatedData.typeId }
    },
    source: validatedData.source || null,
    manufacturer: validatedData.manufacturer || null,
    cone: {
      connect: validatedData.coneIds?.map(id => ({ id })) ?? []
    },
    atmosphere: {
      connect: validatedData.atmosphereIds?.map(id => ({ id })) ?? []
    },
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
    data: createData,
    include: {
      type: true,
      cone: true,
      atmosphere: true
    }
  })

  revalidatePath('/decorations')
  redirect(`/decorations/${decoration.id}`)
}

// Helper functions for fetching data needed by the form
export async function getDecorationTypes() {
  return prisma.decorationType.findMany({
    orderBy: {
      name: 'asc'
    }
  })
}

export async function getCones() {
  return prisma.cone.findMany({
    orderBy: {
      name: 'asc'
    }
  })
}

export async function getAtmospheres() {
  return prisma.atmosphere.findMany({
    orderBy: {
      name: 'asc'
    }
  })
}