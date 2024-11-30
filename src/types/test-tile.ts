import { TestTile, ClayBody, Decoration, Collection } from '@prisma/client'

export interface TestTileWithRelations extends TestTile {
  clayBody: ClayBody
  decorationLayers: Array<{
    id: string
    order: number
    decorations: Decoration[]
  }>
  collections: Collection[]
} 