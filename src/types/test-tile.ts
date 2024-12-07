import { TestTile, ClayBody, Decoration, Collection, Cone, Atmosphere } from '@prisma/client'

export interface TestTileWithRelations extends TestTile {
  clayBody: ClayBody
  cone: Cone
  atmosphere: Atmosphere
  decorationLayers: Array<{
    id: string
    order: number
    decorations: Decoration[]
  }>
  collections: Collection[]
} 