'use client'

import { Decoration, DecorationType, Cone, Atmosphere } from '@prisma/client'
import { ColumnDef, Table } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data/data-table'
import Link from 'next/link'
import Image from 'next/image'
import { DecorationWithRelations } from '@/lib/schemas/decoration'

interface DecorationsTableProps {
  decorations: DecorationWithRelations[]
  table?: Table<DecorationWithRelations>
}

export const columns: ColumnDef<DecorationWithRelations>[] = [
  {
    accessorKey: 'imageUrl',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = Array.isArray(row.original.imageUrl) 
        ? row.original.imageUrl[0] 
        : row.original.imageUrl;
      
      return (
        <div className="relative h-10 w-10">
          {imageUrl && imageUrl.length > 0 ? (
            <Image
              src={imageUrl}
              alt={`${row.original.name} thumbnail`}
              fill
              className="rounded-md object-cover"
            />
          ) : (
            <div className="h-full w-full rounded-md bg-gray-100" />
          )}
        </div>
      );
    },
  },
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
    accessorKey: 'source',
    header: 'Source',
  },
  {
    id: 'type',
    header: 'Type',
    accessorFn: (row) => row.type.name,
  },
  {
    id: 'cone',
    header: 'Cone',
    accessorFn: (row) => row.cone.map(c => c.name).join(', '),
  },
  {
    id: 'atmosphere',
    header: 'Atmosphere',
    accessorFn: (row) => row.atmosphere.map(a => a.name).join(', '),
  },
  {
    accessorKey: 'colour',
    header: 'Colour',
  },
  {
    accessorKey: 'manufacturer',
    header: 'Manufacturer',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return date.toLocaleDateString()
    },
  },
]

export function DecorationsTable({ decorations, table }: DecorationsTableProps) {
  return <DataTable columns={columns} data={decorations} table={table} />
}
