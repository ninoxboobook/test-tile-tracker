import Link from 'next/link'

interface DashboardCardProps {
  title: string
  count: number
  href: string
  description: string
}

export function DashboardCard({ title, count, href, description }: DashboardCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
      <dt>
        <div className="absolute rounded-md bg-clay-500 p-3">
          <div className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <p className="ml-16 truncate text-sm font-medium text-clay-500">{title}</p>
      </dt>
      <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
        <p className="text-2xl font-semibold text-clay-900">{count}</p>
        <div className="absolute inset-x-0 bottom-0 bg-clay-50 px-4 py-4 sm:px-6">
          <div className="text-sm">
            <Link href={href} className="font-medium text-clay-600 hover:text-clay-500">
              {description}
              <span className="sr-only"> {title}</span>
            </Link>
          </div>
        </div>
      </dd>
    </div>
  )
}
