'use client'

import { DecorationType, Cone, Atmosphere } from '@prisma/client'
import { useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table'
import { DecorationsTable, columns } from '@/components/decorations/decorations-table'
import { DecorationsGrid } from '@/components/decorations/decorations-grid'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { useViewPreference } from '@/lib/hooks/use-view-preference'
import { DataViewToolbar } from '@/components/ui/data/data-view-toolbar'
import { PotentialFilter, FilterableColumnConfig } from '@/types/filters'
import { DecorationWithRelations } from '@/lib/schemas/decoration'
import Link from 'next/link'
import { sortCones } from '@/lib/utils/sort-cones'
import { SearchConfig } from '@/types/search'
import { DataTablePagination } from '@/components/ui/data/data-pagination'
import { EmptyState } from '@/components/ui/data/data-empty-state'

interface DecorationsContentProps {
  decorations: DecorationWithRelations[]
}

// Define filterable columns configuration
const filterConfig: FilterableColumnConfig<'source' | 'type' | 'colour'> = {
  columns: ['source', 'type', 'colour'] as const,
  getLabel: (columnId) => 
    columns.find(col => 
      ('accessorKey' in col && col.accessorKey === columnId) ||
      ('id' in col && col.id === columnId)
    )?.header as string || columnId
}

type FilterableColumn = typeof filterConfig.columns[number]

// Define searchable columns configuration
const searchConfig: SearchConfig = {
  columns: [
    { id: 'name', accessorPath: ['name'] },
    { id: 'source', accessorPath: ['source'] },
    { id: 'manufacturer', accessorPath: ['manufacturer'] },
    { id: 'colour', accessorPath: ['colour'] },
    { id: 'type', accessorPath: ['type', 'name'] },
    { id: 'cone', accessorPath: ['cone', 'name'] },
    { id: 'atmosphere', accessorPath: ['atmosphere', 'name'] }
  ]
}

// Color categories in display order
const COLOR_CATEGORIES = [
  'Red',
  'Pink',
  'Purple',
  'Blue',
  'Turquoise',
  'Green',
  'Yellow',
  'Orange',
  'White',
  'Grey',
  'Brown',
  'Black',
] as const;

export function DecorationsContent({ decorations }: DecorationsContentProps) {
  const [view, setView, columnVisibility, setColumnVisibility] = useViewPreference('decorations')
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, (string | number)[]>>({})

  const filters = useMemo(() => {
    const generatedFilters = filterConfig.columns.map(columnId => {
      let uniqueValues: string[]
      
      if (columnId === 'type') {
        uniqueValues = Array.from(new Set(
          decorations
            .map(item => item.type.name)
            .filter(Boolean)
        )).sort()
      } else if (columnId === 'colour') {
        uniqueValues = Array.from(new Set(
          decorations
            .map(item => {
              if (!item.colour) return null;
              try {
                const { category } = JSON.parse(item.colour);
                return category;
              } catch {
                return null;
              }
            })
            .filter(Boolean)
        )).sort((a, b) => {
          // Sort by the predefined order
          return COLOR_CATEGORIES.indexOf(a as any) - COLOR_CATEGORIES.indexOf(b as any);
        });
      } else {
        uniqueValues = Array.from(new Set(
          decorations
            .map(item => item[columnId])
            .filter((value): value is string => 
              value !== null && 
              value !== undefined && 
              value.trim() !== ''
            )
        )).sort()
      }

      if (uniqueValues.length === 0) {
        return null
      }

      return {
        id: columnId,
        label: filterConfig.getLabel(columnId),
        options: uniqueValues.map(value => ({
          value,
          label: value,
        }))
      } satisfies PotentialFilter<FilterableColumn>
    }).filter((filter): filter is PotentialFilter<FilterableColumn> => filter !== null)

    // Add cones filter
    const uniqueCones = Array.from(new Set(
      decorations.flatMap(item => 
        item.cone.map(c => c.name)
      )
    ))
    
    if (uniqueCones.length > 0) {
      // Sort the cone values using the sortCones utility
      const sortedCones = sortCones(
        uniqueCones.map(name => ({ 
          id: '', 
          name,
          createdAt: new Date('2024-12-10T23:58:50+11:00'),
          updatedAt: new Date('2024-12-10T23:58:50+11:00')
        }))
      ).map(cone => cone.name)

      generatedFilters.push({
        id: 'cone' as FilterableColumn,
        label: 'Cone',
        options: sortedCones.map(value => ({
          value,
          label: value,
        }))
      })
    }

    // Add atmospheres filter
    const uniqueAtmospheres = Array.from(new Set(
      decorations.flatMap(item => 
        item.atmosphere.map(a => a.name)
      )
    )).sort()

    if (uniqueAtmospheres.length > 0) {
      generatedFilters.push({
        id: 'atmosphere' as FilterableColumn,
        label: 'Atmosphere',
        options: uniqueAtmospheres.map(value => ({
          value,
          label: value,
        }))
      })
    }

    return generatedFilters
  }, [decorations])

  const filteredDecorations = useMemo(() => {
    return decorations
      .filter(decoration => {
        if (!search) return true
        const searchLower = search.toLowerCase()
        
        return searchConfig.columns.some(column => {
          // Handle array paths (like cone and atmosphere)
          if (column.id === 'cone') {
            return decoration.cone.some(c =>
              c.name.toLowerCase().includes(searchLower)
            )
          }
          
          if (column.id === 'atmosphere') {
            return decoration.atmosphere.some(a =>
              a.name.toLowerCase().includes(searchLower)
            )
          }
          
          // Handle nested object paths (like type)
          if (column.id === 'type') {
            return decoration.type.name.toLowerCase().includes(searchLower)
          }
          
          // Handle direct properties
          const value = decoration[column.id as keyof typeof decoration]
          return typeof value === 'string' && value.toLowerCase().includes(searchLower)
        })
      })
      .filter(decoration => {
        return Object.entries(activeFilters).every(([filterId, values]) => {
          if (values.length === 0) return true
          
          if (filterId === 'type') {
            return values.includes(decoration.type.name)
          }
          if (filterId === 'cone') {
            return decoration.cone.some(c => values.includes(c.name))
          }
          if (filterId === 'atmosphere') {
            return decoration.atmosphere.some(a => values.includes(a.name))
          }
          if (filterId === 'colour') {
            try {
              if (!decoration.colour) return false;
              const { category } = JSON.parse(decoration.colour);
              return values.includes(category);
            } catch {
              return false;
            }
          }
          
          // Handle primitive fields (source, manufacturer)
          const value = decoration[filterId as 'source' | 'manufacturer']
          return typeof value === 'string' && values.includes(value)
        })
      })
  }, [decorations, search, activeFilters])

  const table = useReactTable({
    data: filteredDecorations,
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
      title="Decorations"
      description="Manage your catalogue of glazes, oxides, slips and other decorations"
      action={
        <Link href="/decorations/new">
          <ActionButton>Add new decoration</ActionButton>
        </Link>
      }
    >
      {decorations.length === 0 ? (
        <EmptyState
          title="No decorations"
          description="Add your first decoration to start tracking your glazes, oxides, slips and more"
          action={
            <Link href="/decorations/new">
              <ActionButton>Add decoration</ActionButton>
            </Link>
          }
        />
      ) : (
        <div className="space-y-8">
          <DataViewToolbar
            view={view}
            onViewChange={setView}
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search decorations..."
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
          {filteredDecorations.length === 0 ? (
            <EmptyState
              title="No results found"
              description="Try adjusting your search or filters"
              size="small"
            />
          ) : (
            <>
              {view === 'table' ? (
                <DecorationsTable 
                  decorations={filteredDecorations}
                  table={table}
                />
              ) : (
                <DecorationsGrid 
                  decorations={filteredDecorations}
                  table={table}
                />
              )}
              <DataTablePagination table={table} />
            </>
          )}
        </div>
      )}
    </PageLayout>
  )
}