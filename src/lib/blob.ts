'use server'

import { put, del } from '@vercel/blob'
import { nanoid } from 'nanoid'

export async function uploadBlob(
  file: File | Blob,
  prefix: string = 'uploads'
): Promise<string> {
  try {
    console.log('Starting blob upload:', {
      type: file.type,
      size: file.size,
      prefix
    })

    const filename = `${prefix}/${nanoid()}-${(file as File).name || 'upload'}`
    console.log('Generated filename:', filename)

    const { url } = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    console.log('Blob upload successful:', url)
    return url
  } catch (error) {
    console.error('Error uploading blob:', error)
    throw error
  }
}

export async function deleteBlob(url: string): Promise<void> {
  try {
    console.log('Starting blob deletion:', url)
    await del(url)
    console.log('Blob deletion successful')
  } catch (error) {
    console.error('Error deleting blob:', error)
    throw error
  }
}
