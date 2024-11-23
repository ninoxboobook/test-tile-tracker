import { z } from 'zod'

export const clayBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['Raku', 'Earthenware', 'Stoneware', 'Bone China', 'Porcelain', 'Wild'], {
    required_error: 'Please select a type',
  }),
  manufacturer: z.string().optional(),
  cone: z.string().min(1, 'Cone is required'),
  firingTemperature: z.number().optional(),
  colourOxidation: z.string().optional(),
  colourReduction: z.string().optional(),
  shrinkage: z.number().optional(),
  absorption: z.number().optional(),
  plasticity: z.enum(['very low', 'low', 'medium', 'high', 'very high']).optional(),
  texture: z.string().optional(),
  notes: z.string().optional(),
})

export type ClayBodyFormData = z.infer<typeof clayBodySchema>
