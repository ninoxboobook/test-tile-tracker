'use client'

import { Decoration } from '@prisma/client'
import { ColumnDef, Table } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table/data-table'
import Link from 'next/link'

interface DecorationsTableProps {
  decorations: Decoration[]
  table?: Table<Decoration>
}

export const columns: ColumnDef<Decoration>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link
        href={`/decorations/${row.original.id}`}
        className="text-clay-600 hover:text-clay-500"
      >
        {row.getValue('name')}
      </Link>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      return description ? description.slice(0, 100) + (description.length > 100 ? '...' : '') : ''
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return date.toISOString().split('T')[0]
    },
  },
]

export function DecorationsTable({ decorations, table }: DecorationsTableProps) {
  return <DataTable columns={columns} data={decorations} table={table} />
}
