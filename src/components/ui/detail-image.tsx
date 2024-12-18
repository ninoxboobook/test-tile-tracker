'use client'

import { useState } from 'react'

interface DetailImageProps {
  images?: string[]
}

export function DetailImage({ images = [] }: DetailImageProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-clay-50 rounded-xl" />
    )
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-clay-50 rounded-xl overflow-hidden">
        <img
          src={images[selectedIndex]}
          alt="Selected image"
          className="h-full w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square bg-clay-50 rounded-lg overflow-hidden ${
                index === selectedIndex ? 'ring-2 ring-clay-500' : ''
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
