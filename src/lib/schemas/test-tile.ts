import { z } from 'zod'

export const testTileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  clay_body_id: z.string().min(1, 'Clay body is required'),
  decoration_id: z.string().optional(),
  test_series_id: z.string().optional(),
})

export type TestTileFormData = z.infer<typeof testTileSchema> 