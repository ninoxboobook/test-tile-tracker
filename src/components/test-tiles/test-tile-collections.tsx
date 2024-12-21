'use client'

import { Collection, TestTile } from '@prisma/client'
import { useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { CollectionsTable, columns } from '@/components/collections/collections-table'
import { CollectionsGrid } from '@/components/collections/collections-grid'
import { DataViewToolbar } from '@/components/ui/data/data-view-toolbar'
import { useViewPreference } from '@/lib/hooks/use-view-preference'
import { ActionButton } from '@/components/ui/buttons/action-button'
import Link from 'next/link'
import { EmptyState } from '@/components/ui/data/data-empty-state'

type CollectionWithTiles = Collection & {
  testTiles: Pick<TestTile, 'id' | 'imageUrl'>[]
}

interface TestTileCollectionsProps {
  collections: CollectionWithTiles[]
  testTileId: string
}

export function TestTileCollections({ collections, testTileId }: TestTileCollectionsProps) {
  const [view, setView, columnVisibility, setColumnVisibility] = useViewPreference('test-tile-collections')
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, (string | number)[]>>({})

  const filteredCollections = useMemo(() => {
    return collections.filter(collection => 
      collection.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [collections, search])

  const tableOptions = useMemo(() => ({
    data: filteredCollections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
  }), [filteredCollections, columnVisibility])

  const table = useReactTable(tableOptions)

  if (collections.length === 0) {
    return (
      <EmptyState
        title="No collections"
        description="Create a collection to start organizing your test tiles"
        action={
          <Link href={`/test-tiles/${testTileId}/add-to-collection`}>
            <ActionButton>Create collection</ActionButton>
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      <DataViewToolbar
        view={view}
        onViewChange={setView}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search collections..."
        table={view === 'table' ? table : undefined}
        activeFilters={activeFilters}
        onFilterChange={(filterId, values) => {
          setActiveFilters(prev => ({
            ...prev,
            [filterId]: values
          }))
        }}
      />
      {view === 'table' ? (
        <CollectionsTable 
          collections={filteredCollections}
          table={table}
        />
      ) : (
        <CollectionsGrid collections={filteredCollections} />
      )}
    </div>
  )
}
