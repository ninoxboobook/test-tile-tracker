'use client'

import { ClayBody } from '@prisma/client'
import { useState } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, SortingState, ColumnFiltersState } from '@tanstack/react-table'
import { ClayBodiesTable } from './clay-bodies-table'
import { DataTablePagination } from '@/components/ui/data/data-pagination'

type ClayBodyWithRelations = {
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

interface ClayBodiesContentProps {
  clayBodies: ClayBodyWithRelations[]
}

export function ClayBodiesContent({ clayBodies }: ClayBodiesContentProps) {
  return (
    <div className="space-y-4">
      <ClayBodiesTable clayBodies={clayBodies} />
    </div>
  )
}
