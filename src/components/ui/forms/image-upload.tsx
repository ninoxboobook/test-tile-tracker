'use client'

import { useState } from 'react'
import Image from 'next/image'
import { uploadBlob } from '@/lib/blob'

interface ImageUploadProps {
  currentImageUrl?: string | null
  onImageSelected: (url: string) => void
}

export function ImageUpload({ currentImageUrl, onImageSelected }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      setError(null)
      const url = await uploadBlob(file, 'profile-pictures')
      onImageSelected(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {currentImageUrl && (
          <div className="relative h-20 w-20 overflow-hidden rounded-full">
            <Image
              src={currentImageUrl}
              alt="Profile picture"
              fill
              className="object-cover"
            />
          </div>
        )}
        <div>
          <label className="block">
            <span className="sr-only">Choose profile photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-clay-50 file:text-clay-700
                hover:file:bg-clay-100
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>
          {isUploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  )
}
