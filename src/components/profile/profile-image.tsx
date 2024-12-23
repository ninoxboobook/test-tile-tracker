'use client'

import { useState } from 'react'
import Image from 'next/image'
import { uploadBlob } from '@/lib/blob'

interface ProfileImageProps {
  currentImageUrl?: string | null
  onImageSelected: (url: string) => void
  initials?: string
}

export function ProfileImage({ currentImageUrl, onImageSelected, initials = 'U' }: ProfileImageProps) {
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
    <div className="space-y-4 flex flex-col items-center">
        {currentImageUrl ? (
          <div className="relative h-40 w-40 overflow-hidden rounded-full ring-2 ring-brand ring-offset-2">
            <Image
              src={currentImageUrl}
              alt="Profile picture"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-20 w-20 rounded-full bg-clay-500 flex items-center justify-center">
            <span className="text-white font-medium">{initials}</span>
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
              className="block w-full text-sm text-clay-700
                file:mr-4 file:py-1.5 file:px-2.5
                file:rounded-md file:border file:border-brand
                file:text-sm file:font-medium
                file:bg-sand-light file:text-brand
                hover:file:bg-sand
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>
          {isUploading && <p className="mt-2 text-sm text-clay-500">Uploading...</p>}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    </div>
  )
}
