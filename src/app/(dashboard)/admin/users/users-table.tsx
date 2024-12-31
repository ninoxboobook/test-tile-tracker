'use client'

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

type User = {
  id: string
  email: string
  username: string | null
  role: string
  createdAt: string
  updatedAt: string
  _count: {
    testTiles: number
    decorations: number
    clayBodies: number
    collections: number
  }
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => (
      <span>{row.original.username || row.original.email}</span>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: '_count.testTiles',
    header: 'Test Tiles',
  },
  {
    accessorKey: '_count.decorations',
    header: 'Decorations',
  },
  {
    accessorKey: '_count.clayBodies',
    header: 'Clay Bodies',
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

interface UsersTableProps {
  users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: users,
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
      <DataTable columns={columns} data={users} table={table} />
      <DataTablePagination table={table} />
    </div>
  )
}
