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
      <div className="flex gap-2 justify-center mb-8">
        <button
          onClick={() => setView('grid')}
          className={classNames(
            'inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium focus:outline-none',
            view === 'grid'
              ? 'bg-clay-100 text-clay-900'
              : 'text-clay-500 hover:text-clay-700 hover:bg-clay-50'
          )}
        >
          <Squares2X2Icon className="h-5 w-5" />
          Grid View
        </button>
        <button
          onClick={() => setView('table')}
          className={classNames(
            'inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium focus:outline-none',
            view === 'table'
              ? 'bg-clay-100 text-clay-900'
              : 'text-clay-500 hover:text-clay-700 hover:bg-clay-50'
          )}
        >
          <TableCellsIcon className="h-5 w-5" />
          Table View
        </button>
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
