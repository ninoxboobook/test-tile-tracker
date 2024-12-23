import { ClayBodyType } from '@prisma/client'

const CLAY_TYPE_ORDER = [
  'Stoneware',
  'Earthenware',
  'Porcelain',
  'Bone China',
  'Raku',
  'Other'
]

export const sortClayTypes = (types: Array<ClayBodyType>): Array<ClayBodyType> => {
  return [...types].sort((a, b) => {
    const indexA = CLAY_TYPE_ORDER.indexOf(a.name)
    const indexB = CLAY_TYPE_ORDER.indexOf(b.name)

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
