'use client'

import { DecorationWithRelations } from '@/lib/schemas/decoration'
import { DataGrid } from '@/components/ui/data/data-grid'
import { DataGridTile } from '@/components/ui/data/data-grid-tile'

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
            metadata={[
              ...(decoration.type ? [{ label: 'Type', value: decoration.type.name }] : []),
              ...(decoration.source ? [{ label: 'Source', value: decoration.source }] : []),
              ...(decoration.manufacturer ? [{ label: 'Manufacturer', value: decoration.manufacturer }] : []),
              ...(decoration.cone.length > 0 ? [{ label: 'Cone', value: decoration.cone.map(c => c.name).join(', ') }] : []),
              ...(decoration.atmosphere.length > 0 ? [{ label: 'Atmosphere', value: decoration.atmosphere.map(a => a.name).join(', ') }] : []),
              ...(decoration.colour ? [{ label: 'Colour', value: decoration.colour }] : []),
            ]}
          />
        ),
      })}
    />
  )
}