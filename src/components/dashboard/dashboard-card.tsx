import Link from 'next/link'

interface DashboardCardProps {
  title: string
  count: number
  href: string
  description: string
}

export function DashboardCard({ title, count, href, description }: DashboardCardProps) {
  return (
    <div className="rounded-2xl bg-sand-light">
        <div className="flex items-center gap-4 px-6 pt-6 pb-5">
        <div className="rounded-md bg-clay-500 h-12 w-12"></div>
        <div>
        <h3 className="font-medium text-clay-700 text-sm">{title}</h3>
        <p className="text-2xl font-semibold text-clay-900">{count}</p>
        </div>
        </div>
        <div className="border-t border-clay-200 px-6 pt-4 pb-5">
          <Link href={href} className="font-medium text-brand-dark hover:text-clay-800">
            {description}
            <span className="sr-only"> {title}</span>
          </Link>
        </div>
    </div>
  )
}
