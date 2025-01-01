'use client'

import { useState } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, SortingState, ColumnFiltersState } from '@tanstack/react-table'
import { DecorationsTable } from './decorations-table'
import { DataTablePagination } from '@/components/ui/data/data-pagination'

type DecorationWithRelations = {
  id: string
  name: string
  type: {
    name: string
  }
  user: {
    username: string | null
    email: string
  }
  createdAt: string
  updatedAt: string
  _count: {
    decorationLayers: number
  }
}

interface DecorationsContentProps {
  decorations: DecorationWithRelations[]
}

export function DecorationsContent({ decorations }: DecorationsContentProps) {
  return (
    <div className="space-y-4">
      <DecorationsTable decorations={decorations} />
    </div>
  )
}
