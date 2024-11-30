'use client'

import { Collection, TestTile } from '@prisma/client'
import { useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { CollectionsTable, columns } from '@/components/collections/collections-table'
import { CollectionsGrid } from '@/components/collections/collections-grid'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { useViewPreference } from '@/hooks/use-view-preference'
import { DataViewToolbar } from '@/components/ui/data-view/data-view-toolbar'
import Link from 'next/link'

type CollectionWithTiles = Collection & {
  testTiles: Pick<TestTile, 'id' | 'imageUrl'>[]
}

interface CollectionsContentProps {
  collections: CollectionWithTiles[]
}

export function CollectionsContent({ collections }: CollectionsContentProps) {
  const [view, setView, columnVisibility, setColumnVisibility] = useViewPreference('collections')
  const [search, setSearch] = useState('')

  const filteredCollections = useMemo(() => {
    return collections.filter(collection => 
      collection.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [collections, search])

  const table = useReactTable({
    data: filteredCollections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
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
      <div className="space-y-4">
        <DataViewToolbar
          view={view}
          onViewChange={setView}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search collections..."
          table={view === 'table' ? table : undefined}
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
    </PageLayout>
  )
}