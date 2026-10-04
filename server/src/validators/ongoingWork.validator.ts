import { z } from 'zod';

const employeeAssignmentSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  jobTypeId: z.string().min(1, 'Job Type ID is required'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
});

export const ongoingWorkSchema = z.object({
  companyId: z.string().min(1, 'Company is required'),
  locationId: z.string().min(1, 'Location is required'),
  overallStartDate: z.string().or(z.date()),
  overallEndDate: z.string().or(z.date()),
  employees: z.array(employeeAssignmentSchema).min(1, 'At least one employee must be assigned'),
}).refine((data) => {
  const start = new Date(data.overallStartDate);
  const end = new Date(data.overallEndDate);
  return end >= start;
}, {
  message: 'Overall end date cannot be before start date',
  path: ['overallEndDate'],
});
