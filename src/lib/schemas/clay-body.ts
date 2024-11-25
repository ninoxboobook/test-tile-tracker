import { z } from 'zod'

export const clayBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  manufacturer: z.string().optional(),
  cone: z.string().optional(),
  firingTemperature: z.string().optional(),
  texture: z.string().optional(),
  plasticity: z.string().optional(),
  colourOxidation: z.string().optional(),
  colourReduction: z.string().optional(),
  shrinkage: z.number().optional(),
  absorption: z.number().optional(),
  meshSize: z.number().int().optional(),
  imageUrl: z.string().url().optional(),
  notes: z.string().optional(),
})

export type ClayBodyFormData = z.infer<typeof clayBodySchema>
