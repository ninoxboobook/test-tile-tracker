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
import { EmptyState } from '@/components/ui/data/data-empty-state'

interface ClayBodyTestTilesProps {
  testTiles: TestTileWithRelations[]
  clayBodyId: string
  isOwner?: boolean
}

// Define filterable columns configuration
const filterConfig: FilterableColumnConfig<'decorations' | 'collections' | 'cone' | 'atmosphere'> = {
  columns: ['decorations', 'collections', 'cone', 'atmosphere'] as const,
  getLabel: (columnId) => {
    switch (columnId) {
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

export function ClayBodyTestTiles({ testTiles, clayBodyId, isOwner = false }: ClayBodyTestTilesProps) {
  const [view, setView, columnVisibility, setColumnVisibility] = useViewPreference('clay-body-test-tiles')
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, (string | number)[]>>({})

  const filters = useMemo(() => {
    const generatedFilters = filterConfig.columns.map(columnId => {
      let uniqueValues: string[] = []

      // Handle different relation types
      switch (columnId) {
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
          case 'decorations':
            return testTile.decorationLayers.some(layer =>
              layer.decorations.some(d =>
                selectedValues.includes(d.name)
              )
            )
          case 'collections':
            return testTile.collections.some(c =>
              selectedValues.includes(c.name)
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
      <EmptyState
        title="No test tiles"
        description={isOwner 
          ? "Create a test tile using this clay body to start exploring its properties"
          : "No test tiles have been created with this clay body yet."}
        action={isOwner ? (
          <Link href={`/test-tiles/new?clayBodyId=${clayBodyId}`}>
            <ActionButton>Create Test Tile</ActionButton>
          </Link>
        ) : undefined}
      />
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
