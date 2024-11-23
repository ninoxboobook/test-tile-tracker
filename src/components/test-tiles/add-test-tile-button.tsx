'use client'

import Link from 'next/link'

export function AddTestTileButton() {
  return (
    <Link
      href="/test-tiles/new"
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-clay-600 hover:bg-clay-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clay-500"
    >
      Add New Test Tile
    </Link>
  )
}
