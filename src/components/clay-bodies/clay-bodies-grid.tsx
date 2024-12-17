'use client'

import { ClayBody, ClayBodyType, Cone } from '@prisma/client'
import { DataGrid } from '@/components/ui/data/data-grid'
import { DataGridTile } from '@/components/ui/data/data-grid-tile'
import { LozengeVariant } from '../ui/lozenge'

interface ClayBodiesGridProps {
  clayBodies: (ClayBody & {
    type: ClayBodyType | null
    cone: Cone[]
  })[]
}

export function ClayBodiesGrid({ clayBodies }: ClayBodiesGridProps) {
  return (
    <DataGrid
      items={clayBodies}
      renderItem={(clayBody) => ({
        id: clayBody.id,
        href: `/clay-bodies/${clayBody.id}`,
        content: (
          <DataGridTile
            title={clayBody.name}
            images={clayBody.imageUrl ?? undefined}
            lozenges={
              [
                ...clayBody.cone.map(cone => ({
                  label: /^(Low|Mid|High)/.test(cone.name) ? cone.name : `Cone ${cone.name}`,
                  lozengeVariant: 'brand' as LozengeVariant
                })),
              ]
            }
            metadata={[
              ...(clayBody.manufacturer ? [{ value: clayBody.manufacturer }] : []),
              ...(clayBody.type?.name ? [{ value: clayBody.type.name }] : []),
            ]}
          />
        ),
      })}
    />
  )
}