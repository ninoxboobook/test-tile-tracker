'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navigation = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Users', href: '/admin/users' },
  { 
    name: 'Reference Data', 
    href: '/admin/reference-data',
    children: [
      { name: 'Clay Body Types', href: '/admin/reference-data/clay-body-types' },
      { name: 'Cones', href: '/admin/reference-data/cones' },
      { name: 'Atmospheres', href: '/admin/reference-data/atmospheres' },
      { name: 'Decoration Types', href: '/admin/reference-data/decoration-types' },
    ]
  },
  { 
    name: 'Content', 
    href: '/admin/content',
    children: [
      { name: 'Clay Bodies', href: '/admin/content/clay-bodies' },
      { name: 'Decorations', href: '/admin/content/decorations' },
      { name: 'Test Tiles', href: '/admin/content/test-tiles' },
      { name: 'Collections', href: '/admin/content/collections' },
    ]
  },
  { name: 'Settings', href: '/admin/settings' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-sand-light border-b border-clay-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/admin" className="text-2xl font-display font-semibold text-clay-800">
                Admin
              </Link>
            </div>
            <div className="ml-6 flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                    pathname === item.href
                      ? 'border-brand text-clay-900'
                      : 'border-transparent text-clay-500 hover:border-clay-300 hover:text-clay-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      {navigation.find(item => pathname.startsWith(item.href))?.children && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-clay-200 py-3">
            <div className="flex space-x-8">
              {navigation
                .find(item => pathname.startsWith(item.href))
                ?.children?.map((subItem) => (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    className={
                      pathname === subItem.href
                        ? 'text-brand text-sm font-medium'
                        : 'text-clay-500 hover:text-clay-700 text-sm font-medium'
                    }
                  >
                    {subItem.name}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
