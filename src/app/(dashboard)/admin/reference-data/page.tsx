import { PageLayout } from '@/components/ui/layout/page-layout'
import Link from 'next/link'

const referenceDataTypes = [
  {
    name: 'Clay Body Types',
    description: 'Manage clay body types like porcelain, stoneware, etc.',
    href: '/admin/reference-data/clay-body-types',
    icon: (
      <svg className="h-6 w-6 text-clay-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
      </svg>
    ),
  },
  {
    name: 'Cones',
    description: 'Manage pyrometric cones for firing temperatures',
    href: '/admin/reference-data/cones',
    icon: (
      <svg className="h-6 w-6 text-clay-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      </svg>
    ),
  },
  {
    name: 'Atmospheres',
    description: 'Manage firing atmospheres like oxidation, reduction, etc.',
    href: '/admin/reference-data/atmospheres',
    icon: (
      <svg className="h-6 w-6 text-clay-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    ),
  },
  {
    name: 'Decoration Types',
    description: 'Manage decoration types like glazes, slips, etc.',
    href: '/admin/reference-data/decoration-types',
    icon: (
      <svg className="h-6 w-6 text-clay-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
]

export default function ReferenceDataPage() {
  return (
    <PageLayout title="Reference Data">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {referenceDataTypes.map((item) => (
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
                <p className="mt-1 text-sm text-clay-500">{item.description}</p>
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
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
