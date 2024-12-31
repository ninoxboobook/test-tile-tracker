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

type TestTile = {
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

const columns: ColumnDef<TestTile>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link href={`/test-tiles/${row.original.id}`} className="text-brand hover:text-brand/80">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: 'clayBody.name',
    header: 'Clay Body',
  },
  {
    accessorKey: 'decorations',
    header: 'Decorations',
    cell: ({ row }) => (
      <span>
        {row.original.decorationLayers.map(layer => 
          layer.decorations.map(d => d.name).join(', ')
        ).join(' + ')}
      </span>
    ),
  },
  {
    accessorKey: 'firing',
    header: 'Firing',
    cell: ({ row }) => (
      <span>{row.original.cone.name}, {row.original.atmosphere.name}</span>
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
    accessorKey: 'imageUrl',
    header: 'Images',
    cell: ({ row }) => row.original.imageUrl.length,
  },
  {
    accessorKey: '_count.collections',
    header: 'Collections',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
]

interface TestTilesTableProps {
  testTiles: TestTile[]
}

export function TestTilesTable({ testTiles }: TestTilesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: testTiles,
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
      <DataTable columns={columns} data={testTiles} table={table} />
      <DataTablePagination table={table} />
    </div>
  )
}
