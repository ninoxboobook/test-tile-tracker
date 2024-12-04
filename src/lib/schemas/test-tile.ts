import { z } from 'zod'
import { baseEntitySchema } from './base'

export const decorationLayerSchema = z.object({
  order: z.number().int().min(1).max(20),
  decorationIds: z.array(z.string().uuid())
})

export const testTileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  stamp: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  clayBodyId: z.string().uuid('Clay body is required'),
  coneId: z.string().uuid('Cone is required'),
  atmosphereId: z.string().uuid('Atmosphere is required'),
  decorationLayers: z.array(decorationLayerSchema),
  collectionIds: z.array(z.string().uuid()).optional(),
})

export type TestTileFormData = z.infer<typeof testTileSchema> 