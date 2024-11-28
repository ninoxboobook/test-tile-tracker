import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decorationSchema } from '@/lib/schemas/decoration'
import { Prisma } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const formData = await request.formData()
    const rawData = Object.fromEntries(formData.entries())

    const validatedData = decorationSchema.parse(rawData)

    const createData: Prisma.DecorationCreateInput = {
      name: validatedData.name,
      category: validatedData.category,
      type: validatedData.type,
      manufacturer: validatedData.manufacturer || null,
      cone: validatedData.cone || null,
      atmosphere: validatedData.atmosphere || null,
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
      select: {
        id: true,
        name: true
      }
    })

    return NextResponse.json(decoration)
  } catch (error) {
    console.error('Error creating decoration:', error)
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    )
  }
}
