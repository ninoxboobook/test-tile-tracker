'use client'

import { TestTile, ClayBody, Collection, Decoration } from '@prisma/client'
import { TestTilesTable } from '@/components/test-tiles/test-tiles-table'
import { TestTilesGrid } from '@/components/test-tiles/test-tiles-grid'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { useViewPreference } from '@/hooks/use-view-preference'
import Link from 'next/link'
import { ViewToggle } from '@/components/ui/data-view/view-toggle'

interface TestTilesContentProps {
  testTiles: (TestTile & {
    clayBody: ClayBody
    collections: Collection[]
    decorations: Decoration[]
  })[]
}

export function TestTilesContent({ testTiles }: TestTilesContentProps) {
  const [view, setView] = useViewPreference('test-tiles')

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
      {view === 'table' ? (
        <TestTilesTable 
          testTiles={testTiles} 
          view={view}
          onViewChange={setView}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <ViewToggle view={view} onChange={setView} />
          </div>
          <TestTilesGrid testTiles={testTiles} />
        </div>
      )}
    </PageLayout>
  )
} 