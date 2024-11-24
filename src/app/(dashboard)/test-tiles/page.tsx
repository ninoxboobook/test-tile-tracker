import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { TestTileGrid } from '@/components/test-tiles/test-tile-grid'

export default async function TestTilesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const testTiles = await prisma.testTiles.findMany({
    where: {
      user_id: session.user.id,
    },
    include: {
      test_series: true,
      clay_body: true,
      decoration: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  })

  return (
    <PageLayout 
      title="Test Tiles"
      description="Document and track your ceramic test tiles"
      action={
        <Link href="/test-tiles/new">
          <ActionButton>Add New Test Tile</ActionButton>
        </Link>
      }
    >
      <TestTileGrid testTiles={testTiles} />
    </PageLayout>
  )
}
