'use client'

import { DecorationWithRelations } from '@/lib/schemas/decoration'
import { BaseGrid } from '@/components/ui/data-view/base-grid'

interface DecorationsGridProps {
  decorations: DecorationWithRelations[]
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
            {decoration.imageUrl?.[0] ? (
                <img
                  src={decoration.imageUrl[0]}
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
                {decoration.type && (
                  <div>Type: {decoration.type.name}</div>
                )}
                {decoration.source && (
                  <div>Source: {decoration.source}</div>
                )}
                {decoration.manufacturer && (
                  <div>Manufacturer: {decoration.manufacturer}</div>
                )}
                {decoration.cone.length > 0 && (
                  <div>Cone: {decoration.cone.map(c => c.name).join(', ')}</div>
                )}
                {decoration.atmosphere.length > 0 && (
                  <div>Atmosphere: {decoration.atmosphere.map(a => a.name).join(', ')}</div>
                )}
                {decoration.colour && (
                  <div>Colour: {decoration.colour}</div>
                )}
              </div>
            </div>
          </div>
        ),
      })}
    />
  )
}