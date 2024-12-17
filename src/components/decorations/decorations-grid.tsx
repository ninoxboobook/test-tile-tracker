'use client'

import { DecorationWithRelations } from '@/lib/schemas/decoration'
import { DataGrid } from '@/components/ui/data/data-grid'
import { DataGridTile } from '@/components/ui/data/data-grid-tile'
import { LozengeVariant } from '../ui/lozenge'

interface DecorationsGridProps {
  decorations: DecorationWithRelations[]
}

export function DecorationsGrid({ decorations }: DecorationsGridProps) {
  return (
    <DataGrid
      items={decorations}
      renderItem={(decoration) => ({
        id: decoration.id,
        href: `/decorations/${decoration.id}`,
        content: (
          <DataGridTile
            title={decoration.name}
            images={decoration.imageUrl ?? undefined}
            lozenges={
              [
                ...decoration.cone.map(cone => ({
                  label: /^(Low|Mid|High)/.test(cone.name) ? cone.name : `Cone ${cone.name}`,
                  lozengeVariant: 'brand' as LozengeVariant
                })),
              ]
            }
            metadata={[
              ...(decoration.source ? [{ label: 'Source', value: decoration.source }] : []),
              ...(decoration.manufacturer ? [{ label: 'Manufacturer', value: decoration.manufacturer }] : []),
              ...(decoration.type ? [{ value: decoration.type.name }] : []),
              ...(decoration.atmosphere.length > 0 ? [{ label: 'Atmosphere', value: decoration.atmosphere.map(a => a.name).join(', ') }] : []),
            ]}
          />
        ),
      })}
    />
  )
}