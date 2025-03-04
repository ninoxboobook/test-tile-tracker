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
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const imageUrl = Array.isArray(row.original.imageUrl)
        ? row.original.imageUrl[0]
        : row.original.imageUrl;

      return (
        <div>
          <Link
            href={`/decorations/${row.original.id}`}
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
    id: 'type',
    header: 'Type',
    accessorFn: (row) => row.type.name,
  },
  {
    id: 'cone',
    header: 'Cone',
    accessorFn: (row) => row.cone.map(c => c.name).join(', '),
    cell: ({ row }) => (
      <div className="min-w-24 max-w-64 sm:whitespace-normal">
        {row.original.cone.map(c => c.name).join(', ')}
      </div>
    ),
  },
  {
    accessorKey: 'source',
    header: 'Source',
  },
  {
    accessorKey: 'manufacturer',
    header: 'Manufacturer',
  },
  {
    id: 'atmosphere',
    header: 'Atmosphere',
    accessorFn: (row) => row.atmosphere.map(a => a.name).join(', '),
  },
  {
    accessorKey: 'colour',
    header: 'Colour',
    cell: ({ row }) => {
      const colorStr = row.getValue('colour')
      if (!colorStr) return null
      
      try {
        const { hex, category } = JSON.parse(colorStr as string)
        return (
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: hex }}
              title={category}
            />
          </div>
        )
      } catch {
        return null
      }
    },
    filterFn: (row, columnId, filterValue) => {
      const colorStr = row.getValue(columnId) as string | null
      if (!colorStr) return false
      try {
        const { category } = JSON.parse(colorStr)
        return filterValue.includes(category)
      } catch {
        return false
      }
    }
  },
  {
    accessorKey: 'isPublic',
    header: 'Visibility',
    cell: ({ row }) => row.getValue('isPublic') ? 'Public' : 'Private',
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
