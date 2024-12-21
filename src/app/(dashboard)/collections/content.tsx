'use client'

import { Collection, TestTile } from '@prisma/client'
import { useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table'
import { CollectionsTable, columns } from '@/components/collections/collections-table'
import { CollectionsGrid } from '@/components/collections/collections-grid'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { useViewPreference } from '@/lib/hooks/use-view-preference'
import { DataViewToolbar } from '@/components/ui/data/data-view-toolbar'
import { DataTablePagination } from '@/components/ui/data/data-table-pagination'
import Link from 'next/link'
import { SearchConfig } from '@/types/search'

type CollectionWithTiles = Collection & {
  testTiles: Pick<TestTile, 'id' | 'imageUrl'>[]
}

interface CollectionsContentProps {
  collections: CollectionWithTiles[]
}

export function CollectionsContent({ collections }: CollectionsContentProps) {
  const [view, setView, columnVisibility, setColumnVisibility] = useViewPreference('collections')
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, (string | number)[]>>({})

  // Define searchable columns configuration
  const searchConfig: SearchConfig = {
    columns: [
      { id: 'name', accessorPath: ['name'] },
      { id: 'description', accessorPath: ['description'] }
    ]
  }

  const filteredCollections = useMemo(() => {
    return collections
      .filter(collection => {
        if (!search) return true
        const searchLower = search.toLowerCase()
        
        return searchConfig.columns.some(column => {
          // Handle direct properties
          const value = collection[column.id as keyof typeof collection]
          return typeof value === 'string' && value.toLowerCase().includes(searchLower)
        })
      })
  }, [collections, search])

  const table = useReactTable({
    data: filteredCollections,
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  })

  return (
    <PageLayout 
      title="Collections"
      description="Organise your test tiles into collections"
      action={
        <Link href="/collections/new">
          <ActionButton>Add new collection</ActionButton>
        </Link>
      }
    >
      <div className="space-y-8">
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
          <CollectionsGrid 
            collections={filteredCollections}
            table={table}
          />
        )}
        <DataTablePagination table={table} />
      </div>
    </PageLayout>
  )
}