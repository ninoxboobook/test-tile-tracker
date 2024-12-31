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

type Decoration = {
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

const columns: ColumnDef<Decoration>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link href={`/decorations/${row.original.id}`} className="text-brand hover:text-brand/80">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: 'type.name',
    header: 'Type',
  },
  {
    accessorKey: 'user',
    header: 'Created By',
    cell: ({ row }) => (
      <span>{row.original.user.username || row.original.user.email}</span>
    ),
  },
  {
    accessorKey: '_count.decorationLayers',
    header: 'Decoration Layers',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
]

interface DecorationsTableProps {
  decorations: Decoration[]
}

export function DecorationsTable({ decorations }: DecorationsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: decorations,
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
      <DataTable columns={columns} data={decorations} table={table} />
      <DataTablePagination table={table} />
    </div>
  )
}
