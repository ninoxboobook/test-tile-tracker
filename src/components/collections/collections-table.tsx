'use client'

import Link from 'next/link'
import { Collection } from '@prisma/client'
import { EmptyState } from '../ui/empty-state'

interface CollectionTableProps {
  collection: Collection[]
}

export function CollectionTable({ collection }: CollectionTableProps) {
  if (!collection.length) {
    return (
      <EmptyState
        title="No collections"
        description="Get started by creating a new collection."
        action={
          <Link
            href="/collections/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-clay-600 hover:bg-clay-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clay-500"
          >
            Add New Collection
          </Link>
        }
      />
    )
  }

  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                  Name
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Created
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Description
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {collection.map((collection) => (
                <tr key={collection.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {collection.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(collection.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {collection.description}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <Link
                      href={`/collections/${collection.id}/edit`}
                      className="text-clay-600 hover:text-clay-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
