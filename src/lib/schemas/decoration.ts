import { z } from 'zod'
import { type enum_Decorations_atmosphere } from '@prisma/client'

export const DECORATION_TYPES = [
  'Glaze',
  'Underglaze',
  'Oxide',
  'Slip',
  'Other'
] as const

export const ATMOSPHERE_TYPES = [
  'Oxidation',
  'Reduction'
] as const

export const decorationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(DECORATION_TYPES),
  description: z.string().optional(),
  color: z.string().optional(),
  color_reaction: z.string().optional(),
  cone: z.string().optional(),
  firing_atmosphere: z.string().optional(),
  firing_temperature: z.string().optional(),
  food_safe: z.boolean().optional(),
  ingredients: z.string().optional(),
  manufacturer: z.string().optional(),
  surface: z.string().optional(),
  transparency: z.string().optional(),
})

export type DecorationFormData = z.infer<typeof decorationSchema> 