'use client'

import { useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { TestTilesTable, columns } from '@/components/test-tiles/test-tiles-table'
import { TestTilesGrid } from '@/components/test-tiles/test-tiles-grid'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { useViewPreference } from '@/hooks/use-view-preference'
import { DataViewToolbar } from '@/components/ui/data-view/data-view-toolbar'
import { PotentialFilter, FilterableColumnConfig } from '@/types/filters'
import { TestTileWithRelations } from '@/types/test-tile'
import Link from 'next/link'

interface TestTilesContentProps {
  testTiles: TestTileWithRelations[]
}

// Define filterable columns configuration
const filterConfig: FilterableColumnConfig<'clayBody' | 'decorations' | 'collections'> = {
  columns: ['clayBody', 'decorations', 'collections'] as const,
  getLabel: (columnId) => {
    switch (columnId) {
      case 'clayBody':
        return 'Clay Body'
      case 'decorations':
        return 'Decorations'
      case 'collections':
        return 'Collections'
      default:
        return columnId
    }
  }
}

type FilterableColumn = typeof filterConfig.columns[number]

export function TestTilesContent({ testTiles }: TestTilesContentProps) {
  const [view, setView, columnVisibility, setColumnVisibility] = useViewPreference('test-tiles')
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, (string | number)[]>>({})

  const filters = useMemo(() => {
    const generatedFilters = filterConfig.columns.map(columnId => {
      let uniqueValues: string[] = []

      // Handle different relation types
      switch (columnId) {
        case 'clayBody':
          uniqueValues = Array.from(new Set(
            testTiles
              .map(item => item.clayBody?.name)
              .filter((value): value is string => 
                value !== null && 
                value !== undefined && 
                value.trim() !== ''
              )
          )).sort()
          break
        case 'decorations':
          uniqueValues = Array.from(new Set(
            testTiles.flatMap(item => 
              item.decorationLayers.flatMap(layer => 
                layer.decorations.map(d => d.name)
              )
            ).filter(value => value.trim() !== '')
          )).sort()
          break
        case 'collections':
          uniqueValues = Array.from(new Set(
            testTiles.flatMap(item => 
              item.collections.map(c => c.name)
            ).filter(value => value.trim() !== '')
          )).sort()
          break
      }

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
  }, [testTiles])

  const filteredTestTiles = useMemo(() => {
    return testTiles
      .filter(testTile => 
        testTile.name.toLowerCase().includes(search.toLowerCase())
      )
      .filter(testTile => {
        return Object.entries(activeFilters).every(([filterId, values]) => {
          if (values.length === 0) return true
          
          switch (filterId as FilterableColumn) {
            case 'clayBody':
              return values.includes(testTile.clayBody.name)
            case 'decorations':
              return testTile.decorationLayers.some(layer => 
                layer.decorations.some(d => values.includes(d.name))
              )
            case 'collections':
              return testTile.collections.some(c => values.includes(c.name))
            default:
              return true
          }
        })
      })
  }, [testTiles, search, activeFilters])

  const table = useReactTable({
    data: filteredTestTiles,
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
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search test tiles..."
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