'use client'

import { Table } from '@tanstack/react-table'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/20/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { Listbox } from '@headlessui/react'
import { ActionButton } from '@/components/ui/buttons/action-button'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-3">
        <div className="font-medium text-clay-800 translate-y-[-2px]">
          Showing {table.getRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} items
        </div>
        <span className="text-clay-500 translate-y-[-2px]">◗</span>
        <div className="flex items-center space-x-2">
          <Listbox
            value={table.getState().pagination.pageSize}
            onChange={(value) => table.setPageSize(Number(value))}
          >
            <div className="flex items-center">
              <Listbox.Label className="text-clay-800 translate-y-[-2px]">Items per page</Listbox.Label>
              <div className="relative ml-3">
                <Listbox.Button className="relative rounded-md border border-clay-400 bg-sand-light py-2 pl-3 pr-7 text-left font-medium text-sm text-clay-700 focus:outline-none focus:ring-2 focus:ring-brand focus:border-clay-500">
                  <span className="inline-flex items-center translate-y-[-1px]">{table.getState().pagination.pageSize}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon className="h-4 w-4 pt-[1px]" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute right-0 mt-1 w-16 rounded-md bg-white shadow-lg border border-clay-200 focus:outline-none z-10">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <Listbox.Option
                      key={pageSize}
                      value={pageSize}
                      className={({ active }) =>
                        `${active ? 'bg-clay-100 text-clay-900' : 'text-clay-900'} relative cursor-pointer select-none py-2 pl-3 pr-9`
                      }
                    >
                      {pageSize}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </div>
          </Listbox>
        </div>
      </div>
      <div className="flex items-center space-x-6">

        <div className="flex items-center space-x-2">
          <Listbox
            value={table.getState().pagination.pageIndex}
            onChange={(value) => table.setPageIndex(Number(value))}
          >
            <div className="flex items-center">
              <Listbox.Label className="text-clay-800 translate-y-[-2px]">Jump to page</Listbox.Label>
              <div className="relative ml-3">
                <Listbox.Button className="relative rounded-md border border-clay-400 bg-sand-light py-2 pl-3 pr-7 text-left font-medium text-sm text-clay-700 focus:outline-none focus:ring-2 focus:ring-brand focus:border-clay-500">
                  <span className="inline-flex items-center translate-y-[-1px]">{table.getState().pagination.pageIndex + 1}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDownIcon className="h-4 w-4 pt-[1px]" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute right-0 mt-1 max-h-60 w-16 overflow-auto rounded-md bg-white shadow-lg border border-clay-200 focus:outline-none z-10">
                  {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIndex) => (
                    <Listbox.Option
                      key={pageIndex}
                      value={pageIndex}
                      className={({ active }) =>
                        `${active ? 'bg-clay-100 text-clay-900' : 'text-clay-900'} relative cursor-pointer select-none py-2 pl-3 pr-9`
                      }
                    >
                      {pageIndex + 1}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
              <span className="ml-3 text-clay-800 translate-y-[-2px]">of {table.getPageCount()} pages</span>
            </div>
          </Listbox>
        </div>
        <div className="flex items-center space-x-2">
          <ActionButton
            variant="primary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="!p-2 disabled:opacity-50"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="!p-2 disabled:opacity-50"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </ActionButton>
        </div>
      </div>
    </div>
  )
}