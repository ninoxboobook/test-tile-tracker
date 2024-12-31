'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getSessionWithAuth } from '@/lib/auth/admin'

export async function deleteDecoration(id: string) {
  const { session, isAdmin } = await getSessionWithAuth()

  await prisma.decoration.delete({
    where: {
      id,
      ...(isAdmin ? {} : { userId: session.user.id })
    }
  })

  revalidatePath('/decorations')
  revalidatePath('/admin/content/decorations')
  redirect('/decorations')
}