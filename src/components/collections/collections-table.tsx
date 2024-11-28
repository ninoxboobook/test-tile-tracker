'use client'

import { Collection } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table/data-table'
import Link from 'next/link'

interface CollectionsTableProps {
  collections: Collection[]
}

const columns: ColumnDef<Collection>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link
        href={`/collections/${row.original.id}`}
        className="text-clay-600 hover:text-clay-500"
      >
        {row.getValue('name')}
      </Link>
    ),
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
      return new Date(row.getValue('createdAt')).toLocaleDateString()
    },
  },
]

export function CollectionsTable({ collections }: CollectionsTableProps) {
  return (
    <DataTable 
      columns={columns} 
      data={collections} 
      filterColumn="name"
    />
  )
}
