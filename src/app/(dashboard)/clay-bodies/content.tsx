'use client'

import { ClayBody, ClayBodyType, Cone } from '@prisma/client'
import { useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table'
import { ClayBodiesTable, columns } from '@/components/clay-bodies/clay-bodies-table'
import { ClayBodiesGrid } from '@/components/clay-bodies/clay-bodies-grid'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { useViewPreference } from '@/lib/hooks/use-view-preference'
import { DataViewToolbar } from '@/components/ui/data/data-view-toolbar'
import { PotentialFilter, FilterableColumnConfig } from '@/types/filters'
import { SearchConfig } from '@/types/search'
import Link from 'next/link'
import { sortCones } from '@/lib/utils/sort-cones'
import { DataTablePagination } from '@/components/ui/data/data-table-pagination'

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

// Define searchable columns configuration
const searchConfig: SearchConfig = {
  columns: [
    { id: 'name', accessorPath: ['name'] },
    { id: 'manufacturer', accessorPath: ['manufacturer'] },
    { id: 'type', accessorPath: ['type', 'name'] },
    { id: 'cone', accessorPath: ['cone', 'name'] }
  ]
}

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
          ))
          // Sort the cone values using the sortCones utility
          uniqueValues = sortCones(
            uniqueValues.map(name => ({ 
              id: '', 
              name,
              createdAt: new Date('2024-12-10T23:56:52+11:00'),
              updatedAt: new Date('2024-12-10T23:56:52+11:00')
            }))
          ).map(cone => cone.name)
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

  const filteredClayBodies = useMemo(() => {
    return clayBodies
      .filter(clayBody => {
        if (!search) return true
        const searchLower = search.toLowerCase()
        
        return searchConfig.columns.some(column => {
          // Handle array paths (like cone)
          if (column.id === 'cone') {
            return clayBody.cone.some(c =>
              c.name.toLowerCase().includes(searchLower)
            )
          }
          
          // Handle nested object paths (like type)
          if (column.id === 'type') {
            return clayBody.type?.name.toLowerCase().includes(searchLower) ?? false
          }
          
          // Handle direct properties
          const value = clayBody[column.id as keyof typeof clayBody]
          return typeof value === 'string' && value.toLowerCase().includes(searchLower)
        })
      })
      .filter(clayBody => {
        return Object.entries(activeFilters).every(([filterId, values]) => {
          if (values.length === 0) return true
          
          switch (filterId as FilterableColumn) {
            case 'type':
              return clayBody.type && values.includes(clayBody.type.name)
            case 'cone':
              return clayBody.cone.some(c => values.includes(c.name))
            case 'manufacturer':
              return clayBody.manufacturer && values.includes(clayBody.manufacturer)
            default:
              return true
          }
        })
      })
  }, [clayBodies, search, activeFilters])

  const table = useReactTable({
    data: filteredClayBodies,
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
      title="Clay Bodies"
      description="Manage your catalogue of clay bodies"
      action={
        <Link href="/clay-bodies/new">
          <ActionButton>Add new clay body</ActionButton>
        </Link>
      }
    >
      <div className="space-y-8">
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
          <ClayBodiesGrid 
            clayBodies={filteredClayBodies}
            table={table}
          />
        )}
        <DataTablePagination table={table} />
      </div>
    </PageLayout>
  )
} 