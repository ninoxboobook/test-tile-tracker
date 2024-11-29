'use client'

import { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/forms/input'
import { DataTableViewOptions } from './data-table-view-options'
import { ViewToggle } from '@/components/ui/data-view/view-toggle'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterColumn?: string
  view: 'grid' | 'table'
  onViewChange: (view: 'grid' | 'table') => void
}

export function DataTableToolbar<TData>({
  table,
  filterColumn,
  view,
  onViewChange,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {filterColumn && (
          <Input
            placeholder="Filter..."
            value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
      </div>
      <div className="flex items-center space-x-4">
        <ViewToggle view={view} onChange={onViewChange} />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
} 