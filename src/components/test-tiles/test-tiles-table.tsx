'use client'

import { ClayBody, Collection, Decoration, Cone, Atmosphere } from '@prisma/client'
import { ColumnDef, Table } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table/data-table'
import { TestTileWithRelations } from '@/types/test-tile'
import Link from 'next/link'

interface TestTilesTableProps {
  testTiles: TestTileWithRelations[]
  table?: Table<TestTileWithRelations>
}

export const columns: ColumnDef<TestTileWithRelations>[] = [
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
    accessorKey: 'cone.name',
    header: 'Cone',
  },
  {
    accessorKey: 'atmosphere.name',
    header: 'Atmosphere',
  },
  {
    accessorKey: 'decorations',
    header: 'Decorations',
    cell: ({ row }) => (
      <div className="space-x-1">
        {row.original.decorationLayers.flatMap(layer => 
          layer.decorations.map((decoration, index) => (
            <span key={`${row.original.id}-${layer.order}-${decoration.id}`}>
              <Link
                href={`/decorations/${decoration.id}`}
                className="text-clay-600 hover:text-clay-500"
              >
                {decoration.name}
              </Link>
              {index < layer.decorations.length - 1 && ', '}
            </span>
          ))
        )}
      </div>
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
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return date.toISOString().split('T')[0]
    },
  },
]

export function TestTilesTable({ testTiles, table }: TestTilesTableProps) {
  return <DataTable columns={columns} data={testTiles} table={table} />
} 