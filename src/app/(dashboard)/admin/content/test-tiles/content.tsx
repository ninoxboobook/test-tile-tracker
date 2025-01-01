'use client'

import { useState } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, SortingState, ColumnFiltersState } from '@tanstack/react-table'
import { TestTilesTable } from './test-tiles-table'
import { DataTablePagination } from '@/components/ui/data/data-pagination'

type TestTileWithRelations = {
  id: string
  name: string
  clayBody: {
    name: string
  }
  decorationLayers: {
    decorations: {
      name: string
    }[]
  }[]
  cone: {
    name: string
  }
  atmosphere: {
    name: string
  }
  user: {
    username: string | null
    email: string
  }
  imageUrl: string[]
  createdAt: string
  updatedAt: string
  _count: {
    collections: number
  }
}

interface TestTilesContentProps {
  testTiles: TestTileWithRelations[]
}

export function TestTilesContent({ testTiles }: TestTilesContentProps) {
  return (
    <div className="space-y-4">
      <TestTilesTable testTiles={testTiles} />
    </div>
  )
}
