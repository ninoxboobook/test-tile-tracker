import { z } from 'zod'

export const clayBodySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required'),
  typeId: z.string().uuid('Clay body type is required'),
  manufacturer: z.string().optional().nullable(),
  cone: z.array(z.string()).optional(),
  firingRange: z.string().optional().nullable(),
  bisqueTemperature: z.string().optional().nullable(),
  vitreousTemperature: z.string().optional().nullable(),
  texture: z.string().optional().nullable(),
  plasticity: z.string().optional().nullable(),
  colourOxidation: z.string().optional().nullable(),
  colourReduction: z.string().optional().nullable(),
  shrinkageWetToDry: z.number().optional().nullable(),
  shrinkageWetToBisque: z.number().optional().nullable(),
  shrinkageWetToFired: z.number().optional().nullable(),
  absorption: z.number().optional().nullable(),
  meshSize: z.number().int().optional().nullable(),
  imageUrl: z.array(z.string().url('Invalid URL format')).optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type ClayBodyFormData = z.infer<typeof clayBodySchema>
