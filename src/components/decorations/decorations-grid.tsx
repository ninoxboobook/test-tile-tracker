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
            subtitle={
              decoration.source === 'Commercial' 
                ? (decoration.manufacturer ?? decoration.source ?? undefined) 
                : (decoration.source ?? undefined)
            }
            lozenges={
              [
                ...decoration.cone.map(cone => ({
                  label: /^(Low|Mid|High)/.test(cone.name) ? cone.name : `Cone ${cone.name}`,
                  lozengeVariant: 'brand' as LozengeVariant
                })),
                ...decoration.atmosphere.map(atm => ({
                  label: atm.name,
                  lozengeVariant: 'brand-emphasis' as LozengeVariant
                })),
              ]
            }
            metadata={[
              ...(decoration.type ? [{ value: decoration.type.name }] : []),
            ]}
          />
        ),
      })}
    />
  )
}