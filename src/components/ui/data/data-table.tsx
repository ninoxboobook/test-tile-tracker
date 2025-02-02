'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
  Table,
} from '@tanstack/react-table'
import { useState } from 'react'
import { 
  ChevronUpDownIcon, 
  ChevronUpIcon, 
  ChevronDownIcon 
} from '@heroicons/react/16/solid'

function SortIcon({ isSorted, isSortedDesc }: { isSorted: boolean; isSortedDesc: boolean | undefined }) {
  if (!isSorted) {
    return (
      <ChevronUpDownIcon className="w-4 h-4 ml-[3px] text-clay-500" aria-hidden="true" />
    )
  }

  if (isSortedDesc) {
    return (
      <ChevronDownIcon className="w-4 h-4 ml-[3px] text-clay-700" aria-hidden="true" />
    )
  }

  return (
    <ChevronUpIcon className="w-4 h-4 ml-[3px] text-clay-700" aria-hidden="true" />
  )
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  table?: Table<TData>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  table: externalTable,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = externalTable ?? useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => {
                const isFirst = index === 0;
                const isLast = index === headerGroup.headers.length - 1;
                const roundedClasses = 
                  isFirst ? 'rounded-l-lg' : 
                  isLast ? 'rounded-r-lg' : '';
                
                return (
                  <th
                    key={header.id}
                    className={`bg-clay-100 px-6 py-3 text-left text-sm font-medium text-clay-700 uppercase tracking-wider ${roundedClasses}`}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                          role: header.column.getCanSort() ? 'button' : undefined,
                          'aria-label': header.column.getCanSort()
                            ? `Sort by ${header.column.columnDef.header as string}${
                                header.column.getIsSorted()
                                  ? header.column.getIsSorted() === 'desc'
                                    ? ' (sorted descending)'
                                    : ' (sorted ascending)'
                                  : ' (not sorted)'
                              }`
                            : undefined,
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <SortIcon
                            isSorted={!!header.column.getIsSorted()}
                            isSortedDesc={header.column.getIsSorted() === 'desc'}
                          />
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="text-clay-800">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-clay-200 hover:bg-clay-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="h-14 px-6 py-3 whitespace-nowrap">
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}