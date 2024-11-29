'use client'

import { Decoration } from '@prisma/client'
import { BaseGrid } from '@/components/ui/data-view/base-grid'

interface DecorationsGridProps {
  decorations: Decoration[]
}

export function DecorationsGrid({ decorations }: DecorationsGridProps) {
  return (
    <BaseGrid
      items={decorations}
      renderItem={(decoration) => ({
        id: decoration.id,
        href: `/decorations/${decoration.id}`,
        title: decoration.name,
        content: (
          <div className="flex flex-col">
            <div className="aspect-square bg-gray-50">
              {decoration.imageUrl ? (
                <img
                  src={decoration.imageUrl}
                  alt={decoration.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-full w-full border-2 border-dashed border-gray-200" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col space-y-2 p-4">
              <h3 className="text-sm font-medium text-gray-900">{decoration.name}</h3>
              <div className="space-y-1 text-sm text-gray-500">
                {decoration.type && <div>Category: {decoration.type}</div>}
                {decoration.manufacturer && <div>Manufacturer: {decoration.manufacturer}</div>}
                {decoration.cone && <div>Cone: {decoration.cone}</div>}
                {decoration.atmosphere && <div>Atmosphere: {decoration.atmosphere}</div>}
              </div>
            </div>
          </div>
        ),
      })}
    />
  )
} 