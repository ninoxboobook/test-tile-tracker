import { z } from 'zod'

export const decorationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().optional(),
  manufacturer: z.string().optional(),
  color: z.string().optional(),
  color_reaction: z.string().optional(),
  cone: z.string().optional(),
  firing_atmosphere: z.enum(['oxidation', 'reduction']).optional(),
  firing_temperature: z.string().optional(),
  food_safe: z.boolean().optional(),
  ingredients: z.any().optional(),
  surface: z.string().optional(),
  transparency: z.string().optional(),
})

export type DecorationFormData = z.infer<typeof decorationSchema> 