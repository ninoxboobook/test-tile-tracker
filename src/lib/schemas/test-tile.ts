import { z } from 'zod'

export const testTileSchema = z.object({
  id: z.string().uuid('Invalid test tile ID').optional(), // Optional for create, required for update
  name: z.string().min(1, 'Name is required').max(255),
  stamp: z.string().max(255).optional().nullable(),
  notes: z.string().optional().nullable(),
  imageUrl: z.union([z.string().url('Invalid URL format'), z.string().length(0)]).optional().nullable(),
  clayBodyId: z.string().uuid('Invalid clay body ID'),
  decorationIds: z.array(z.string().uuid('Invalid decoration ID')).optional(),
  collectionIds: z.array(z.string().uuid('Invalid collection ID')).optional(),
})

// Separate schema for updates that requires the ID
export const testTileUpdateSchema = testTileSchema.extend({
  id: z.string().uuid('Invalid test tile ID'),
})

export type TestTileFormData = z.infer<typeof testTileSchema> 