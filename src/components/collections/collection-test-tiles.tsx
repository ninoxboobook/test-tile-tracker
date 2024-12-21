'use client'

import { useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { TestTilesTable, columns } from '@/components/test-tiles/test-tiles-table'
import { TestTilesGrid } from '@/components/test-tiles/test-tiles-grid'
import { DataViewToolbar } from '@/components/ui/data/data-view-toolbar'
import { useViewPreference } from '@/lib/hooks/use-view-preference'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { TestTileWithRelations } from '@/types/test-tile'
import { PotentialFilter, FilterableColumnConfig } from '@/types/filters'
import Link from 'next/link'
import { sortCones } from '@/lib/utils/sort-cones'

interface CollectionTestTilesProps {
  testTiles: TestTileWithRelations[]
  collectionId: string
}

// Define filterable columns configuration
const filterConfig: FilterableColumnConfig<'clayBody' | 'decorations' | 'cone' | 'atmosphere'> = {
  columns: ['clayBody', 'decorations', 'cone', 'atmosphere'] as const,
  getLabel: (columnId) => {
    switch (columnId) {
      case 'clayBody':
        return 'Clay Body'
      case 'decorations':
        return 'Decorations'
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

export function CollectionTestTiles({ testTiles, collectionId }: CollectionTestTilesProps) {
  const [view, setView, columnVisibility, setColumnVisibility] = useViewPreference('collection-test-tiles')
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
        case 'cone':
          uniqueValues = Array.from(new Set(
            testTiles.map(item => item.cone.name)
              .filter(value => value.trim() !== '')
          ))
          uniqueValues = sortCones(
            uniqueValues.map(name => ({ 
              id: '', 
              name,
              createdAt: new Date(),
              updatedAt: new Date()
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

      const filter: PotentialFilter<FilterableColumn> = {
        id: columnId,
        label: filterConfig.getLabel(columnId),
        options: uniqueValues.map(value => ({
          label: value,
          value: value
        }))
      }

      return filter
    })

    return generatedFilters
  }, [testTiles])

  const filteredTestTiles = useMemo(() => {
    return testTiles.filter(testTile => {
      // Search filter
      const matchesSearch = testTile.name.toLowerCase().includes(search.toLowerCase())
      if (!matchesSearch) return false

      // Active filters
      return Object.entries(activeFilters).every(([columnId, selectedValues]) => {
        if (selectedValues.length === 0) return true

        switch (columnId) {
          case 'clayBody':
            return testTile.clayBody && selectedValues.includes(testTile.clayBody.name)
          case 'decorations':
            return testTile.decorationLayers.some(layer =>
              layer.decorations.some(d =>
                selectedValues.includes(d.name)
              )
            )
          case 'cone':
            return selectedValues.includes(testTile.cone.name)
          case 'atmosphere':
            return selectedValues.includes(testTile.atmosphere.name)
          default:
            return true
        }
      })
    })
  }, [testTiles, search, activeFilters])

  const tableOptions = useMemo(() => ({
    data: filteredTestTiles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
  }), [filteredTestTiles, columnVisibility])

  const table = useReactTable(tableOptions)

  if (testTiles.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-clay-700 mb-2">No test tiles yet</h3>
        <p className="text-sm text-clay-500 mb-4">Add test tiles to this collection to start organizing your work.</p>
        <Link href={`/test-tiles/new?collectionId=${collectionId}`}>
          <ActionButton>Create Test Tile</ActionButton>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DataViewToolbar
        view={view}
        onViewChange={setView}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search test tiles..."
        table={view === 'table' ? table : undefined}
        activeFilters={activeFilters}
        onFilterChange={(filterId, values) => {
          setActiveFilters(prev => ({
            ...prev,
            [filterId]: values
          }))
        }}
        filters={filters}
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
  )
}
