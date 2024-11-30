'use client'

import { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/forms/input'
import { ViewToggle } from './view-toggle'
import { DataTableViewOptions } from '../data-table/data-table-view-options'

interface DataViewToolbarProps<TData> {
  view: 'grid' | 'table'
  onViewChange: (view: 'grid' | 'table') => void
  filter: string
  onFilterChange: (value: string) => void
  filterPlaceholder: string
  table?: Table<TData>
}

export function DataViewToolbar<TData>({
  view,
  onViewChange,
  filter,
  onFilterChange,
  filterPlaceholder,
  table
}: DataViewToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <Input
        placeholder={filterPlaceholder}
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="h-8 w-[250px]"
      />
      <div className="flex items-center space-x-2">
        {view === 'table' && table && <DataTableViewOptions table={table} />}
		<ViewToggle view={view} onChange={onViewChange} />
      </div>
    </div>
  )
}