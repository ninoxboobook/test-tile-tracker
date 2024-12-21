'use client'

import { useEffect, useState } from 'react'
import { Squares2X2Icon, TableCellsIcon } from '@heroicons/react/24/outline'

interface ViewToggleProps {
  view: 'grid' | 'table'
  onChange: (view: 'grid' | 'table') => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center space-x-1 rounded-md border border-clay-400 bg-sand-light  p-1">
      <button
        onClick={() => onChange('table')}
        className={`rounded-sm px-[3px] py-[2px] ${
          view === 'table'
            ? 'bg-clay-100 text-clay-700'
            : 'text-clay-500 hover:text-clay-700'
        }`}
        aria-label="Switch to table view"
        aria-pressed={view === 'table'}
      >
        <TableCellsIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      <button
        onClick={() => onChange('grid')}
        className={`rounded-sm px-[3px] py-[2px] ${
          view === 'grid'
            ? 'bg-clay-100 text-clay-700'
            : 'text-clay-500 hover:text-clay-700'
        }`}
        aria-label="Switch to grid view"
        aria-pressed={view === 'grid'}
      >
        <Squares2X2Icon className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  )
} 