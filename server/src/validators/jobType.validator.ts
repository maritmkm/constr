import { z } from 'zod';

export const jobTypeSchema = z.object({
  name: z.string().min(2, 'Job type name must be at least 2 characters').trim(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
});
