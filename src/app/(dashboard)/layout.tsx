import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/navigation/nav-menu'
import { UnauthNav } from '@/components/navigation/unauth-nav-menu'
import { Footer } from '@/components/navigation/footer'
import { prisma } from '@/lib/prisma'
import {headers} from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  // Allow public access to profiles and individual test tile pages
  if (!session?.user?.id && 
      !pathname?.startsWith('/profile/') && 
      !pathname?.match(/^\/test-tiles\/[^/]+$/)) {
    redirect('/login')
  }

  const user =
    session?.user?.id === undefined
      ? null
      : await prisma.user.findUnique({
          where: { id: session?.user.id },
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
            role: true,
          },
        });

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
