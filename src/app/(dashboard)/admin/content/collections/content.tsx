'use client'

import { useState } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, SortingState, ColumnFiltersState } from '@tanstack/react-table'
import { CollectionsTable } from './collections-table'
import { DataTablePagination } from '@/components/ui/data/data-pagination'

type CollectionWithRelations = {
  id: string
  name: string
  user: {
    username: string | null
    email: string
  }
  createdAt: string
  updatedAt: string
  _count: {
    testTiles: number
  }
}

interface CollectionsContentProps {
  collections: CollectionWithRelations[]
}

export function CollectionsContent({ collections }: CollectionsContentProps) {
  return (
    <div className="space-y-4">
      <CollectionsTable collections={collections} />
    </div>
  )
}
