'use client'

import { DecorationWithRelations } from '@/lib/schemas/decoration'
import { DataGrid } from '@/components/ui/data/data-grid'
import { DataGridTile } from '@/components/ui/data/data-grid-tile'
import { LozengeVariant } from '../ui/lozenge'
import { Table } from '@tanstack/react-table'

interface DecorationsGridProps {
  decorations: DecorationWithRelations[]
  table?: Table<DecorationWithRelations>
}

export function DecorationsGrid({ decorations, table }: DecorationsGridProps) {
  const renderDecoration = (decoration: DecorationWithRelations) => ({
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
  })

  return (
    <DataGrid
      items={decorations}
      renderItem={renderDecoration}
      table={table}
    />
  )
}