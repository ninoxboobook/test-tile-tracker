'use client'

import { Decoration } from '@prisma/client'
import { DecorationsTable } from '@/components/decorations/decorations-table'
import { DecorationsGrid } from '@/components/decorations/decorations-grid'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { useViewPreference } from '@/hooks/use-view-preference'
import { ViewToggle } from '@/components/ui/data-view/view-toggle'
import Link from 'next/link'

interface DecorationsContentProps {
  decorations: Decoration[]
}

export function DecorationsContent({ decorations }: DecorationsContentProps) {
  const [view, setView] = useViewPreference('decorations')

  return (
    <PageLayout 
      title="Decorations"
      description="Manage your glazes, slips, and other decorative techniques"
      action={
        <Link href="/decorations/new">
          <ActionButton>Add New Decoration</ActionButton>
        </Link>
      }
    >
      {view === 'table' ? (
        <DecorationsTable 
          decorations={decorations} 
          view={view}
          onViewChange={setView}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <ViewToggle view={view} onChange={setView} />
          </div>
          <DecorationsGrid decorations={decorations} />
        </div>
      )}
    </PageLayout>
  )
} 