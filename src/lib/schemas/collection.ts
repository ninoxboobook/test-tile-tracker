import { z } from 'zod'

export const collectionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  testTileIds: z.array(z.string().uuid()).optional(),
})

export type CollectionFormData = z.infer<typeof collectionSchema> 