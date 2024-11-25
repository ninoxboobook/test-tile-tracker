import { z } from 'zod'

export const PLASTICITY_VALUES = [
  'Very Low',
  'Low',
  'Medium',
  'High',
  'Very High'
] as const

export const TEXTURE_VALUES = [
  'Smooth',
  'Fine grog',
  'Medium grog',
  'Coarse grog'
] as const

export const CLAY_BODY_TYPES = [
  'Raku',
  'Earthenware',
  'Stoneware',
  'Porcelain',
  'Wild',
  'Bone China'
] as const

export const clayBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string(),
  cone: z.string(),
  manufacturer: z.string().optional(),
  firing_temperature: z.string().optional(),
  plasticity: z.enum(PLASTICITY_VALUES).optional(),
  texture: z.enum(TEXTURE_VALUES).optional(),
  colour_oxidation: z.string().optional(),
  colour_reduction: z.string().optional(),
  shrinkage: z.string().optional(),
  absorption: z.string().optional(),
  notes: z.string().optional(),
})

export type ClayBodyFormData = z.infer<typeof clayBodySchema>
