import { z } from 'zod'

export const decorationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  category: z.array(z.string()).min(1, 'At least one category is required'),
  type: z.string().max(255).optional().nullable(),
  manufacturer: z.string().max(255).optional().nullable(),
  cone: z.array(z.string()).optional().nullable(),
  atmosphere: z.array(z.string()).optional().nullable(),
  colour: z.string().max(255).optional().nullable(),
  surface: z.string().max(255).optional().nullable(),
  transparency: z.string().max(255).optional().nullable(),
  glazyUrl: z.union([z.string().url('Invalid URL format'), z.string().length(0)]).optional().nullable(),
  imageUrl: z.union([z.string().url('Invalid URL format'), z.string().length(0)]).optional().nullable(),
  recipe: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type DecorationFormData = z.infer<typeof decorationSchema> 