export type ViewType = 'grid' | 'table'

export type FilterOption = {
  id: string
  label: string
  options: {
    label: string
    value: string | number
  }[]
}

export type FilterableColumnConfig<T extends string> = {
  columns: readonly T[]
  getLabel: (columnId: T) => string
}

export type PotentialFilter<T extends string> = {
  id: T
  label: string
  options: { label: string; value: string }[]
} 