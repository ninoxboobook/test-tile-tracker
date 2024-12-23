import { DecorationType } from '@prisma/client'

const DECORATION_TYPE_ORDER = [
  'Glaze',
  'Underglaze',
  'Slip',
  'Engobe',
  'Oxide',
  'Lustre',
  'Other'
]

export const sortDecorationTypes = (types: Array<DecorationType>): Array<DecorationType> => {
  return [...types].sort((a, b) => {
    const indexA = DECORATION_TYPE_ORDER.indexOf(a.name)
    const indexB = DECORATION_TYPE_ORDER.indexOf(b.name)

    // If both types are in the predefined order, sort by their index
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }

    // If only one type is in the predefined order, it should come first
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1

    // If neither type is in the predefined order, sort alphabetically
    // but ensure 'Other' always comes last
    if (a.name === 'Other') return 1
    if (b.name === 'Other') return -1
    
    return a.name.localeCompare(b.name)
  })
}
