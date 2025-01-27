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
  isOwner?: boolean
}

export function TestTileCollections({ collections, testTileId, isOwner = false }: TestTileCollectionsProps) {
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
        description={isOwner 
          ? "Create a new collection and add this test tile to it, or edit the test tile to add it to an existing collection."
          : "This test tile hasn't been added to any collections yet."}
        action={isOwner ? (
          <Link href={`/collections/new`}>
            <ActionButton>Create collection</ActionButton>
          </Link>
        ) : undefined}
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
