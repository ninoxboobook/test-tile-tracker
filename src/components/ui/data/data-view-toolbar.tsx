'use client'

import { Table } from '@tanstack/react-table'
import { Input } from './data-input'
import { ViewToggle } from './data-view-toggle'
import { DataTableColumnOptions } from './data-table-column-options'
import { Menu } from '@headlessui/react'

export type FilterOption = {
  id: string
  label: string
  options: {
    label: string
    value: string | number
  }[]
}

interface DataViewToolbarProps<TData> {
  view: 'grid' | 'table'
  onViewChange: (view: 'grid' | 'table') => void
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  table?: Table<TData>
  filters?: FilterOption[]
  activeFilters: Record<string, (string | number)[]>
  onFilterChange: (filterId: string, values: (string | number)[]) => void
}

export function DataViewToolbar<TData>({
  view,
  onViewChange,
  search,
  onSearchChange,
  searchPlaceholder,
  table,
  filters = [],
  activeFilters = {},
  onFilterChange,
}: DataViewToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Input
          placeholder={searchPlaceholder}
          value={search ?? ''}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 w-[200px]"
        />
        {filters.map(filter => (
          <Menu as="div" key={filter.id} className="relative">
            <Menu.Button 
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${
                activeFilters[filter.id]?.length 
                  ? 'bg-clay-100 text-clay-900 border-clay-200 hover:bg-clay-200' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Filter by {filter.label}
              {activeFilters[filter.id]?.length > 0 && (
                <span className="ml-1 rounded-full bg-clay-200 px-2 py-0.5 text-xs font-medium text-clay-900">
                  {activeFilters[filter.id].length}
                </span>
              )}
            </Menu.Button>
            <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="p-2">
                <div className="space-y-2">
                  {filter.options.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-clay-600 focus:ring-clay-500"
                        checked={activeFilters[filter.id]?.includes(option.value) ?? false}
                        onChange={(e) => {
                          const currentValues = activeFilters[filter.id] || []
                          const newValues = e.target.checked
                            ? [...currentValues, option.value]
                            : currentValues.filter((v) => v !== option.value)
                          onFilterChange(filter.id, newValues)
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {activeFilters[filter.id]?.length > 0 && (
                  <button
                    onClick={() => onFilterChange(filter.id, [])}
                    className="mt-2 w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </Menu.Items>
          </Menu>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        {view === 'table' && table && <DataTableColumnOptions table={table} />}
        <ViewToggle view={view} onChange={onViewChange} />
      </div>
    </div>
  )
}