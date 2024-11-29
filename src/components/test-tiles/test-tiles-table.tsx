'use client'

import { TestTile, ClayBody, Collection, Decoration } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table/data-table'
import Link from 'next/link'

type TestTileWithRelations = TestTile & {
  clayBody: ClayBody
  collections: Collection[]
  decorations: Decoration[]
}

interface TestTilesTableProps {
  testTiles: TestTileWithRelations[]
  view: 'grid' | 'table'
  onViewChange: (view: 'grid' | 'table') => void
}

const columns: ColumnDef<TestTileWithRelations>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link
        href={`/test-tiles/${row.original.id}`}
        className="text-clay-600 hover:text-clay-500"
      >
        {row.getValue('name')}
      </Link>
    ),
  },
  {
    accessorKey: 'stamp',
    header: 'Stamp',
  },
  {
    accessorKey: 'clayBody.name',
    header: 'Clay Body',
    cell: ({ row }) => (
      <Link
        href={`/clay-bodies/${row.original.clayBody.id}`}
        className="text-clay-600 hover:text-clay-500"
      >
        {row.original.clayBody.name}
      </Link>
    ),
  },
  {
    accessorKey: 'collections',
    header: 'Collections',
    cell: ({ row }) => (
      <div className="space-x-1">
        {row.original.collections.map((collection, index) => (
          <span key={collection.id}>
            <Link
              href={`/collections/${collection.id}`}
              className="text-clay-600 hover:text-clay-500"
            >
              {collection.name}
            </Link>
            {index < row.original.collections.length - 1 && ', '}
          </span>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString(),
  },
]

export function TestTilesTable({ 
  testTiles,
  view,
  onViewChange
}: TestTilesTableProps) {
  return (
    <DataTable 
      columns={columns} 
      data={testTiles} 
      filterColumn="name"
      view={view}
      onViewChange={onViewChange}
    />
  )
} 