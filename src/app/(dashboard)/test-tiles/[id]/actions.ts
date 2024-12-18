'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function deleteTestTile(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  await prisma.testTile.delete({
    where: {
      id,
      userId: session.user.id
    }
  })

  revalidatePath('/test-tiles')
  redirect('/test-tiles')
} 