'use client'

import { Decoration, DecorationType, Cone, Atmosphere } from '@prisma/client'
import { ColumnDef, Table } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table/data-table'
import Link from 'next/link'
import { DecorationWithRelations } from '@/lib/schemas/decoration'

interface DecorationsTableProps {
  decorations: DecorationWithRelations[]
  table?: Table<DecorationWithRelations>
}

export const columns: ColumnDef<DecorationWithRelations>[] = [
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
    accessorKey: 'source',
    header: 'Source',
  },
  {
    id: 'type',
    header: 'Type',
    accessorFn: (row) => row.type.name,
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
    accessorKey: 'manufacturer',
    header: 'Manufacturer',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return date.toLocaleDateString()
    },
  },
]

export function DecorationsTable({ decorations, table }: DecorationsTableProps) {
  return <DataTable columns={columns} data={decorations} table={table} />
}
