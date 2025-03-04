'use client'

import { useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table'
import { TestTilesTable, columns } from '@/components/test-tiles/test-tiles-table'
import { TestTilesGrid } from '@/components/test-tiles/test-tiles-grid'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { useViewPreference } from '@/lib/hooks/use-view-preference'
import { DataViewToolbar } from '@/components/ui/data/data-view-toolbar'
import { PotentialFilter, FilterableColumnConfig } from '@/types/filters'
import { TestTileWithRelations } from '@/types/test-tile'
import Link from 'next/link'
import { sortCones } from '@/lib/utils/sort-cones'
import { SearchConfig } from '@/types/search'
import { DataTablePagination } from '@/components/ui/data/data-pagination'
import { EmptyState } from '@/components/ui/data/data-empty-state'

interface TestTilesContentProps {
  testTiles: TestTileWithRelations[]
}

// Define filterable columns configuration
const filterConfig: FilterableColumnConfig<'clayBody' | 'decorations' | 'collections' | 'cone' | 'atmosphere'> = {
  columns: ['clayBody', 'decorations', 'collections', 'cone', 'atmosphere'] as const,
  getLabel: (columnId) => {
    switch (columnId) {
      case 'clayBody':
        return 'Clay Body'
      case 'decorations':
        return 'Decorations'
      case 'collections':
        return 'Collections'
      case 'cone':
        return 'Cone'
      case 'atmosphere':
        return 'Atmosphere'
      default:
        return columnId
    }
  }
}

type FilterableColumn = typeof filterConfig.columns[number]

// Define searchable columns configuration
const searchConfig: SearchConfig = {
  columns: [
    { id: 'name', accessorPath: ['name'] },
    { id: 'stamp', accessorPath: ['stamp'] },
    { id: 'clayBody', accessorPath: ['clayBody', 'name'] },
    { id: 'decorations', accessorPath: ['decorationLayers', 'decorations', 'name'] },
    { id: 'collections', accessorPath: ['collections', 'name'] },
    { id: 'cone', accessorPath: ['cone', 'name'] },
    { id: 'atmosphere', accessorPath: ['atmosphere', 'name'] }
  ]
}

export function TestTilesContent({ testTiles }: TestTilesContentProps) {
  const [view, setView, columnVisibility, setColumnVisibility] = useViewPreference('test-tiles')
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, (string | number)[]>>({})

  const filters = useMemo(() => {
    const generatedFilters = filterConfig.columns.map(columnId => {
      let uniqueValues: string[] = []

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
        case 'cone':
          uniqueValues = Array.from(new Set(
            testTiles.map(item => item.cone.name)
              .filter(value => value.trim() !== '')
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
          break
        case 'atmosphere':
          uniqueValues = Array.from(new Set(
            testTiles.map(item => item.atmosphere.name)
              .filter(value => value.trim() !== '')
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
      .filter(testTile => {
        if (!search) return true
        const searchLower = search.toLowerCase()
        
        return searchConfig.columns.some(column => {
          // Handle array paths (like decorations and collections)
          if (column.id === 'decorations') {
            return testTile.decorationLayers.some(layer =>
              layer.decorations.some(d =>
                d.name.toLowerCase().includes(searchLower)
              )
            )
          }
          
          if (column.id === 'collections') {
            return testTile.collections.some(c =>
              c.name.toLowerCase().includes(searchLower)
            )
          }
          
          // Handle nested object paths (like clayBody, cone, atmosphere)
          if (column.id === 'clayBody') {
            return testTile.clayBody.name.toLowerCase().includes(searchLower)
          }

          if (column.id === 'cone') {
            return testTile.cone.name.toLowerCase().includes(searchLower)
          }

          if (column.id === 'atmosphere') {
            return testTile.atmosphere.name.toLowerCase().includes(searchLower)
          }
          
          // Handle direct properties
          const value = testTile[column.id as keyof typeof testTile]
          return typeof value === 'string' && value.toLowerCase().includes(searchLower)
        })
      })
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
            case 'cone':
              return values.includes(testTile.cone.name)
            case 'atmosphere':
              return values.includes(testTile.atmosphere.name)
            default:
              return true
          }
        })
      })
  }, [testTiles, search, activeFilters])

  const table = useReactTable({
    data: filteredTestTiles,
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
      title="Test Tiles"
      description="Document and track your test tiles"
      action={
        <Link href="/test-tiles/new">
          <ActionButton>Add new test tile</ActionButton>
        </Link>
      }
    >
      {testTiles.length === 0 ? (
        <EmptyState
          title="No test tiles"
          description="Add your first test tile to start documenting your ceramic experiments"
          action={
            <Link href="/test-tiles/new">
              <ActionButton>Add test tile</ActionButton>
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
          {filteredTestTiles.length === 0 ? (
            <EmptyState
              title="No results found"
              description="Try adjusting your search or filters"
              size="small"
            />
          ) : (
            <>
              {view === 'table' ? (
                <TestTilesTable 
                  testTiles={filteredTestTiles}
                  table={table}
                />
              ) : (
                <TestTilesGrid 
                  testTiles={filteredTestTiles}
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