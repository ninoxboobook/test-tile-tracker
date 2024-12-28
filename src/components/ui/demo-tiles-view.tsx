'use client'

import { useState } from 'react'
import { TableCellsIcon, Squares2X2Icon } from '@heroicons/react/24/outline'
import { Carousel } from './carousel'
import { DemoTilesTable } from './demo-tiles-table'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface DemoTile {
  title: string
  subtitle: string
  images: string[]
  lozenges: Array<{
    label?: string
    lozengeVariant?: 'brand' | 'brand-emphasis' | 'neutral'
  }>
  metadata: Array<{
    value: string
  }>
}

interface DemoTilesViewProps {
  tiles: DemoTile[]
}

export function DemoTilesView({ tiles }: DemoTilesViewProps) {
  const [view, setView] = useState<'grid' | 'table'>('grid')

  return (
    <div>
      <div className="flex justify-center mb-14">
        <div className="flex items-center space-x-1 rounded-md border border-clay-400 bg-sand-light p-1">
          <button
            onClick={() => setView('grid')}
            className={`rounded-sm px-3 py-1 inline-flex items-center gap-2 ${
              view === 'grid'
                ? 'bg-clay-100 text-clay-700'
                : 'text-clay-500 hover:text-clay-700'
            }`}
            aria-label="Switch to grid view"
            aria-pressed={view === 'grid'}
          >
            <Squares2X2Icon className="h-6 w-6" aria-hidden="true" />
            <span className="text-base font-medium">Grid View</span>
          </button>
          <button
            onClick={() => setView('table')}
            className={`rounded-sm px-3 py-1 inline-flex items-center gap-2 ${
              view === 'table'
                ? 'bg-clay-100 text-clay-700'
                : 'text-clay-500 hover:text-clay-700'
            }`}
            aria-label="Switch to table view"
            aria-pressed={view === 'table'}
          >
            <TableCellsIcon className="h-6 w-6" aria-hidden="true" />
            <span className="text-base font-medium">Table View</span>
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="test">
        <Carousel tiles={tiles} />
        </div>
      ) : (
        <div className="rounded-2xl bg-sand-light p-8 overflow-hidden">
          <DemoTilesTable tiles={tiles} />
        </div>
      )}
    </div>
  )
}
