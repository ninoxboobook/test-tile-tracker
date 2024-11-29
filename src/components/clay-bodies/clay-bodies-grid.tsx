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
        content: (
          <div className="flex flex-col">
            <div className="aspect-square bg-gray-50">
              {clayBody.imageUrl ? (
                <img
                  src={clayBody.imageUrl}
                  alt={clayBody.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-full w-full border-2 border-dashed border-gray-200" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col space-y-2 p-4">
              <h3 className="text-sm font-medium text-gray-900">{clayBody.name}</h3>
              <div className="space-y-1 text-sm text-gray-500">
                {clayBody.type && <div>Type: {clayBody.type}</div>}
                {clayBody.manufacturer && <div>Manufacturer: {clayBody.manufacturer}</div>}
                {clayBody.cone && <div>Cone: {clayBody.cone}</div>}
                {clayBody.firingTemperature && (
                  <div>Temperature: {clayBody.firingTemperature}°C</div>
                )}
              </div>
            </div>
          </div>
        ),
      })}
    />
  )
} 