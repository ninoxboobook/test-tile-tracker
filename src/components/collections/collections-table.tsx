'use client'

import { Collection, TestTile } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table/data-table'
import Link from 'next/link'

type CollectionWithTestTiles = Collection & {
  testTiles: Pick<TestTile, 'id' | 'imageUrl'>[]
}

interface CollectionsTableProps {
  collections: CollectionWithTestTiles[]
  view: 'grid' | 'table'
  onViewChange: (view: 'grid' | 'table') => void
}

const columns: ColumnDef<CollectionWithTestTiles>[] = [
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
    accessorKey: 'testTiles',
    header: 'Test Tiles',
    cell: ({ row }) => row.original.testTiles.length,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString(),
  },
]

export function CollectionsTable({ 
  collections,
  view,
  onViewChange
}: CollectionsTableProps) {
  return (
    <DataTable 
      columns={columns} 
      data={collections} 
      filterColumn="name"
      view={view}
      onViewChange={onViewChange}
    />
  )
}
