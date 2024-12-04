import { z } from 'zod'
import { baseEntitySchema } from './base'

export const collectionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  testTileIds: z.array(z.string().uuid()).optional(),
})

export type CollectionFormData = z.infer<typeof collectionSchema> 