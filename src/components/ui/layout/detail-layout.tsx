import { DetailImage } from '../detail-image'
import Link from 'next/link'
import { ReactNode } from 'react'

interface DetailItem {
  label: string
  value: string | null | undefined | { href: string; text: string; isPublic?: boolean }[] | {
    type: 'color'
    hex: string
    category: string
  }
}

interface DetailLayoutProps {
  title: string
  items: DetailItem[]
  images?: string[]
  isOwner?: boolean
}

export function DetailLayout({ title, items, images, isOwner = false }: DetailLayoutProps) {
  const renderValue = (value: DetailItem['value']) => {
    if (!value) return null
    
    // Handle color value
    if (typeof value === 'object' && !Array.isArray(value) && 'type' in value && value.type === 'color') {
      return (
        <div className="inline-flex items-center gap-2 mt-1 border border-clay-300 pr-3 rounded">
          <div 
            className="w-8 h-8 rounded-l" 
            style={{ backgroundColor: value.hex }}
            aria-label={value.category}
          />
          <span>{value.hex.toUpperCase()}</span>
          <span className="font-semibold">{value.category}</span>
        </div>
      )
    }
    
    // Handle array of links
    if (Array.isArray(value)) {
      // Check if this is a layer-based structure (for decorations)
      const hasLayers = value.some(item => item.text.startsWith('Layer'))
      
      if (hasLayers) {
        let currentLinks: ReactNode[] = []
        let currentLabel: ReactNode | null = null
        const result: ReactNode[] = []
        
        value.forEach((item, i) => {
          if (item.text.startsWith('Layer')) {
            if (currentLabel && currentLinks.length > 0) {
              result.push(
                <div key={result.length} className="mb-2">
                  {currentLabel}
                  {currentLinks.reduce<ReactNode[]>((acc, curr, idx) => {
                    if (idx === 0) return [curr]
                    return [...acc, ', ', curr]
                  }, [])}
                </div>
              )
            }
            currentLabel = <span className="font-medium text-clay-700">{item.text} </span>
            currentLinks = []
          } else {
            currentLinks.push(
              item.isPublic !== false ? (
                <Link key={i} href={item.href} className="text-brand underline hover:text-clay-700">
                  {item.text}
                </Link>
              ) : (
                <span key={i} className="text-clay-900">{item.text}</span>
              )
            )
          }
        })
        
        if (currentLabel && currentLinks.length > 0) {
          result.push(
            <div key={result.length} className="mb-2">
              {currentLabel}
              {currentLinks.reduce<ReactNode[]>((acc, curr, idx) => {
                if (idx === 0) return [curr]
                return [...acc, ', ', curr]
              }, [])}
            </div>
          )
        }
        
        return result
      } else {
        // Handle regular links (clay body, collections)
        return value.map((item, i) => (
          item.isPublic !== false ? (
            <Link key={i} href={item.href} className="text-brand underline hover:text-clay-700">
              {item.text}
            </Link>
          ) : (
            <span key={i} className="text-clay-900">{item.text}</span>
          )
        ))
      }
    }
    
    // Handle external URLs
    if (typeof value === 'string') {
      try {
        const url = new URL(value)
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand underline hover:text-clay-700"
          >
            View on {url.hostname.replace('www.', '')}
          </a>
        )
      } catch {
        return value
      }
    }
    
    return null
  }

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 md:col-span-7 order-2 md:order-1">
        <div className="bg-sand-light rounded-2xl p-8">
          <h2 className="text-2xl font-display font-semibold text-clay-800 mb-10">{title}</h2>
          <dl className="space-y-8">
            {items.map((item, index) => (
              item.value && (
                <div key={index}>
                  <dt className="text-lg font-medium text-clay-700">{item.label}</dt>
                  <dd className="mt-1 text-clay-900 whitespace-pre-wrap">
                    {renderValue(item.value)}
                  </dd>
                </div>
              )
            ))}
          </dl>
        </div>
      </div>
      <div className="col-span-12 md:col-span-5 order-1 md:order-2">
        <DetailImage images={images} isOwner={isOwner} />
      </div>
    </div>
  )
}
