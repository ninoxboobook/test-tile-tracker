import { z } from 'zod'

export const testTileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  stamp: z.string().max(255).optional().nullable(),
  notes: z.string().optional().nullable(),
  imageUrl: z.union([z.string().url('Invalid URL format'), z.string().length(0)]).optional().nullable(),
  clayBodyId: z.string().uuid('Invalid clay body ID'),
  decorationIds: z.array(z.string().uuid('Invalid decoration ID')).optional(),
  collectionIds: z.array(z.string().uuid('Invalid collection ID')).optional(),
})

export type TestTileFormData = z.infer<typeof testTileSchema> 