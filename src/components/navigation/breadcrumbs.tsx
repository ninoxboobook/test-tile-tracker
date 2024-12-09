'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'

interface BreadcrumbsProps {
  title?: string;
}

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
  const breadcrumbs = generateBreadcrumbs(pathname, title)

  if (breadcrumbs.length <= 1) return null

  return (
    <nav className="flex text-sm text-gray-500" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        <li>
          <Link
            href="/"
            className="text-gray-400 hover:text-gray-500"
          >
            <HomeIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
            <Link
              href={breadcrumb.href}
              className="ml-2 hover:text-gray-700"
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