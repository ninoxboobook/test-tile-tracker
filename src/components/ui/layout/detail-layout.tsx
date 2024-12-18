import { DetailImage } from '../detail-image'
import Link from 'next/link'

interface DetailItem {
  label: string
  value: string | null | undefined
}

interface DetailLayoutProps {
  title: string
  items: DetailItem[]
  images?: string[]
}

export function DetailLayout({ title, items, images }: DetailLayoutProps) {
  const renderValue = (value: string | null | undefined) => {
    if (!value) return null
    
    // Handle internal links with format "/path|text"
    if (value.startsWith('/')) {
      return value.split('\n').map((line, i) => {
        const [href, text] = line.split('|')
        return (
          <div key={i}>
            <Link href={href} className="text-indigo-600 hover:text-indigo-500">
              {text}
            </Link>
          </div>
        )
      })
    }
    
    // Check if the value is an external URL
    try {
      const url = new URL(value)
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-500"
        >
          View on {url.hostname.replace('www.', '')}
        </a>
      )
    } catch {
      return value
    }
  }

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-7">
        <div className="bg-sand-light rounded-2xl p-8">
          <h2 className="text-2xl font-display font-semibold text-clay-800 mb-6">{title}</h2>
          <dl className="space-y-4">
            {items.map((item, index) => (
              item.value && (
                <div key={index}>
                  <dt className="text-sm font-medium text-clay-500">{item.label}</dt>
                  <dd className="mt-1 text-sm text-clay-900 whitespace-pre-wrap">
                    {renderValue(item.value)}
                  </dd>
                </div>
              )
            ))}
          </dl>
        </div>
      </div>
      <div className="col-span-5">
        <DetailImage images={images} />
      </div>
    </div>
  )
}
