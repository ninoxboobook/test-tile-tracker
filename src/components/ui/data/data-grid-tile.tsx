interface DataGridTileProps {
  variant?: 'single' | 'quad'
  title: string
  images?: string[]
  metadata?: Array<{
    label?: string
    value: string
  }>
  description?: string
}

export function DataGridTile({
  variant = 'single',
  title,
  images = [],
  metadata = [],
  description,
}: DataGridTileProps) {
  return (
    <div className="flex flex-col">
      {variant === 'single' ? (
        <div className="aspect-square bg-gray-50">
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
            <div key={index} className="aspect-square bg-gray-50">
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
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        {metadata && metadata.length > 0 && (
          <div className="space-y-1 text-sm text-gray-500">
            {metadata.map((item, index) => (
              <div key={index}>
                {item.label ? `${item.label}: ${item.value}` : item.value}
              </div>
            ))}
          </div>
        )}
        {description && (
          <div className="line-clamp-2 text-sm text-gray-500">{description}</div>
        )}
      </div>
    </div>
  )
}