'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { decorationSchema } from '@/lib/schemas/decoration'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function createDecoration(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }  
   // Convert FormData to object while preserving arrays
   const entries = Array.from(formData.entries());
   const rawData = entries.reduce((acc, [key, value]) => {
     if (key === 'coneIds') {
       if (!acc[key]) {
         const values = formData.getAll(key);
         acc[key] = values.map(v => typeof v === 'string' ? v : '');
       }
     } else if (key === 'atmosphereIds') {
      if (!acc[key]) {
        const values = formData.getAll(key);
        acc[key] = values.map(v => typeof v === 'string' ? v : '');
      }
    } else if (key === 'imageUrl') {
      // Handle imageUrl as array directly
      const values = formData.getAll(key);
      acc[key] = values.filter(v => typeof v === 'string');
    }else {
      acc[key] = value;
    }
     return acc;
   }, {} as Record<string, any>);
  
  const validatedData = decorationSchema.parse({
    ...rawData,
  })

  const createData: Prisma.DecorationCreateInput = {
    name: validatedData.name,
    type: {
      connect: { id: validatedData.typeId }
    },
    source: validatedData.source || null,
    manufacturer: validatedData.manufacturer || null,
    cone: validatedData.coneIds?.length ? {
      connect: validatedData.coneIds.map(id => ({ id }))
    } : undefined,
    atmosphere: validatedData.atmosphereIds?.length ? {
      connect: validatedData.atmosphereIds.map(id => ({ id }))
    } : undefined,
    colour: validatedData.colour || null,
    surface: validatedData.surface || null,
    transparency: validatedData.transparency || null,
    glazyUrl: validatedData.glazyUrl || null,
    imageUrl: validatedData.imageUrl || [],
    recipe: validatedData.recipe || null,
    notes: validatedData.notes || null,
    user: {
      connect: {
        id: session.user.id
      }
    }
  }

  try {
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
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('A decoration with this name already exists')
      }
    }
    throw error
  }
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