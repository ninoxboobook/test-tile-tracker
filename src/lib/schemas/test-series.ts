import { z } from 'zod'
import { enum_TestSeries_status } from '@prisma/client'

export const testSeriesSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  variables: z.string().optional(), // JSON stored as string in form
  goal: z.string().optional(),
  status: z.enum(Object.values(enum_TestSeries_status) as [string, ...string[]]).default('planned'),
  conclusions: z.string().optional(),
})

export type TestSeriesFormData = z.infer<typeof testSeriesSchema> 