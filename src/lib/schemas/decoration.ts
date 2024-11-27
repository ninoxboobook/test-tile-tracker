import { z } from 'zod'

export const decorationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  category: z.string().min(1, 'Category is required').max(255),
  type: z.string().min(1, 'Type is required').max(255),
  manufacturer: z.string().max(255).optional().nullable(),
  cone: z.string().max(255).optional().nullable(),
  atmosphere: z.string().max(255).optional().nullable(),
  colour: z.string().max(255).optional().nullable(),
  surface: z.string().max(255).optional().nullable(),
  transparency: z.string().max(255).optional().nullable(),
  glazyUrl: z.string().url('Invalid URL format').max(255).optional().nullable(),
  imageUrl: z.string().url('Invalid URL format').max(255).optional().nullable(),
  recipe: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type DecorationFormData = z.infer<typeof decorationSchema> 