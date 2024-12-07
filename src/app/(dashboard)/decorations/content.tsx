'use client'

import { DecorationType, Cone, Atmosphere } from '@prisma/client'
import { useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { DecorationsTable, columns } from '@/components/decorations/decorations-table'
import { DecorationsGrid } from '@/components/decorations/decorations-grid'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { useViewPreference } from '@/hooks/use-view-preference'
import { DataViewToolbar } from '@/components/ui/data-view/data-view-toolbar'
import { PotentialFilter, FilterableColumnConfig } from '@/types/filters'
import { DecorationWithRelations } from '@/lib/schemas/decoration'
import Link from 'next/link'

interface DecorationsContentProps {
  decorations: DecorationWithRelations[]
}

// Define filterable columns configuration
const filterConfig: FilterableColumnConfig<'source' | 'type'> = {
  columns: ['source', 'type'] as const,
  getLabel: (columnId) => 
    columns.find(col => 'accessorKey' in col && col.accessorKey === columnId)?.header as string || columnId
}

type FilterableColumn = typeof filterConfig.columns[number]

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
    )).sort()

    if (uniqueCones.length > 0) {
      generatedFilters.push({
        id: 'cone' as FilterableColumn,
        label: 'Cone',
        options: uniqueCones.map(value => ({
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
          
          // Handle primitive fields (source, manufacturer, etc.)
          const value = decoration[filterId as 'source' | 'manufacturer' | 'colour']
          return typeof value === 'string' && values.includes(value)
        })
      })
      .filter(decoration => 
        decoration.name.toLowerCase().includes(search.toLowerCase())
      )
  }, [decorations, search, activeFilters])

  const table = useReactTable({
    data: filteredDecorations,
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
      title="Decorations"
      description="Manage your surface decorations and techniques"
      action={
        <Link href="/decorations/new">
          <ActionButton>Add New Decoration</ActionButton>
        </Link>
      }
    >
      <div className="space-y-4">
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
        {view === 'table' ? (
          <DecorationsTable 
            decorations={filteredDecorations}
            table={table}
          />
        ) : (
          <DecorationsGrid decorations={filteredDecorations} />
        )}
      </div>
    </PageLayout>
  )
}