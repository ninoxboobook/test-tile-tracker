'use client'

import { Decoration, DecorationCategory, Cone, Atmosphere } from '@prisma/client'
import { ColumnDef, Table } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table/data-table'
import Link from 'next/link'

interface DecorationsTableProps {
  decorations: (Decoration & {
    category: DecorationCategory[]
    cone: Cone[]
    atmosphere: Atmosphere[]
  })[]
  table?: Table<Decoration & {
    category: DecorationCategory[]
    cone: Cone[]
    atmosphere: Atmosphere[]
  }>
}

export const columns: ColumnDef<Decoration & {
  category: DecorationCategory[]
  cone: Cone[]
  atmosphere: Atmosphere[]
}>[] = [
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
    id: 'category',
    header: 'Category',
    accessorFn: (row) => row.category.map(cat => cat.name).join(', '),
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    id: 'cone',
    header: 'Cone',
    accessorFn: (row) => row.cone.map(c => c.name).join(', '),
  },
  {
    id: 'atmosphere',
    header: 'Atmosphere',
    accessorFn: (row) => row.atmosphere.map(a => a.name).join(', '),
  },
  {
    accessorKey: 'colour',
    header: 'Colour',
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
