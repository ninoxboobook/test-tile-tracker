import { z } from 'zod'

export const decorationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  category: z.string().min(1, 'Category is required').max(255),
  type: z.string().min(1, 'Type is required').max(255),
  manufacturer: z.string().max(255).optional(),
  cone: z.string().max(255).optional(),
  atmosphere: z.string().max(255).optional(),
  colour: z.string().max(255).optional(),
  surface: z.string().max(255).optional(),
  transparency: z.string().max(255).optional(),
  glazyUrl: z.string().url('Invalid URL format').optional().nullable(),
  imageUrl: z.string().url('Invalid URL format').optional().nullable(),
  recipe: z.string().optional(),
  notes: z.string().optional(),
})

export type DecorationFormData = z.infer<typeof decorationSchema> 