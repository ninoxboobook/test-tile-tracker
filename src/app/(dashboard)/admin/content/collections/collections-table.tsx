'use client'

import Link from 'next/link'
import { DataTable } from '@/components/ui/data/data-table'
import { DataTablePagination } from '@/components/ui/data/data-pagination'
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { useState } from 'react'

type Collection = {
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

const columns: ColumnDef<Collection>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link href={`/collections/${row.original.id}`} className="text-brand hover:text-brand/80">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: 'user',
    header: 'Created By',
    cell: ({ row }) => (
      <span>{row.original.user.username || row.original.user.email}</span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    },
  },
  {
    accessorKey: '_count.testTiles',
    header: 'Test Tiles',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    },
  },
]

interface CollectionsTableProps {
  collections: Collection[]
}

export function CollectionsTable({ collections }: CollectionsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: collections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="space-y-6">
      <DataTable columns={columns} data={collections} table={table} />
      <DataTablePagination table={table} />
    </div>
  )
}
