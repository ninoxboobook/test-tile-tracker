import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/nav'
import { prisma } from '@/lib/prisma'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      imageUrl: true,
    },
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-full">
      <DashboardNav user={user} />
      <div className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6">
          {children}
        </div>
      </div>
    </div>
  )
}
