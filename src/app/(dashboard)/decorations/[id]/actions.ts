'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function deleteDecoration(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  await prisma.decoration.delete({
    where: {
      id,
      userId: session.user.id
    }
  })

  revalidatePath('/decorations')
  redirect('/decorations')
} 