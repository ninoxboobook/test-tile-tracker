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
        imageUrl: decoration.imageUrl,
        details: (
          <div className="space-y-1">
            {decoration.category && (
              <div>Category: {decoration.category}</div>
            )}
			{decoration.type && (
              <div>Type: {decoration.type}</div>
            )}
            {decoration.manufacturer && (
              <div>Manufacturer: {decoration.manufacturer}</div>
            )}
            {decoration.cone && (
              <div>Cone: {decoration.cone}</div>
            )}
            {decoration.atmosphere && (
              <div>Atmosphere: {decoration.atmosphere}</div>
            )}
          </div>
        ),
      })}
    />
  )
} 