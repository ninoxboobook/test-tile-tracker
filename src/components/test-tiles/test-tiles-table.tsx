'use client'

import { ClayBody, Collection, Decoration, Cone, Atmosphere } from '@prisma/client'
import { ColumnDef, Table } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data/data-table'
import { TestTileWithRelations } from '@/types/test-tile'
import Link from 'next/link'
import Image from 'next/image'

interface TestTilesTableProps {
  testTiles: TestTileWithRelations[]
  table?: Table<TestTileWithRelations>
}

export const columns: ColumnDef<TestTileWithRelations>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const imageUrl = Array.isArray(row.original.imageUrl)
        ? row.original.imageUrl[0]
        : row.original.imageUrl;

      return (
        <div>
          <Link
            href={`/test-tiles/${row.original.id}`}
            className="flex items-center gap-4 text-brand font-semibold hover:text-clay-600"
          >
            <div className="relative h-14 w-14 flex-shrink-0">
              {imageUrl && imageUrl.length > 0 ? (
                <Image
                  src={imageUrl}
                  alt=""
                  height={56}
                  width={56}
                  className="rounded-md object-cover h-14"
                />
              ) : (
                <div className="h-full w-full rounded-md bg-sand border border-clay-200" />
              )}
            </div>

            {row.getValue('name')}
          </Link>
        </div>
      );
    },
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
        className="text-brand underline hover:text-clay-600"
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
      <div className="space-x-1 whitespace-normal">
        {row.original.decorationLayers.flatMap(layer =>
          layer.decorations.map((decoration, index) => (
            <span key={`${row.original.id}-${layer.order}-${decoration.id}`}>
              <Link
                href={`/decorations/${decoration.id}`}
                className="text-brand underline hover:text-clay-600"
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
      <div className="space-x-1 whitespace-normal">
        {row.original.collections.map((collection, index) => (
          <span key={collection.id}>
            <Link
              href={`/collections/${collection.id}`}
              className="text-brand underline hover:text-clay-600"
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