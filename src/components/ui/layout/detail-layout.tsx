import { DetailImage } from '../detail-image'

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
                  <dd className="mt-1 text-clay-800">{item.value}</dd>
                </div>
              )
            ))}
          </dl>
        </div>
      </div>
      <div className="col-span-5">
        <div className="bg-sand-light rounded-2xl p-8">
          <DetailImage images={images} />
        </div>
      </div>
    </div>
  )
}
