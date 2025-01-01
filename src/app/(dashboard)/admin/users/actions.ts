'use server'

import { getSessionWithAuth } from '@/lib/auth/admin'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateUserRole(userId: string, role: 'USER' | 'ADMIN') {
  const { isAdmin } = await getSessionWithAuth()
  if (!isAdmin) throw new Error('Unauthorized')

  await prisma.user.update({
    where: { id: userId },
    data: { role }
  })

  revalidatePath('/admin/users')
}

export async function deleteUser(userId: string) {
  const { isAdmin } = await getSessionWithAuth()
  if (!isAdmin) throw new Error('Unauthorized')

  // Delete all user content
  await prisma.$transaction([
    prisma.testTile.deleteMany({ where: { userId } }),
    prisma.decoration.deleteMany({ where: { userId } }),
    prisma.clayBody.deleteMany({ where: { userId } }),
    prisma.collection.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } })
  ])

  revalidatePath('/admin/users')
}
