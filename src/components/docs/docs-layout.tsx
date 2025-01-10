'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PageLayout } from '@/components/ui/layout/page-layout'

interface Section {
	title: string
	id: string
	defaultCollapsed?: boolean
	subsections?: Section[]
}

const sections: Section[] = [
	{
		title: 'About',
		id: 'about',
		defaultCollapsed: true,
		subsections: [
			{ title: 'Changelog', id: 'changelog' },
			{ title: 'Roadmap and suggestions', id: 'roadmap-and-suggestions' },
			{ title: 'Report a bug', id: 'report-a-bug' },
			{ title: 'Guidelines', id: 'guidelines' },
		]
	},
	{
		title: 'Getting started',
		id: 'getting-started',
		subsections: [
			{ title: 'Creating an account', id: 'creating-an-account' },
			{ title: 'Navigation', id: 'navigation' },
			{ title: 'Getting help', id: 'getting-help' },
			{ title: 'Editing your profile', id: 'editing-your-profile' },
		]
	},
	{
		title: 'Using Test Tile Tracker',
		id: 'using-test-tile-tracker',
		subsections: [

			{ title: 'Adding a clay body', id: 'clay-bodies' },
			{ title: 'Adding a decoration', id: 'decorations' },
			{ title: 'Adding a test tile', id: 'test-tiles' },
			{ title: 'Adding a collection', id: 'collections' },
			{ title: 'Advanced use', id: 'advanced' },
		]
	},
	{
		title: 'Getting the most out of your library',
		id: 'getting-the-most-out-of-your-library',
		subsections: [
			{ title: 'Sort, filter and search', id: 'sort-filter-search' },
			{ title: 'Table and grid view', id: 'table-grid-view' },
			{ title: 'Showing and hiding columns', id: 'showing-hiding-columns' },
		]
	}
]

function NavLink({ section, level = 0, activeSection, containerRef }: {
	section: Section
	level?: number
	activeSection: string
	containerRef: React.RefObject<HTMLDivElement>
}) {
	const isActive = activeSection === section.id
	const linkRef = useRef<HTMLAnchorElement>(null)
	const [isCollapsed, setIsCollapsed] = useState(section.defaultCollapsed || false)

	useEffect(() => {
		if (section.subsections) {
			const isChildActive = section.subsections.some(subsection => subsection.id === activeSection)
			
			if (isChildActive) {
				setIsCollapsed(false)
			} else if (section.defaultCollapsed) {
				setIsCollapsed(true)
			}
		}
	}, [activeSection, section.subsections, section.defaultCollapsed])

	// Scroll active link into view
	useEffect(() => {
		if (isActive && linkRef.current && containerRef.current) {
			const container = containerRef.current
			const link = linkRef.current
			const containerRect = container.getBoundingClientRect()
			const linkRect = link.getBoundingClientRect()

			if (linkRect.top < containerRect.top || linkRect.bottom > containerRect.bottom) {
				link.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
			}
		}
	}, [isActive])

	return (
		<li>
			<Link
				ref={linkRef}
				href={`#${section.id}`}
				className={`
					block py-2 font-medium transition-colors duration-200
					${level > 0 ? `pl-${level * 4}` : ''}
					${isActive
						? 'text-brand underline'
						: 'text-clay-700 hover:text-brand'
					}
				`}
			>
				{section.title}
			</Link>
			{section.subsections && (
				<div className={`
					overflow-hidden transition-all duration-500 ease-in-out
					${isCollapsed ? 'max-h-0' : 'max-h-[500px]'}
				`}>
					<ul className="ml-4">
						{section.subsections.map((subsection) => (
							<NavLink
								key={subsection.id}
								section={subsection}
								level={level + 1}
								activeSection={activeSection}
								containerRef={containerRef}
							/>
						))}
					</ul>
				</div>
			)}
		</li>
	)
}

interface DocsLayoutProps {
	children: React.ReactNode
}

export function DocsLayout({ children }: DocsLayoutProps) {
	const [activeSection, setActiveSection] = useState('')
	const navContainerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
						setActiveSection(entry.target.id)
					}
				})
			},
			{
				rootMargin: '-20% 0px -35% 0px', // Adjust these values to change when sections become active
				threshold: [0.5]
			}
		)

		// Observe all section headings
		const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]')
		headings.forEach((heading) => observer.observe(heading))

		return () => {
			headings.forEach((heading) => observer.unobserve(heading))
		}
	}, [])

	// Handle initial section on page load
	useEffect(() => {
		const hash = window.location.hash.slice(1)
		if (hash) {
			setActiveSection(hash)
		}
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
					<div className="sticky top-8 bg-sand border border-clay-300 rounded-2xl overflow-hidden">
						{/* Gradient overlays */}
						<div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-sand to-transparent z-10" />
						<div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-sand to-transparent z-10" />

						{/* Scrollable content */}
						<div
							ref={navContainerRef}
							className="relative max-h-[calc(100vh-4rem)] overflow-y-auto scroll-smooth py-4 px-6"
						>
							<h2 className="uppercase text-clay-500 font-medium mt-2 mb-4">Contents</h2>
							<nav aria-label="Documentation">
								<ul className="space-y-1">
									{sections.map((section) => (
										<NavLink
											key={section.id}
											section={section}
											activeSection={activeSection}
											containerRef={navContainerRef}
										/>
									))}
								</ul>
							</nav>
						</div>
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