import { Cone } from '@prisma/client'

const FIRING_RANGES = [
  'Low Fire (Cone 06-04)',
  'Mid Fire (Cone 5-6)',
  'High Fire (Cone 8-10)'
]

// Function to extract numeric value from cone string for sorting
const getConeNumericValue = (coneName: string): number => {
  // Extract the numeric part from the cone name
  const match = coneName.match(/^(?:Cone )?0*(-?\d+)$/)
  if (!match) return 0 // Return 0 for non-numeric cones (like firing ranges)
  
  const num = parseInt(match[1])
  // Only treat as negative if it starts with 0 (not just contains 0)
  return /^(?:Cone )?0/.test(coneName) && num > 0 ? -num : num
}

export const sortCones = (cones: Array<Cone>): Array<Cone> => {
  // Separate firing ranges and numeric cones
  const firingRanges = cones.filter(cone => FIRING_RANGES.includes(cone.name))
  const numericCones = cones.filter(cone => !FIRING_RANGES.includes(cone.name))

  // Sort firing ranges in predefined order
  const sortedFiringRanges = [...firingRanges].sort(
    (a, b) => FIRING_RANGES.indexOf(a.name) - FIRING_RANGES.indexOf(b.name)
  )

  // Sort numeric cones by their numeric value
  const sortedNumericCones = [...numericCones].sort((a, b) => {
    return getConeNumericValue(a.name) - getConeNumericValue(b.name)
  })

  // Combine both arrays
  return [...sortedFiringRanges, ...sortedNumericCones]
}
