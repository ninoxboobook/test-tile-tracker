'use client'

import { ClayBody } from '@prisma/client'
import { ColumnDef, Table } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table/data-table'
import Link from 'next/link'

interface ClayBodiesTableProps {
  clayBodies: ClayBody[]
  table?: Table<ClayBody>
}

export const columns: ColumnDef<ClayBody>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link
        href={`/clay-bodies/${row.original.id}`}
        className="text-clay-600 hover:text-clay-500"
      >
        {row.getValue('name')}
      </Link>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'manufacturer',
    header: 'Manufacturer',
  },
  {
    accessorKey: 'cone',
    header: 'Cone',
  },
  {
    accessorKey: 'firingTemperature',
    header: 'Firing Temperature',
    cell: ({ row }) => {
      const temp = row.getValue('firingTemperature')
      return temp ? `${temp}°C` : ''
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

export function ClayBodiesTable({ clayBodies, table }: ClayBodiesTableProps) {
  return <DataTable columns={columns} data={clayBodies} table={table} />
}
