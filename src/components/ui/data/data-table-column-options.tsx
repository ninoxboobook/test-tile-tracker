'use client'

import { Table } from '@tanstack/react-table'
import { Menu } from '@headlessui/react'
import { EyeIcon } from '@heroicons/react/24/outline'

interface DataTableColumnOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableColumnOptions<TData>({
  table,
}: DataTableColumnOptionsProps<TData>) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
        <EyeIcon className="h-4 w-4" />
        Show/Hide Columns
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="p-2">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              const headerText = typeof column.columnDef.header === 'string' 
                ? column.columnDef.header 
                : column.id

              return (
                <div key={column.id} className="px-1 py-1">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-clay-600 focus:ring-clay-500"
                      {...{
                        checked: column.getIsVisible(),
                        onChange: column.getToggleVisibilityHandler(),
                      }}
                    />
                    <span className="ml-2">{headerText}</span>
                  </label>
                </div>
              )
            })}
        </div>
      </Menu.Items>
    </Menu>
  )
} 