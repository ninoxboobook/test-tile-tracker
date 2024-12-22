'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { uploadBlob } from '@/lib/blob'
import { XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'

interface ImageDropzoneProps {
  currentImageUrl?: string[] | null
  onImagesSelected: (urls: string[]) => void
  className?: string
  label?: string
  inputClasses?: string
}

export function ImageDropzone({ currentImageUrl, onImagesSelected, className, label, inputClasses }: ImageDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>(() => {
    return currentImageUrl || []
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

      const newImages = [...uploadedImages, ...uploadedUrls]
      setUploadedImages(newImages)
      onImagesSelected(newImages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images')
    } finally {
      setIsUploading(false)
    }
  }, [uploadedImages, onImagesSelected])

  const removeImage = (indexToRemove: number) => {
    const newImages = uploadedImages.filter((_, index) => index !== indexToRemove)
    setUploadedImages(newImages)
    onImagesSelected(newImages)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: true
  })

  return (
    <div className={`space-y-2 ${className ? className : ''}`}>
      {label && (<label className="block font-medium text-clay-700">{label}</label>)}
      <div
        {...getRootProps()}
        className={`border border-dashed rounded-lg p-6 flex items-center justify-center cursor-pointer
          ${inputClasses ? inputClasses : ''}
          ${isDragActive ? 'border-clay-600 bg-clay-50' : 'border-clay-400 hover:border-clay-500'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
        <CloudArrowUpIcon className="h-8 w-8 text-clay-600 mb-2" aria-hidden="true" />
        {isUploading ? (
          <p className="text-clay-700">Uploading...</p>
        ) : isDragActive ? (
          <p className="text-clay-700">Drop the files here...</p>
        ) : (
          <p className="text-clay-700">
            Drag and drop images here, or click to select files
          </p>
        )}
        <p className="text-sm text-clay-600 mt-2">Supported file types: JPG, JPEG, PNG, GIF</p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {uploadedImages.map((url, index) => (
            <div key={url} className="relative group">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={url}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 