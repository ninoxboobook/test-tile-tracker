'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { testSeriesSchema } from '@/lib/schemas/test-series'
import { revalidatePath } from 'next/cache'
import { Prisma, enum_TestSeries_status } from '@prisma/client'

export async function updateTestSeries(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const id = formData.get('id') as string
  const rawData = Object.fromEntries(formData.entries())
  const validatedData = testSeriesSchema.parse(rawData)

  const updateData: Prisma.TestSeriesUpdateInput = {
    name: validatedData.name,
    description: validatedData.description || null,
    variables: validatedData.variables 
      ? JSON.parse(validatedData.variables)
      : null,
    goal: validatedData.goal || null,
    status: validatedData.status as enum_TestSeries_status || 'planned',
    conclusions: validatedData.conclusions || null,
  }

  await prisma.testSeries.update({
    where: {
      id,
      user_id: session.user.id,
    },
    data: updateData,
  })

  revalidatePath('/test-series')
  revalidatePath(`/test-series/${id}`)
  redirect(`/test-series/${id}`)
} 