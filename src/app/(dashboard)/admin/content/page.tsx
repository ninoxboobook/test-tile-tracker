import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/ui/layout/page-layout'
import Link from 'next/link'

async function getContentStats() {
  const [
    clayBodiesCount,
    decorationsCount,
    testTilesCount,
    collectionsCount
  ] = await Promise.all([
    prisma.clayBody.count(),
    prisma.decoration.count(),
    prisma.testTile.count(),
    prisma.collection.count()
  ])

  return {
    clayBodies: clayBodiesCount,
    decorations: decorationsCount,
    testTiles: testTilesCount,
    collections: collectionsCount
  }
}

const contentTypes = [
  {
    name: 'Clay Bodies',
    href: '/admin/content/clay-bodies',
    statsKey: 'clayBodies',
    icon: (
      <svg className="h-6 w-6 text-clay-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    name: 'Decorations',
    href: '/admin/content/decorations',
    statsKey: 'decorations',
    icon: (
      <svg className="h-6 w-6 text-clay-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    name: 'Test Tiles',
    href: '/admin/content/test-tiles',
    statsKey: 'testTiles',
    icon: (
      <svg className="h-6 w-6 text-clay-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    name: 'Collections',
    href: '/admin/content/collections',
    statsKey: 'collections',
    icon: (
      <svg className="h-6 w-6 text-clay-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
  },
]

export default async function ContentPage() {
  const stats = await getContentStats()

  return (
    <PageLayout title="Content Moderation">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {contentTypes.map((item) => {
            const count = stats[item.statsKey as keyof typeof stats]
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative group rounded-lg border border-clay-200 p-6 hover:border-clay-400 transition-colors"
              >
                <div>
                  <span className="inline-flex rounded-lg">{item.icon}</span>
                  <h3 className="mt-4 text-lg font-medium text-clay-900 group-hover:text-brand">
                    {item.name}
                    <span className="absolute inset-0" />
                  </h3>
                  <p className="mt-1 text-sm text-clay-500">
                    {count} {item.name.toLowerCase()}
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute right-6 top-6 text-clay-300 group-hover:text-clay-400"
                  aria-hidden="true"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </PageLayout>
  )
}
