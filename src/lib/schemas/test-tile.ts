import { z } from 'zod'

const decorationLayerSchema = z.object({
  order: z.number().min(1).max(20),
  decorationIds: z.array(z.string().uuid())
})

export const testTileSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required'),
  stamp: z.string().optional(),
  clayBodyId: z.string().uuid({ message: 'Clay body is required' }),
  decorationLayers: z.array(decorationLayerSchema),
  collectionIds: z.array(z.string().uuid()).optional(),
  imageUrl: z.union([z.string().url('Invalid URL format'), z.string().length(0)]).optional().nullable(),
  notes: z.string().optional().nullable()
})

export type TestTileFormData = z.infer<typeof testTileSchema> 