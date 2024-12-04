import { z } from 'zod'
import { baseEntitySchema } from './base'

export const decorationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  typeId: z.string().uuid('Decoration type is required'),
  source: z.string().optional().nullable(),
  manufacturer: z.string().optional().nullable(),
  cone: z.array(z.string()).optional(),
  atmosphere: z.array(z.string()).optional(),
  colour: z.string().optional().nullable(),
  surface: z.string().optional().nullable(),
  transparency: z.string().optional().nullable(),
  glazyUrl: z.union([z.string().url('Invalid URL format'), z.string().length(0)]).optional().nullable(),
  imageUrl: z.union([z.string().url('Invalid URL format'), z.string().length(0)]).optional().nullable(),
  recipe: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type DecorationFormData = z.infer<typeof decorationSchema> 