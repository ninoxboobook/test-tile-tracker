'use client'

import { Decoration } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table/data-table'
import Link from 'next/link'

interface DecorationsTableProps {
  decorations: Decoration[]
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
    accessorKey: 'recipe',
    header: 'Recipe',
    cell: ({ row }) => {
      const recipe = row.getValue('recipe') as string
      return recipe ? recipe.slice(0, 100) + (recipe.length > 100 ? '...' : '') : ''
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

export function DecorationsTable({ decorations }: DecorationsTableProps) {
  return (
    <DataTable 
      columns={columns} 
      data={decorations} 
      filterColumn="name"
    />
  )
}
