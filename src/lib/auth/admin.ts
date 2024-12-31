import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function isAdmin() {
  const session = await getServerSession(authOptions)
  return session?.user?.role === 'ADMIN'
}

export async function getSessionWithAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  return {
    session,
    isAdmin: session.user.role === 'ADMIN'
  }
}
