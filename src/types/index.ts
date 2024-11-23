import { z } from 'zod';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export const testTileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  firingTemperature: z.number().optional(),
  clayBodyId: z.string().min(1, 'Clay body is required'),
  decorationIds: z.array(z.string()).optional(),
});

export type TestTileFormData = z.infer<typeof testTileSchema>;

export const clayBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  manufacturer: z.string().optional(),
  coneRange: z.string().optional(),
});

export type ClayBodyFormData = z.infer<typeof clayBodySchema>; 