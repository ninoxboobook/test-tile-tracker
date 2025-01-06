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
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const imageUrl = Array.isArray(row.original.imageUrl)
        ? row.original.imageUrl[0]
        : row.original.imageUrl;

      return (
        <div>
          <Link
            href={`/clay-bodies/${row.original.id}`}
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
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => row.original.type?.name ?? '',
  },
  {
    accessorKey: 'cone',
    header: 'Cone',
    cell: ({ row }) => row.original.cone.map(c => c.name).join(', '),
  },
  {
    accessorKey: 'manufacturer',
    header: 'Manufacturer',
  },
  {
    accessorKey: 'firingRange',
    header: 'Firing Range',
    cell: ({ row }) => {
      const temp = row.getValue('firingRange')
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
