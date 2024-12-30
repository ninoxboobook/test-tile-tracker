'use client'

import { useState } from 'react'
import { EmptyState } from './data/data-empty-state'
import { PhotoIcon } from '@heroicons/react/24/outline'

interface DetailImageProps {
  images?: string[]
}

export function DetailImage({ images = [] }: DetailImageProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center aspect-square bg-sand-light rounded-2xl p-8">
        <EmptyState
          title="No images"
          description="You haven't uploaded any images yet. Edit this entry to add some."
          size="large"
          image={<PhotoIcon className="h-10 w-10 text-clay-600 mb-2" aria-hidden="true" />}
        />
      </div>
    )
  }

  return (
    <div className="bg-sand-light rounded-2xl">
      <div className={`aspect-square bg-clay-50 ${images.length > 1 ? 'rounded-t-xl' : 'rounded-xl'} overflow-hidden`}>
        <img
          src={images[selectedIndex]}
          alt="Selected image"
          className="h-full w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4 p-8">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square bg-clay-50 rounded overflow-hidden ${
                index === selectedIndex ? 'ring-2 ring-brand ring-offset-2' : ''
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
