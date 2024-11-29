'use client'

import { ClayBody } from '@prisma/client'
import { BaseGrid } from '@/components/ui/data-view/base-grid'

interface ClayBodiesGridProps {
  clayBodies: ClayBody[]
}

export function ClayBodiesGrid({ clayBodies }: ClayBodiesGridProps) {
  return (
    <BaseGrid
      items={clayBodies}
      renderItem={(clayBody) => ({
        id: clayBody.id,
        href: `/clay-bodies/${clayBody.id}`,
        title: clayBody.name,
        imageUrl: clayBody.imageUrl,
        details: (
          <div className="space-y-1">
            {clayBody.type && (
              <div>Type: {clayBody.type}</div>
            )}
            {clayBody.manufacturer && (
              <div>Manufacturer: {clayBody.manufacturer}</div>
            )}
            {clayBody.cone && (
              <div>Cone: {clayBody.cone}</div>
            )}
            {clayBody.firingTemperature && (
              <div>Temperature: {clayBody.firingTemperature}°C</div>
            )}
          </div>
        ),
      })}
    />
  )
} 