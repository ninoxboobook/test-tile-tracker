import { z } from 'zod'

export const decorationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required'),
  typeId: z.string().uuid('Decoration type is required'),
  source: z.string().optional().nullable(),
  manufacturer: z.string().optional().nullable(),
  coneIds: z.array(z.string().uuid('Invalid cone ID')).optional(),
  atmosphereIds: z.array(z.string().uuid('Invalid atmosphere ID')).optional(),
  colour: z.string().optional().nullable(),
  surface: z.string().optional().nullable(),
  transparency: z.string().optional().nullable(),
  glazyUrl: z.union([z.string().url('Invalid URL format'), z.string().length(0)]).optional().nullable(),
  imageUrl: z.union([z.string().url('Invalid URL format'), z.string().length(0)]).optional().nullable(),
  recipe: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type DecorationFormData = z.infer<typeof decorationSchema>

// Type for the complete decoration with relationships
export type DecorationWithRelations = {
  id: string
  name: string
  typeId: string
  type: {
    id: string
    name: string
  }
  source?: string | null
  manufacturer?: string | null
  cone: Array<{
    id: string
    name: string
  }>
  atmosphere: Array<{
    id: string
    name: string
  }>
  colour?: string | null
  surface?: string | null
  transparency?: string | null
  glazyUrl?: string | null
  imageUrl?: string | null
  recipe?: string | null
  notes?: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
  decorationLayers: Array<{
    id: string
    testTile: {
      id: string
      name: string
    } | null
  }>
}