'use client'

import { Decoration } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table/data-table'
import Link from 'next/link'

interface DecorationsTableProps {
  decorations: Decoration[]
  view: 'grid' | 'table'
  onViewChange: (view: 'grid' | 'table') => void
}

const columns: ColumnDef<Decoration>[] = [
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
    accessorKey: 'type',
    header: 'Category',
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
    accessorKey: 'atmosphere',
    header: 'Atmosphere',
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
    cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString(),
  },
]

export function DecorationsTable({ 
  decorations,
  view,
  onViewChange
}: DecorationsTableProps) {
  return (
    <DataTable 
      columns={columns} 
      data={decorations} 
      filterColumn="name"
      view={view}
      onViewChange={onViewChange}
    />
  )
}
