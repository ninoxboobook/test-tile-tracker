'use client'

import { ClayBody, ClayBodyType, Cone } from '@prisma/client'
import { DataGrid } from '@/components/ui/data/data-grid'
import { DataGridTile } from '@/components/ui/data/data-grid-tile'

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
            metadata={[
              ...(clayBody.type?.name ? [{ label: 'Type', value: clayBody.type.name }] : []),
              ...(clayBody.manufacturer ? [{ label: 'Manufacturer', value: clayBody.manufacturer }] : []),
              ...(clayBody.cone.length > 0 ? [{ label: 'Cone', value: clayBody.cone.map(c => c.name).join(', ') }] : []),
              ...(clayBody.firingTemperature ? [{ label: 'Temperature', value: `${clayBody.firingTemperature}°C` }] : []),
            ]}
          />
        ),
      })}
    />
  )
}