'use client'

import { ClayBody } from '@prisma/client'
import { useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { ClayBodiesTable, columns } from '@/components/clay-bodies/clay-bodies-table'
import { ClayBodiesGrid } from '@/components/clay-bodies/clay-bodies-grid'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { useViewPreference } from '@/hooks/use-view-preference'
import { DataViewToolbar } from '@/components/ui/data-view/data-view-toolbar'
import { PotentialFilter, FilterableColumnConfig } from '@/types/filters'
import Link from 'next/link'

interface ClayBodiesContentProps {
  clayBodies: ClayBody[]
}

// Define filterable columns configuration
const filterConfig: FilterableColumnConfig<'type' | 'cone' | 'manufacturer'> = {
  columns: ['type', 'cone', 'manufacturer'] as const,
  getLabel: (columnId) => 
    columns.find(col => 'accessorKey' in col && col.accessorKey === columnId)?.header as string || columnId
}

type FilterableColumn = typeof filterConfig.columns[number]

export function ClayBodiesContent({ clayBodies }: ClayBodiesContentProps) {
  const [view, setView, columnVisibility, setColumnVisibility] = useViewPreference('clay-bodies')
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, (string | number)[]>>({})

  const filters = useMemo(() => {
    const generatedFilters = filterConfig.columns.map(columnId => {
      const uniqueValues = Array.from(new Set(
        clayBodies
          .map(item => item[columnId])
          .filter((value): value is string => 
            value !== null && 
            value !== undefined && 
            value.trim() !== ''
          )
      )).sort()

      if (uniqueValues.length === 0) {
        return null
      }

      return {
        id: columnId,
        label: filterConfig.getLabel(columnId),
        options: uniqueValues.map(value => ({
          label: String(value),
          value: value
        }))
      }
    })

    return generatedFilters.filter((filter): filter is PotentialFilter<FilterableColumn> => filter !== null)
  }, [clayBodies])

  const filteredClayBodies = useMemo(() => {
    return clayBodies
      .filter(clayBody => 
        clayBody.name.toLowerCase().includes(search.toLowerCase())
      )
      .filter(clayBody => {
        return Object.entries(activeFilters).every(([filterId, values]) => {
          if (values.length === 0) return true
          const value = clayBody[filterId as FilterableColumn]
          return value !== null && values.includes(value)
        })
      })
  }, [clayBodies, search, activeFilters])

  const table = useReactTable({
    data: filteredClayBodies,
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
      title="Clay Bodies"
      description="Manage your clay body recipes and specifications"
      action={
        <Link href="/clay-bodies/new">
          <ActionButton>Add New Clay Body</ActionButton>
        </Link>
      }
    >
      <div className="space-y-4">
        <DataViewToolbar
          view={view}
          onViewChange={setView}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search clay bodies..."
          table={view === 'table' ? table : undefined}
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={(filterId, values) => {
            setActiveFilters(prev => ({
              ...prev,
              [filterId]: values
            }))
          }}
        />
        {view === 'table' ? (
          <ClayBodiesTable 
            clayBodies={filteredClayBodies}
            table={table}
          />
        ) : (
          <ClayBodiesGrid clayBodies={filteredClayBodies} />
        )}
      </div>
    </PageLayout>
  )
} 