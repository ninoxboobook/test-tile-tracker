'use client'

import { DataTable } from '@/components/ui/data/data-table'
import { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import { Lozenge } from './lozenge'

interface DemoTile {
  title: string
  subtitle: string
  images: string[]
  lozenges: Array<{
    label?: string
    lozengeVariant?: 'brand' | 'brand-emphasis' | 'neutral'
  }>
  metadata: Array<{
    value: string
  }>
}

interface DemoTilesTableProps {
  tiles: DemoTile[]
}

export const columns: ColumnDef<DemoTile>[] = [
  {
    accessorKey: 'title',
    header: 'Name',
    cell: ({ row }) => {
      const imageUrl = row.original.images[0]

      return (
        <div>
          <div className="flex items-center gap-4 text-brand font-semibold hover:text-clay-600">
            <div className="relative h-14 w-14 flex-shrink-0">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt=""
                  fill
                  className="rounded-md object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-md bg-sand border border-clay-200" />
              )}
            </div>

            <div>
              <div className="font-semibold text-brand hover:text-clay-600">{row.original.title}</div>
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'stamp',
    header: 'Stamp',
    cell: ({ row }) => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const letter = letters[Math.floor(Math.random() * letters.length)]
      const numbers = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      return <div>{letter}{numbers}</div>
    },
  },
  {
    accessorKey: 'subtitle',
    header: 'Clay Body',
    cell: ({ row }) => (
      <div className="text-brand underline hover:text-clay-600">
        {row.original.subtitle}
      </div>
    ),
  },
  {
    accessorKey: 'cone',
    header: 'Cone',
    cell: ({ row }) => {
      const coneTag = row.original.lozenges.find(l => l.label?.includes('Cone'))
      return coneTag?.label || '-'
    },
  },
  {
    accessorKey: 'atmosphere',
    header: 'Atmosphere',
    cell: ({ row }) => {
      const atmosphereTag = row.original.lozenges.find(l => !l.label?.includes('Cone'))
      return atmosphereTag?.label || '-'
    },
  },
  {
    accessorKey: 'decorations',
    header: 'Decorations',
    cell: ({ row }) => (
      <div className="text-brand underline hover:text-clay-600 whitespace-normal">
        {row.original.metadata[0]?.value.split(',').map((decoration, index, array) => (
          <span key={index}>
            {decoration.trim()}
            {index < array.length - 1 && ', '}
          </span>
        ))}
      </div>
    ),
  },
]

export function DemoTilesTable({ tiles }: DemoTilesTableProps) {
  return <DataTable columns={columns} data={tiles} />
}
