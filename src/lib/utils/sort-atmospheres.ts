import { Atmosphere } from '@prisma/client'

const ATMOSPHERE_ORDER = [
  'Oxidation',
  'Neutral',
  'Reduction',
  'Raku',
  'Wood',
  'Salt & Soda',
  'Lustre'
]

export const sortAtmospheres = (atmospheres: Array<Atmosphere>): Array<Atmosphere> => {
  return [...atmospheres].sort((a, b) => {
    const indexA = ATMOSPHERE_ORDER.indexOf(a.name)
    const indexB = ATMOSPHERE_ORDER.indexOf(b.name)

    // If both atmospheres are in the predefined order, sort by their index
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }

    // If only one atmosphere is in the predefined order, it should come first
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1

    // If neither atmosphere is in the predefined order, sort alphabetically
    return a.name.localeCompare(b.name)
  })
}
