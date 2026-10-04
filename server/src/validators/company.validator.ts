import { z } from 'zod';

export const companySchema = z.object({
  companyName: z.string().min(2, 'Company name is required').trim(),
  companyType: z.string().min(2, 'Company type is required').trim(),
  locationId: z.string().min(1, 'Location is required'),
  ownerName: z.string().min(2, 'Owner name is required').trim(),
  address: z.string().min(5, 'Address is required').trim(),
  phoneNumber: z.string().min(7, 'Phone number is required').trim(),
  alternativePhoneNumber: z.string().optional().or(z.literal('')),
});
