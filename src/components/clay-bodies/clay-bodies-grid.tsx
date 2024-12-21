'use client'

import { ClayBody, ClayBodyType, Cone } from '@prisma/client'
import { DataGrid } from '@/components/ui/data/data-grid'
import { DataGridTile } from '@/components/ui/data/data-grid-tile'
import { LozengeVariant } from '../ui/lozenge'
import { Table } from '@tanstack/react-table'

interface ClayBodiesGridProps {
  clayBodies: (ClayBody & {
    type: ClayBodyType | null
    cone: Cone[]
  })[]
  table?: Table<ClayBody & {
    type: ClayBodyType | null
    cone: Cone[]
  }>
}

export function ClayBodiesGrid({ clayBodies, table }: ClayBodiesGridProps) {
  const renderClayBody = (clayBody: ClayBody & {
    type: ClayBodyType | null
    cone: Cone[]
  }) => ({
    id: clayBody.id,
    href: `/clay-bodies/${clayBody.id}`,
    content: (
      <DataGridTile
        title={clayBody.name}
        images={clayBody.imageUrl ?? undefined}
        subtitle={clayBody.manufacturer ?? undefined}
        lozenges={
          [
            ...clayBody.cone.map(cone => ({
              label: /^(Low|Mid|High)/.test(cone.name) ? cone.name : `Cone ${cone.name}`,
              lozengeVariant: 'brand' as LozengeVariant
            })),
          ]
        }
        metadata={[
          ...(clayBody.type?.name ? [{ value: clayBody.type.name }] : []),
        ]}
      />
    ),
  })

  return (
    <DataGrid
      items={clayBodies}
      renderItem={renderClayBody}
      table={table}
    />
  )
}