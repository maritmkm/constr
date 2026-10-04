import { z } from 'zod';

export const locationSchema = z.object({
  name: z.string().min(2, 'Location name must be at least 2 characters').trim(),
});
