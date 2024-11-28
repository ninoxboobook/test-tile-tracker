import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { CollectionsTable } from '@/components/collections/collections-table'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import Link from 'next/link'

export default async function CollectionsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const collections = await prisma.collection.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <PageLayout 
      title="Collections"
      description="Organize your test tiles into collections"
      action={
        <Link href="/collections/new">
          <ActionButton>Add New Collection</ActionButton>
        </Link>
      }
    >
      <CollectionsTable collections={collections} />
    </PageLayout>
  )
}
