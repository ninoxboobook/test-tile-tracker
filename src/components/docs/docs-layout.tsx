'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

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

function NavLink({ 
	section, 
	level = 0, 
	activeSection, 
	containerRef, 
	isMobile,
	onLinkClick 
}: {
	section: Section
	level?: number
	activeSection: string
	containerRef: React.RefObject<HTMLDivElement>
	isMobile: boolean
	onLinkClick?: () => void
}) {
	const isActive = activeSection === section.id
	const linkRef = useRef<HTMLAnchorElement>(null)
	const [isCollapsed, setIsCollapsed] = useState(section.defaultCollapsed || false)

	// Only apply auto-collapse behavior on desktop
	useEffect(() => {
		if (!isMobile && section.subsections) {
			const isChildActive = section.subsections.some(subsection => subsection.id === activeSection)
			
			if (isChildActive) {
				setIsCollapsed(false)
			} else if (section.defaultCollapsed) {
				setIsCollapsed(true)
			}
		}
	}, [activeSection, section.subsections, section.defaultCollapsed, isMobile])

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

	const handleClick = (e: React.MouseEvent) => {
		if (isMobile && onLinkClick) {
			e.preventDefault()
			e.stopPropagation()
			onLinkClick()
			
			setTimeout(() => {
				const element = document.getElementById(section.id)
				if (element) {
					const headerOffset = 80
					const elementPosition = element.getBoundingClientRect().top
					const offsetPosition = elementPosition + window.pageYOffset - headerOffset
					
					window.scrollTo({
						top: offsetPosition,
						behavior: 'smooth'
					})
				}
			}, 200)
		}
	}

	return (
		<li>
			<Link
				ref={linkRef}
				href={`#${section.id}`}
				onClick={handleClick}
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
					overflow-hidden transition-all duration-200 ease-in-out
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
								isMobile={isMobile}
								onLinkClick={onLinkClick}
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
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false)
	const navContainerRef = useRef<HTMLDivElement>(null)

	// Handle window resize
	useEffect(() => {
		const handleResize = () => {
			setIsDesktop(window.innerWidth >= 1024)
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	// Only update activeSection from hash on desktop
	useEffect(() => {
		if (isDesktop) {
			const hash = window.location.hash.slice(1)
			if (hash) {
				setActiveSection(hash)
			}
		}
	}, [isDesktop])

	// Intersection observer only needed for desktop
	useEffect(() => {
		if (isDesktop) {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
							setActiveSection(entry.target.id)
						}
					})
				},
				{
					rootMargin: '-20% 0px -35% 0px',
					threshold: [0.5]
				}
			)

			const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]')
			headings.forEach((heading) => observer.observe(heading))

			return () => {
				headings.forEach((heading) => observer.unobserve(heading))
			}
		}
	}, [isDesktop])

	const handleMobileNavClick = () => {
		setIsMobileMenuOpen(false)
	}

	return (
		<PageLayout
			title="Documentation"
			description="Learn how to get the most out of Test Tile Tracker"
			variant="detail"
		>
			{/* Mobile/Tablet Navigation Toggle */}
			<div className="lg:hidden sticky top-4 z-10 mb-8">
				<button
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="w-full bg-sand border border-clay-300 rounded-2xl px-6 py-4 flex items-center justify-between"
				>
					<span className="uppercase text-clay-600 font-medium">Contents</span>
					<ChevronDownIcon 
						className={`w-5 h-5 text-clay-600 transform transition-transform duration-200 
							${isMobileMenuOpen ? 'rotate-180' : ''}
						`}
					/>
				</button>
				
				{/* Mobile/Tablet Navigation */}
				<div className={`
					overflow-hidden transition-all duration-200 ease-in-out mt-2
					${isMobileMenuOpen ? 'max-h-[80vh]' : 'max-h-0'}
				`}>
					<div className="bg-sand border border-clay-300 rounded-2xl overflow-hidden">
						<div
							ref={navContainerRef}
							className="relative max-h-[70vh] overflow-y-auto scroll-smooth py-4 px-6"
						>
							<nav aria-label="Documentation">
								<ul className="space-y-1">
									{sections.map((section) => (
										<NavLink
											key={section.id}
											section={section}
											activeSection={activeSection}
											containerRef={navContainerRef}
											isMobile={true}
											onLinkClick={handleMobileNavClick}
										/>
									))}
								</ul>
							</nav>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-12 gap-8">
				{/* Desktop Navigation */}
				<div className="hidden lg:block col-span-3">
					<div className="sticky top-8 bg-sand border border-clay-300 rounded-2xl overflow-hidden">
						{/* Gradient overlays */}
						<div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-sand to-transparent z-10" />
						<div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-sand to-transparent z-10" />

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
											isMobile={false}
										/>
									))}
								</ul>
							</nav>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="col-span-12 lg:col-span-9">
					<div className="bg-sand-light rounded-2xl py-14 px-16 prose prose-clay max-w-none">
						{children}
					</div>
				</div>
			</div>
		</PageLayout>
	)
} 