import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { DecorationsTable } from '@/components/decorations/decorations-table'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import Link from 'next/link'

export default async function DecorationsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const decorations = await prisma.decorations.findMany({
    where: {
      user_id: session.user.id
    },
    orderBy: {
      created_at: 'desc'
    }
  })

  return (
    <PageLayout 
      title="Decorations"
      description="Manage your glazes and surface decorations"
      action={
        <Link href="/decorations/new">
          <ActionButton>Add New Decoration</ActionButton>
        </Link>
      }
    >
      <DecorationsTable decorations={decorations} />
    </PageLayout>
  )
}
