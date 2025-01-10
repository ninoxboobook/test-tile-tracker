'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PageLayout } from '@/components/ui/layout/page-layout'

interface Section {
  title: string
  id: string
  subsections?: Section[]
}

const sections: Section[] = [
  {
    title: 'About',
    id: 'about',
    subsections: [
      { title: 'Changelog', id: 'changelog' },
      { title: 'Roadmap and suggestions', id: 'roadmap-and-suggestions' },
      { title: 'Report a bug', id: 'report-a-bug' },
      { title: 'Guidelines', id: 'guidelines' },
    ]
  },
  {
    title: 'Using Test Tile Tracker',
    id: 'guide',
    subsections: [
      { 
        title: 'Getting started', 
        id: 'getting-started',
        subsections: [
          { title: 'How TTT works', id: 'how-ttt-works' },
          { title: 'Creating an account', id: 'creating-an-account' },
          { title: 'Navigation', id: 'navigation' },
          { title: 'Getting help', id: 'getting-help' },
          { title: 'Editing your profile', id: 'editing-your-profile' },
        ]
      },
      { 
        title: 'The Test Tile Tracker process', 
        id: 'the-test-tile-tracker-process',
        subsections: [
          { title: 'Basic', id: 'basic' },
          { title: 'Advanced', id: 'advanced' },
        ]
      },
      { title: 'Clay bodies: your foundation library', id: 'clay-bodies-your-foundation-library' },
      { title: 'Decorations: building your surface treatment library', id: 'decorations-building-your-surface-treatment-library' },
      { title: 'Test tiles: bringing it all together', id: 'test-tiles-bringing-it-all-together' },
      { title: 'Collections: organising your experiments', id: 'collections-organising-your-experiments' },
    ]
  },
  {
    title: 'Getting the most out of your library',
    id: 'getting-the-most-out-of-your-library',
    subsections: [
      { title: 'Sort, filter and search', id: 'sort-filter-and-search' },
      { title: 'Table and grid view', id: 'table-and-grid-view' },
      { title: 'Showing and hiding columns', id: 'showing-and-hiding-columns' },
    ]
  }
]

function NavLink({ section, level = 0 }: { section: Section; level?: number }) {
  const pathname = usePathname()
  const currentSection = pathname.split('#')[1]
  const isActive = currentSection === section.id

  return (
    <li>
      <Link
        href={`/docs#${section.id}`}
        className={`
          block font-medium py-2
          ${level > 0 ? `pl-${level * 4}` : ''}
          ${isActive 
            ? 'text-brand' 
            : 'text-clay-700 hover:text-brand'
          }
        `}
      >
        {section.title}
      </Link>
      {section.subsections && (
        <ul className="ml-4">
          {section.subsections.map((subsection) => (
            <NavLink 
              key={subsection.id} 
              section={subsection} 
              level={level + 1} 
            />
          ))}
        </ul>
      )}
    </li>
  )
}

interface DocsLayoutProps {
  children: React.ReactNode
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    document.querySelectorAll('h1[id], h2[id], h3[id]').forEach((heading) => {
      observer.observe(heading)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <PageLayout
      title="Documentation"
      description="Learn how to get the most out of Test Tile Tracker"
      variant="detail"
    >
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <div className="col-span-3">
          <div className="sticky top-8 bg-sand border border-clay-300 rounded-2xl py-4 px-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav aria-label="Documentation">
              <ul className="space-y-1">
                {sections.map((section) => (
                  <NavLink key={section.id} section={section} />
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          <div className="bg-sand-light rounded-2xl py-14 px-16 prose prose-clay max-w-none">
            {children}
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 