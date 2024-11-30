'use client'

import { TestTile, ClayBody, Collection, Decoration } from '@prisma/client'
import { useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { TestTilesTable, columns } from '@/components/test-tiles/test-tiles-table'
import { TestTilesGrid } from '@/components/test-tiles/test-tiles-grid'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { useViewPreference } from '@/hooks/use-view-preference'
import { DataViewToolbar } from '@/components/ui/data-view/data-view-toolbar'
import Link from 'next/link'

type TestTileWithRelations = TestTile & {
  clayBody: ClayBody
  collections: Collection[]
  decorations: Decoration[]
}

interface TestTilesContentProps {
  testTiles: TestTileWithRelations[]
}

export function TestTilesContent({ testTiles }: TestTilesContentProps) {
  const [view, setView] = useViewPreference('test-tiles')
  const [filter, setFilter] = useState('')

  const filteredTestTiles = useMemo(() => {
    return testTiles.filter(testTile => 
      testTile.name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [testTiles, filter])

  const table = useReactTable({
    data: filteredTestTiles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
      <div className="space-y-4">
        <DataViewToolbar
          view={view}
          onViewChange={setView}
          filter={filter}
          onFilterChange={setFilter}
          filterPlaceholder="Filter test tiles..."
          table={view === 'table' ? table : undefined}
        />
        {view === 'table' ? (
          <TestTilesTable 
            testTiles={filteredTestTiles}
            table={table}
          />
        ) : (
          <TestTilesGrid testTiles={filteredTestTiles} />
        )}
      </div>
    </PageLayout>
  )
} 