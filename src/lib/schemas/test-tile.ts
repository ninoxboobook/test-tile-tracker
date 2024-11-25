import { z } from 'zod'

export const testTileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  stamp: z.string().max(255).optional(),
  notes: z.string().optional(),
  imageUrl: z.string().url('Invalid URL format').optional().nullable(),
  clayBodyId: z.string().uuid('Invalid clay body ID'),
  // Optional: If you need to handle decoration IDs
  decorationIds: z.array(z.string().uuid()).optional(),
  // Optional: If you need to handle collection IDs
  collectionIds: z.array(z.string().uuid()).optional(),
})

export type TestTileFormData = z.infer<typeof testTileSchema> 