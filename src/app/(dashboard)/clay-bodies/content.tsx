'use client'

import { ClayBody, ClayBodyType, Cone } from '@prisma/client'
import { useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { ClayBodiesTable, columns } from '@/components/clay-bodies/clay-bodies-table'
import { ClayBodiesGrid } from '@/components/clay-bodies/clay-bodies-grid'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { useViewPreference } from '@/hooks/use-view-preference'
import { DataViewToolbar } from '@/components/ui/data/data-view-toolbar'
import { PotentialFilter, FilterableColumnConfig } from '@/types/filters'
import Link from 'next/link'

interface ClayBodiesContentProps {
  clayBodies: (ClayBody & {
    type: ClayBodyType | null
    cone: Cone[]
  })[]
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
      let uniqueValues: string[] = [];

      switch (columnId) {
        case 'type':
          uniqueValues = Array.from(new Set(
            clayBodies
              .map(item => item.type?.name)
              .filter((value): value is string => 
                value !== null && 
                value !== undefined && 
                value.trim() !== ''
              )
          )).sort();
          break;
        
        case 'cone':
          uniqueValues = Array.from(new Set(
            clayBodies.flatMap(item => 
              item.cone.map(c => c.name)
            ).filter(value => value.trim() !== '')
          )).sort();
          break;
        
        case 'manufacturer':
          uniqueValues = Array.from(new Set(
            clayBodies
              .map(item => item.manufacturer)
              .filter((value): value is string => 
                value !== null && 
                value !== undefined && 
                value.trim() !== ''
              )
          )).sort();
          break;
      }

      if (uniqueValues.length === 0) {
        return null;
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

  const table = useReactTable({
    data: clayBodies,
    columns,
    state: {
      columnVisibility,
      globalFilter: search,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      if (typeof value === 'string') {
        return value.toLowerCase().includes(filterValue.toLowerCase())
      }
      return false
    },
    filterFns: {
      customFilter: (row, columnId, values) => {
        const value = row.getValue(columnId)
        if (!values.length) return true

        switch (columnId) {
          case 'type':
            const typeValue = (row.original as typeof clayBodies[number]).type?.name
            return typeValue !== null && values.includes(typeValue)
          
          case 'cone':
            const coneNames = (row.original as typeof clayBodies[number]).cone.map(c => c.name)
            return coneNames.some(name => values.includes(name))
          
          case 'manufacturer':
            const manufacturerValue = (row.original as typeof clayBodies[number]).manufacturer
            return manufacturerValue !== null && values.includes(manufacturerValue)
          
          default:
            return false
        }
      }
    }
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
            clayBodies={clayBodies}
            table={table}
          />
        ) : (
          <ClayBodiesGrid clayBodies={clayBodies} />
        )}
      </div>
    </PageLayout>
  )
} 