import { z } from 'zod'

export const decorationLayerSchema = z.object({
  order: z.number().int().min(1).max(20),
  decorationIds: z.array(z.string().uuid())
})

export const testTileSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required'),
  stamp: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  imageUrl: z.union([z.string().url('Invalid URL format'), z.string().length(0)]).optional().nullable(),
  clayBodyId: z.string().uuid('Clay body is required'),
  coneId: z.string().uuid('Cone is required'),
  atmosphereId: z.string().uuid('Atmosphere is required'),
  decorationLayers: z.array(decorationLayerSchema).optional().default([]),
  collectionIds: z.array(z.string().uuid()).optional().default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type TestTileFormData = z.infer<typeof testTileSchema> 