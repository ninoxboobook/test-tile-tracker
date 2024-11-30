'use client'

import { ClayBody } from '@prisma/client'
import { useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { ClayBodiesTable, columns } from '@/components/clay-bodies/clay-bodies-table'
import { ClayBodiesGrid } from '@/components/clay-bodies/clay-bodies-grid'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { useViewPreference } from '@/hooks/use-view-preference'
import { DataViewToolbar } from '@/components/ui/data-view/data-view-toolbar'
import Link from 'next/link'

interface ClayBodiesContentProps {
  clayBodies: ClayBody[]
}

export function ClayBodiesContent({ clayBodies }: ClayBodiesContentProps) {
  const [view, setView] = useViewPreference('clay-bodies')
  const [filter, setFilter] = useState('')

  const filteredClayBodies = useMemo(() => {
    return clayBodies.filter(clayBody => 
      clayBody.name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [clayBodies, filter])

  const table = useReactTable({
    data: filteredClayBodies,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <PageLayout 
      title="Clay Bodies"
      description="Manage your clay body recipes and specifications"
      action={
        <Link href="/clay-bodies/new">
          <ActionButton>Add New Clay Body</ActionButton>
        </Link>
      }
    >
      <div className="space-y-4">
        <DataViewToolbar
          view={view}
          onViewChange={setView}
          filter={filter}
          onFilterChange={setFilter}
          filterPlaceholder="Filter clay bodies..."
          table={view === 'table' ? table : undefined}
        />
        {view === 'table' ? (
          <ClayBodiesTable 
            clayBodies={filteredClayBodies}
            table={table}
          />
        ) : (
          <ClayBodiesGrid clayBodies={filteredClayBodies} />
        )}
      </div>
    </PageLayout>
  )
} 