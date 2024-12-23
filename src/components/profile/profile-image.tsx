'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { uploadBlob } from '@/lib/blob'
import { PencilIcon } from '@heroicons/react/24/solid'

interface ProfileImageProps {
  currentImageUrl?: string | null
  onImageSelected: (url: string) => void
  initials?: string
}

export function ProfileImage({ currentImageUrl, onImageSelected, initials = 'U' }: ProfileImageProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      setError(null)
      const url = await uploadBlob(file, 'profile-pictures')
      onImageSelected(url)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleEditClick = () => {
    if (isEditing) {
      fileInputRef.current?.click()
    } else {
      setIsEditing(true)
    }
  }

  return (
    <div className="space-y-4 flex flex-col items-center">
      <div className="relative">
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
          <div className="h-40 w-40 rounded-full bg-clay-500 flex items-center justify-center ring-2 ring-brand ring-offset-2">
            <span className="text-white font-medium text-2xl">{initials}</span>
          </div>
        )}
        <button
          type="button"
          onClick={handleEditClick}
          className="absolute top-0 right-0 h-10 w-10 rounded-full bg-brand flex items-center justify-center text-white hover:bg-clay-700 transition-colors"
          aria-label="Edit profile picture"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
      </div>

      {isEditing && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="text-sm text-clay-700
              file:mr-4 file:py-1.5 file:px-2.5
              file:rounded-md file:border file:border-brand
              file:text-sm file:font-medium
              file:bg-sand-light file:text-brand
              hover:file:bg-sand
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {isUploading && <p className="mt-2 text-sm text-clay-500">Uploading...</p>}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      )}
    </div>
  )
}
