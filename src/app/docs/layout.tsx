import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/navigation/nav-menu'
import { Footer } from '@/components/navigation/footer'
import { prisma } from '@/lib/prisma'
import { UnauthNav } from '@/components/navigation/unauth-nav-menu'

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Get user data if logged in (for nav menu)
  let user = null
  if (session?.user?.id) {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        role: true,
      },
    })
  }

  return (
    <div className="min-h-full px-4 sm:px-6">
      {user ? <DashboardNav user={user} /> : <UnauthNav />}
      <div className="py-6">
        {children}
      </div>
      <Footer />
    </div>
  )
} 