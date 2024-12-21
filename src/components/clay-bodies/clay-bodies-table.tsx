'use client'

import { ClayBody, ClayBodyType, Cone } from '@prisma/client'
import { ColumnDef, Table } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data/data-table'
import Link from 'next/link'
import Image from 'next/image'

type ClayBodyWithRelations = ClayBody & {
  type: ClayBodyType | null
  cone: Cone[]
}

interface ClayBodiesTableProps {
  clayBodies: ClayBodyWithRelations[]
  table?: Table<ClayBodyWithRelations>
}

export const columns: ColumnDef<ClayBodyWithRelations>[] = [
  {
    accessorKey: 'imageUrl',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = Array.isArray(row.original.imageUrl) 
        ? row.original.imageUrl[0] 
        : row.original.imageUrl;
      
      return (
        <div className="relative h-14 w-14">
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
    cell: ({ row }) => row.original.type?.name ?? '',
  },
  {
    accessorKey: 'manufacturer',
    header: 'Manufacturer',
  },
  {
    accessorKey: 'cone',
    header: 'Cone',
    cell: ({ row }) => row.original.cone.map(c => c.name).join(', '),
  },
  {
    accessorKey: 'firingTemperature',
    header: 'Firing Temperature',
    cell: ({ row }) => {
      const temp = row.getValue('firingTemperature')
      return temp ? `${temp}°C` : ''
    },
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

export function ClayBodiesTable({ clayBodies, table }: ClayBodiesTableProps) {
  return <DataTable columns={columns} data={clayBodies} table={table} />
}
