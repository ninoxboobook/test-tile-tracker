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
 const [uploadedImages, setUploadedImages] = useState<string[]>(() => {
    return currentImageUrl ? JSON.parse(currentImageUrl) : []
  })

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

      // Update local state and parent component
      const newImages = [...uploadedImages, ...uploadedUrls]
      setUploadedImages(newImages)
      onImagesSelected(JSON.stringify(newImages))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images')
    } finally {
      setIsUploading(false)
    }
  }, [uploadedImages, onImagesSelected])

  const removeImage = (indexToRemove: number) => {
    const newImages = uploadedImages.filter((_, index) => index !== indexToRemove)
    setUploadedImages(newImages)
    onImagesSelected(JSON.stringify(newImages))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: true
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          ${isDragActive ? 'border-clay-500 bg-clay-50' : 'border-gray-300 hover:border-clay-400'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <p className="text-sm text-gray-500">Uploading...</p>
        ) : isDragActive ? (
          <p className="text-sm text-gray-500">Drop the files here...</p>
        ) : (
          <p className="text-sm text-gray-500">
            Drag and drop images here, or click to select files
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {uploadedImages.map((url, index) => (
            <div key={url} className="relative group">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <img
                  src={url}
                  alt={`Uploaded image ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 