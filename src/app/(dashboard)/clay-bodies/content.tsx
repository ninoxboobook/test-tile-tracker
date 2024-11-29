'use client'

import { ClayBody } from '@prisma/client'
import { ClayBodiesTable } from '@/components/clay-bodies/clay-bodies-table'
import { ClayBodiesGrid } from '@/components/clay-bodies/clay-bodies-grid'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { useViewPreference } from '@/hooks/use-view-preference'
import { ViewToggle } from '@/components/ui/data-view/view-toggle'
import Link from 'next/link'

interface ClayBodiesContentProps {
  clayBodies: ClayBody[]
}

export function ClayBodiesContent({ clayBodies }: ClayBodiesContentProps) {
  const [view, setView] = useViewPreference('clay-bodies')

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
      {view === 'table' ? (
        <ClayBodiesTable 
          clayBodies={clayBodies} 
          view={view}
          onViewChange={setView}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <ViewToggle view={view} onChange={setView} />
          </div>
          <ClayBodiesGrid clayBodies={clayBodies} />
        </div>
      )}
    </PageLayout>
  )
} 