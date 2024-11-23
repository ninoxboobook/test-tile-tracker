import { z } from 'zod'

export const clayBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['Raku', 'Earthenware', 'Stoneware', 'Bone China', 'Porcelain', 'Wild'], {
    required_error: 'Please select a type',
  }),
  manufacturer: z.string().optional(),
  cone: z.string().min(1, 'Cone is required'),
  firing_temperature: z.string().optional(),
  shrinkage: z.number().optional(),
  absorption: z.number().optional(),
  plasticity: z.enum(['Very Low', 'Low', 'Medium', 'High', 'Very High']).optional(),
  texture: z.enum(['Smooth', 'Fine grog', 'Medium grog', 'Coarse grog']).optional(),
  notes: z.string().optional(),
  cone_range: z.string().optional(),
  description: z.string().optional(),
  composition: z.any().optional(),
  colour_oxidation: z.string().optional(),
  colour_reduction: z.string().optional(),
})

export type ClayBodyFormData = z.infer<typeof clayBodySchema>
