'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { uploadBlob } from '@/lib/blob'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ImageDropzoneProps {
  currentImageUrl?: string | null
  onImagesSelected: (urls: string) => void
}

export function ImageDropzone({ currentImageUrl, onImagesSelected }: ImageDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Parse current images from JSON string or initialize empty array
  const currentImages = currentImageUrl ? JSON.parse(currentImageUrl) : []

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return

    try {
      setIsUploading(true)
      setError(null)

      const uploadedUrls = []
      for (const file of acceptedFiles) {
        const url = await uploadBlob(file, 'decoration-images')
        uploadedUrls.push(url)
      }

      // Combine with existing images and save as JSON
      const newValue = JSON.stringify([...currentImages, ...uploadedUrls])
      onImagesSelected(newValue)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images')
    } finally {
      setIsUploading(false)
    }
  }, [currentImages, onImagesSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: true
  })

  const handleRemoveImage = (indexToRemove: number) => {
    const newImages = currentImages.filter((_: string, index: number) => index !== indexToRemove)
    onImagesSelected(JSON.stringify(newImages))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {currentImages.map((url: string, index: number) => (
          <div key={url} className="relative group">
            <div className="relative h-24 w-24 overflow-hidden rounded-lg">
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 
                         opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors ${
            isDragActive
              ? 'border-clay-500 bg-clay-50'
              : 'border-gray-300 hover:border-clay-400'
          }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <p className="text-sm text-gray-500">Uploading...</p>
        ) : isDragActive ? (
          <p className="text-sm text-clay-600">Drop the images here...</p>
        ) : (
          <p className="text-sm text-gray-500">
            Drag and drop images here, or click to select files
          </p>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
} 