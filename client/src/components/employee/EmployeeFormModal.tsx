import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Employee, Location, JobType, EmployeeStatus } from '../../types';

const schema = z.object({
  name: z.string().min(2, 'Employee name is required').trim(),
  phoneNumber: z.string().min(7, 'Phone number is required').trim(),
  locationId: z.string().min(1, 'Location is required'),
  address: z.string().min(5, 'Address is required').trim(),
  alternativePhoneNumber: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE']),
  jobTypeId: z.string().min(1, 'Job Type is required'),
});

type FormDataValues = z.infer<typeof schema>;

export interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormDataValues) => Promise<void>;
  employee?: Employee | null;
  locations: Location[];
  jobTypes: JobType[];
  isLoading?: boolean;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employee,
  locations,
  jobTypes,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormDataValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (employee) {
      reset({
        name: employee.name,
        phoneNumber: employee.phoneNumber,
        locationId: typeof employee.locationId === 'object' ? employee.locationId._id : employee.locationId,
        address: employee.address,
        alternativePhoneNumber: employee.alternativePhoneNumber || '',
        status: employee.status,
        jobTypeId: typeof employee.jobTypeId === 'object' ? employee.jobTypeId._id : employee.jobTypeId,
      });
    } else {
      reset({
        name: '',
        phoneNumber: '',
        locationId: locations[0]?._id || '',
        address: '',
        alternativePhoneNumber: '',
        status: 'ACTIVE',
        jobTypeId: jobTypes[0]?._id || '',
      });
    }
  }, [employee, locations, jobTypes, reset, isOpen]);

  const handleFormSubmit = async (values: FormDataValues) => {
    await onSubmit(values);
    onClose();
  };

  const locationOptions = locations.map((l) => ({ label: l.name, value: l._id }));
  const jobTypeOptions = jobTypes.map((j) => ({ label: j.name, value: j._id }));
  const statusOptions = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' },
    { label: 'ON LEAVE', value: 'ON_LEAVE' },
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? 'Edit Employee Profile' : 'Add New Employee'}
      description="Register employee profile, skills, and deployment location."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label required>Employee Full Name</Label>
            <Input
              placeholder="e.g. Arun Kumar"
              error={errors.name?.message}
              {...register('name')}
            />
          </div>

          <div>
            <Label required>Primary Phone Number</Label>
            <Input
              type="tel"
              placeholder="+91 98765 43210"
              error={errors.phoneNumber?.message}
              {...register('phoneNumber')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label required>Job Type / Trade</Label>
            <Select
              options={jobTypeOptions}
              error={errors.jobTypeId?.message}
              {...register('jobTypeId')}
            />
          </div>

          <div>
            <Label required>Base Location</Label>
            <Select
              options={locationOptions}
              error={errors.locationId?.message}
              {...register('locationId')}
            />
          </div>

          <div>
            <Label required>Status</Label>
            <Select
              options={statusOptions}
              error={errors.status?.message}
              {...register('status')}
            />
          </div>
        </div>

        <div>
          <Label required>Residential Address</Label>
          <textarea
            rows={2}
            placeholder="Full local or permanent address..."
            className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2872A1]"
            {...register('address')}
          />
          {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
        </div>

        <div>
          <Label>Alternative Contact Phone</Label>
          <Input
            type="tel"
            placeholder="+91 91234 56789"
            error={errors.alternativePhoneNumber?.message}
            {...register('alternativePhoneNumber')}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {employee ? 'Save Changes' : 'Create Employee'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
