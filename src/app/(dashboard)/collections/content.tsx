'use client'

import { Collection, TestTile } from '@prisma/client'
import { CollectionsTable } from '@/components/collections/collections-table'
import { CollectionsGrid } from '@/components/collections/collections-grid'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { useViewPreference } from '@/hooks/use-view-preference'
import { ViewToggle } from '@/components/ui/data-view/view-toggle'
import Link from 'next/link'

interface CollectionsContentProps {
  collections: (Collection & {
    testTiles: Pick<TestTile, 'id' | 'imageUrl'>[]
  })[]
}

export function CollectionsContent({ collections }: CollectionsContentProps) {
  const [view, setView] = useViewPreference('collections')

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
      {view === 'table' ? (
        <CollectionsTable 
          collections={collections} 
          view={view}
          onViewChange={setView}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <ViewToggle view={view} onChange={setView} />
          </div>
          <CollectionsGrid collections={collections} />
        </div>
      )}
    </PageLayout>
  )
} 