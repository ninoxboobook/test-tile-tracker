'use client'

import { Table } from '@tanstack/react-table'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/20/solid'
import { Listbox } from '@headlessui/react'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-clay-700">
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Listbox
            value={table.getState().pagination.pageSize}
            onChange={(value) => table.setPageSize(Number(value))}
          >
            <div className="flex items-center">
              <Listbox.Label>Rows per page</Listbox.Label>
              <div className="relative ml-2">
                <Listbox.Button className="relative h-8 w-16 rounded-md border border-clay-300 bg-white pl-3 pr-8 text-left focus:outline-none focus:ring-2 focus:ring-clay-500 focus:border-clay-500">
                  <span>{table.getState().pagination.pageSize}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronRightIcon
                      className="h-4 w-4 text-clay-400 rotate-90"
                      aria-hidden="true"
                    />
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
        <div className="flex w-[100px] items-center justify-center font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="rounded-md border p-1 disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          </button>
          <button
            className="rounded-md border p-1 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            className="rounded-md border p-1 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <button
            className="rounded-md border p-1 disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronDoubleRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}