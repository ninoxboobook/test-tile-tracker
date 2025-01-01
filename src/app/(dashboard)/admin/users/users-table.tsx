'use client'

import { DataTable } from '@/components/ui/data/data-table'
import { DataTablePagination } from '@/components/ui/data/data-pagination'
import { ActionButton } from '@/components/ui/buttons/action-button'
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { deleteUser, updateUserRole } from './actions'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

type User = {
  id: string
  email: string
  username: string | null
  role: string
  createdAt: string
  updatedAt: string
  _count: {
    testTiles: number
    decorations: number
    clayBodies: number
    collections: number
  }
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => {
      const username = row.original.username
      const userId = row.original.id
      return username ? (
        <Link 
          href={`/admin/users/${userId}`}
          className="text-brand underline"
        >
          {username}
        </Link>
      ) : '—'
    }
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: '_count.testTiles',
    header: 'Test Tiles',
  },
  {
    accessorKey: '_count.decorations',
    header: 'Decorations',
  },
  {
    accessorKey: '_count.clayBodies',
    header: 'Clay Bodies',
  },
  {
    accessorKey: '_count.collections',
    header: 'Collections',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => formatDate(new Date(row.original.createdAt)),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original
      const [isDeleting, setIsDeleting] = useState(false)
      const [isUpdating, setIsUpdating] = useState(false)

      const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete user ${user.email}? This will delete all their content.`)) {
          return
        }
        setIsDeleting(true)
        try {
          await deleteUser(user.id)
        } catch (error) {
          console.error('Failed to delete user:', error)
          alert('Failed to delete user')
        } finally {
          setIsDeleting(false)
        }
      }

      const handleRoleToggle = async () => {
        const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
        if (!confirm(`Are you sure you want to change ${user.email}'s role to ${newRole}?`)) {
          return
        }
        setIsUpdating(true)
        try {
          await updateUserRole(user.id, newRole)
        } catch (error) {
          console.error('Failed to update user role:', error)
          alert('Failed to update user role')
        } finally {
          setIsUpdating(false)
        }
      }

      return (
        <div className="flex gap-2">
          <ActionButton
            variant="secondary"
            size="compact"
            onClick={handleRoleToggle}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : `Make ${user.role === 'ADMIN' ? 'User' : 'Admin'}`}
          </ActionButton>
          <ActionButton
            variant="danger"
            size="compact"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </ActionButton>
        </div>
      )
    }
  },
]

interface UsersTableProps {
  users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="space-y-6">
      <DataTable columns={columns} data={users} table={table} />
      <DataTablePagination table={table} />
    </div>
  )
}
