import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { clayBodySchema } from '@/lib/schemas/clay-body'
import { Prisma } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const formData = await request.formData()
    const rawData = Object.fromEntries(formData.entries())

    // Convert string numbers to actual numbers before validation
    const processedData = {
      ...rawData,
      shrinkage: rawData.shrinkage ? parseFloat(rawData.shrinkage as string) : null,
      absorption: rawData.absorption ? parseFloat(rawData.absorption as string) : null,
      meshSize: rawData.meshSize ? parseInt(rawData.meshSize as string) : null,
    }

    const validatedData = clayBodySchema.parse(processedData)

    const createData: Prisma.ClayBodyCreateInput = {
      name: validatedData.name,
      type: {
        connectOrCreate: validatedData.type.map(type => ({
          where: { name: type },
          create: { name: type }
        }))
      },
      manufacturer: validatedData.manufacturer || null,
      cone: validatedData.cone ? {
        connectOrCreate: validatedData.cone.map(cone => ({
          where: { name: cone },
          create: { name: cone }
        }))
      } : undefined,
      firingTemperature: validatedData.firingTemperature || null,
      texture: validatedData.texture || null,
      plasticity: validatedData.plasticity || null,
      colourOxidation: validatedData.colourOxidation || null,
      colourReduction: validatedData.colourReduction || null,
      shrinkage: validatedData.shrinkage || null,
      absorption: validatedData.absorption || null,
      meshSize: validatedData.meshSize || null,
      imageUrl: validatedData.imageUrl || null,
      notes: validatedData.notes || null,
      user: {
        connect: {
          id: session.user.id
        }
      }
    }

    const clayBody = await prisma.clayBody.create({
      data: createData,
      select: {
        id: true,
        name: true
      }
    })

    return NextResponse.json(clayBody)
  } catch (error) {
    console.error('Error creating clay body:', error)
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    )
  }
}
