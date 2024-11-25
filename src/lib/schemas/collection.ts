import { z } from 'zod'

export const collectionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
})

export type CollectionFormData = z.infer<typeof collectionSchema> 