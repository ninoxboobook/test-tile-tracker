'use client'

import { useEffect, useState } from 'react'
import { Squares2X2Icon, TableCellsIcon } from '@heroicons/react/24/outline'

interface ViewToggleProps {
  view: 'grid' | 'table'
  onChange: (view: 'grid' | 'table') => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center space-x-2 rounded-md border bg-white p-1">
      <button
        onClick={() => onChange('table')}
        className={`rounded-sm p-1.5 ${
          view === 'table'
            ? 'bg-clay-100 text-clay-900'
            : 'text-clay-500 hover:text-clay-900'
        }`}
      >
        <TableCellsIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => onChange('grid')}
        className={`rounded-sm p-1.5 ${
          view === 'grid'
            ? 'bg-clay-100 text-clay-900'
            : 'text-clay-500 hover:text-clay-900'
        }`}
      >
        <Squares2X2Icon className="h-5 w-5" />
      </button>
    </div>
  )
} 