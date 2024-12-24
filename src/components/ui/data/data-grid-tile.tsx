import { Lozenge, LozengeVariant } from "../lozenge"

interface DataGridTileProps {
  variant?: 'single' | 'quad'
  title: string
  subtitle?: string
  images?: string[]
  lozenges?: Array<{
    label?: string
    lozengeVariant?: LozengeVariant
  }>
  metadata?: Array<{
    label?: string
    value: string
  }>
  description?: string
}

export function DataGridTile({
  variant = 'single',
  title,
  subtitle,
  lozenges = [],
  images = [],
  metadata = [],
  description,
}: DataGridTileProps) {
  return (
    <div className="flex flex-col">
      {variant === 'single' ? (
        <div className="aspect-square bg-clay-50 relative">
          <div className="absolute top-3 right-3 z-10 flex flex-wrap justify-end gap-1">
            {lozenges.map((lozenge) => (
              <Lozenge key={lozenge.label} variant={lozenge.lozengeVariant}>{lozenge.label}</Lozenge>
            ))}
          </div>
          {images[0] ? (
            <img
              src={images[0]}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-full w-full" />
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1 p-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-square bg-clay-50">
              {images[index] ? (
                <img
                  src={images[index]}
                  alt={`${title} - Image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full" />
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <h2 className="font-display font-semibold text-lg text-clay-800">{title}</h2>
        {subtitle && ( <div className="italic text-clay-800">{subtitle}</div>)}
        {metadata && metadata.length > 0 && (
          <div className="space-y-1 text-clay-800 mt-3">
            {metadata.map((item, index) => (
              <div key={index}>
                {item.label ? `${item.label}: ${item.value}` : item.value}
              </div>
            ))}
          </div>
        )}
        {description && (
          <div className="line-clamp-2 text-clay-800 mt-3">{description}</div>
        )}
      </div>
    </div>
  )
}