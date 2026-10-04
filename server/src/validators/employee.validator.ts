import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(2, 'Employee name is required').trim(),
  phoneNumber: z.string().min(7, 'Phone number is required').trim(),
  locationId: z.string().min(1, 'Location is required'),
  address: z.string().min(5, 'Address is required').trim(),
  alternativePhoneNumber: z.string().optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE']).default('ACTIVE'),
  jobTypeId: z.string().min(1, 'Job Type is required'),
});
