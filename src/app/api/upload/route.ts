'use server'

import { put, del } from '@vercel/blob'
import { nanoid } from 'nanoid'

export async function PUT(request: Request) {
  try {
    const file = request.body
    if (!file) {
      return new Response('No file provided', { status: 400 })
    }

    const filename = `profile-pictures/${nanoid()}-${Date.now()}`
    console.log('Uploading file:', filename)

    const { url } = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    console.log('Upload successful:', url)
    return Response.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return new Response(error instanceof Error ? error.message : 'Upload failed', { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { url } = await request.json()
    if (!url) {
      return new Response('No URL provided', { status: 400 })
    }

    await del(url)
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Delete error:', error)
    return new Response(error instanceof Error ? error.message : 'Delete failed', { status: 500 })
  }
}
