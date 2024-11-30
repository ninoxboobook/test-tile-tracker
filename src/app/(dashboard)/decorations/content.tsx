'use client'

import { Decoration } from '@prisma/client'
import { useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { DecorationsTable, columns } from '@/components/decorations/decorations-table'
import { DecorationsGrid } from '@/components/decorations/decorations-grid'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { useViewPreference } from '@/hooks/use-view-preference'
import { DataViewToolbar } from '@/components/ui/data-view/data-view-toolbar'
import Link from 'next/link'

interface DecorationsContentProps {
  decorations: Decoration[]
}

export function DecorationsContent({ decorations }: DecorationsContentProps) {
  const [view, setView] = useViewPreference('decorations')
  const [filter, setFilter] = useState('')

  const filteredDecorations = useMemo(() => {
    return decorations.filter(decoration => 
      decoration.name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [decorations, filter])

  const table = useReactTable({
    data: filteredDecorations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <PageLayout 
      title="Decorations"
      description="Manage your surface decorations and techniques"
      action={
        <Link href="/decorations/new">
          <ActionButton>Add New Decoration</ActionButton>
        </Link>
      }
    >
      <div className="space-y-4">
        <DataViewToolbar
          view={view}
          onViewChange={setView}
          filter={filter}
          onFilterChange={setFilter}
          filterPlaceholder="Filter decorations..."
          table={view === 'table' ? table : undefined}
        />
        {view === 'table' ? (
          <DecorationsTable 
            decorations={filteredDecorations}
            table={table}
          />
        ) : (
          <DecorationsGrid decorations={filteredDecorations} />
        )}
      </div>
    </PageLayout>
  )
} 