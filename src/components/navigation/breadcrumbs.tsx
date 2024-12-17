'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'

interface BreadcrumbsProps {
  title?: string;
}

const mainRoutes = ['/test-tiles', '/collections', '/clay-bodies', '/decorations']

function generateBreadcrumbs(pathname: string, currentTitle?: string) {
  const paths = pathname.split('/').filter(Boolean)
  const breadcrumbs = paths.map((path, index) => {
    const href = `/${paths.slice(0, index + 1).join('/')}`
    let label = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    // If this is the last segment and it's an ID (matches UUID pattern)
    // and we have a title, use the title instead
    if (
      index === paths.length - 1 && 
      currentTitle && 
      /^[a-f0-9-]{36}$/i.test(path)
    ) {
      label = currentTitle
    } else {
      // Remove dynamic route parameters for other segments
      label = label.replace(/\[.*?\]/, '')
    }

    return { href, label }
  })

  return breadcrumbs
}

export function Breadcrumbs({ title }: BreadcrumbsProps) {
  const pathname = usePathname()
  
  // Don't show breadcrumbs on dashboard
  if (pathname === '/dashboard' || pathname === '/') return null
  
  const breadcrumbs = generateBreadcrumbs(pathname, title)

  // Show breadcrumbs on main routes even if there's only one level
  if (breadcrumbs.length === 0 && !mainRoutes.includes(pathname)) return null

  return (
    <nav className="flex text-clay-500 mb-2" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        <li className="translate-y-[-2px]">
          <Link
            href="/"
            className="text-clay-500 hover:text-clay-600"
          >
            {/* <HomeIcon className="h-4 w-4" aria-hidden="true" /> */}
            Home
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-clay-500" aria-hidden="true" />
            <Link
              href={breadcrumb.href}
              className="ml-2 text-clay-700 hover:text-clay-800 translate-y-[-2px]"
              aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
            >
              {breadcrumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}