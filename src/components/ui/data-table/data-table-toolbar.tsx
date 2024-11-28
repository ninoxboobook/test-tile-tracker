'use client'

import { Table } from '@tanstack/react-table'
import { Input } from '../forms/input'
import { DataTableViewOptions } from './data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterColumn?: string
}

export function DataTableToolbar<TData>({
  table,
  filterColumn,
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
      <DataTableViewOptions table={table} />
    </div>
  )
} 