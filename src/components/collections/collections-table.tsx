'use client'

import { Collection, TestTile } from '@prisma/client'
import { ColumnDef, Table } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data/data-table'
import Link from 'next/link'

type CollectionWithTestTiles = Collection & {
  testTiles: Pick<TestTile, 'id' | 'imageUrl'>[]
}

interface CollectionsTableProps {
  collections: CollectionWithTestTiles[]
  table?: Table<CollectionWithTestTiles>
}

export const columns: ColumnDef<CollectionWithTestTiles>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link
        href={`/collections/${row.original.id}`}
        className="text-brand font-semibold hover:text-clay-500"
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
    accessorKey: 'testTiles',
    header: 'Test Tiles',
    cell: ({ row }) => row.original.testTiles.length,
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

export function CollectionsTable({ collections, table }: CollectionsTableProps) {
  return <DataTable columns={columns} data={collections} table={table} />
}
