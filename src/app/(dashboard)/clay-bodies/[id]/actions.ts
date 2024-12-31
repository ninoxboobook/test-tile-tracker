'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getSessionWithAuth } from '@/lib/auth/admin'

export async function deleteClayBody(id: string) {
  const { session, isAdmin } = await getSessionWithAuth()

  await prisma.clayBody.delete({
    where: {
      id,
      ...(isAdmin ? {} : { userId: session.user.id })
    }
  })

  revalidatePath('/clay-bodies')
  revalidatePath('/admin/content/clay-bodies')
  redirect('/clay-bodies')
}