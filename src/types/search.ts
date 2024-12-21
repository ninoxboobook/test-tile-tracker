export type SearchableColumn = {
  id: string
  accessorPath: string[]
}

export type SearchConfig = {
  columns: SearchableColumn[]
}
