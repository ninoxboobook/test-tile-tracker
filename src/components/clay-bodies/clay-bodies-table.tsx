'use client'

import { ClayBody } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table/data-table'
import Link from 'next/link'

interface ClayBodiesTableProps {
  clayBodies: ClayBody[]
  view: 'grid' | 'table'
  onViewChange: (view: 'grid' | 'table') => void
}

const columns: ColumnDef<ClayBody>[] = [
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
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleDateString()
    },
  },
]

export function ClayBodiesTable({ 
  clayBodies, 
  view, 
  onViewChange 
}: ClayBodiesTableProps) {
  return (
    <DataTable 
      columns={columns} 
      data={clayBodies} 
      filterColumn="name"
      view={view}
      onViewChange={onViewChange}
    />
  )
}
