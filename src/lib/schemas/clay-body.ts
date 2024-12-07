import { z } from 'zod'

export const clayBodySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required'),
  typeId: z.string().uuid('Clay body type is required'),
  manufacturer: z.string().optional().nullable(),
  cone: z.array(z.string()).optional(),
  firingTemperature: z.string().optional().nullable(),
  texture: z.string().optional().nullable(),
  plasticity: z.string().optional().nullable(),
  colourOxidation: z.string().optional().nullable(),
  colourReduction: z.string().optional().nullable(),
  shrinkage: z.number().optional().nullable(),
  absorption: z.number().optional().nullable(),
  meshSize: z.number().int().optional().nullable(),
  imageUrl: z.union([z.string().url('Invalid URL format'), z.string().length(0)]).optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type ClayBodyFormData = z.infer<typeof clayBodySchema>
