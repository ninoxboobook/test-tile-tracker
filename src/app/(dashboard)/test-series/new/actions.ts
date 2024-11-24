'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { testSeriesSchema } from '@/lib/schemas/test-series'
import { revalidatePath } from 'next/cache'
import { Prisma, enum_TestSeries_status } from '@prisma/client'

export async function createTestSeries(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const rawData = Object.fromEntries(formData.entries())
  const validatedData = testSeriesSchema.parse(rawData)

  const createData: Prisma.TestSeriesCreateInput = {
    name: validatedData.name,
    description: validatedData.description || null,
    variables: validatedData.variables 
      ? JSON.parse(validatedData.variables)
      : null,
    goal: validatedData.goal || null,
    status: validatedData.status as enum_TestSeries_status || 'planned',
    conclusions: validatedData.conclusions || null,
    created_at: new Date(),
    user: {
      connect: {
        id: session.user.id
      }
    }
  }

  const testSeries = await prisma.testSeries.create({
    data: createData
  })

  revalidatePath('/test-series')
  redirect(`/test-series/${testSeries.id}`)
} 