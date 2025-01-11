'use client'

import { Table } from '@tanstack/react-table'
import { Popover } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'

interface DataTableColumnOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableColumnOptions<TData>({
  table,
}: DataTableColumnOptionsProps<TData>) {
  return (
    <Popover as="div" className="relative inline-block text-left">
      <Popover.Button className="flex items-center gap-1 rounded-md border bg-sand-light border-clay-400 text-clay-700 pl-3 pr-2 py-2 text-sm font-medium hover:bg-sand">
        Columns
        <ChevronDownIcon className="h-4 w-4 pt-[1px]" aria-hidden="true" />
      </Popover.Button>
      <Popover.Panel className="absolute z-10 right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="p-2">
          <div className="space-y-2">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const headerText = typeof column.columnDef.header === 'string'
                  ? column.columnDef.header
                  : column.id
                return (
                  <div key={column.id}>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-clay-400 text-clay-600 focus:ring-brand"
                        {...{
                          checked: column.getIsVisible(),
                          onChange: column.getToggleVisibilityHandler(),
                        }}
                      />
                      <span className="ml-2 text-sm text-clay-700 translate-y-[-1px]">{headerText}</span>
                    </label>
                  </div>
                )
              })}
          </div>
        </div>
      </Popover.Panel>
    </Popover>
  )
}