import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { JobType } from '../../types';

const schema = z.object({
  name: z.string().min(2, 'Job type name is required').trim(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

type FormData = z.infer<typeof schema>;

export interface JobTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  jobType?: JobType | null;
  isLoading?: boolean;
}

export const JobTypeModal: React.FC<JobTypeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  jobType,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (jobType) {
      reset({
        name: jobType.name,
        description: jobType.description || '',
        status: jobType.status,
      });
    } else {
      reset({
        name: '',
        description: '',
        status: 'ACTIVE',
      });
    }
  }, [jobType, reset, isOpen]);

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={jobType ? 'Edit Job Type' : 'Add New Job Type'}
      description="Define work categories for employee assignments."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-2">
        <div>
          <Label required>Job Type Name</Label>
          <Input
            placeholder="e.g. Electrician, Mechanic, Welder"
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        <div>
          <Label>Description</Label>
          <textarea
            rows={3}
            placeholder="Brief details about responsibilities or skills required..."
            className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2872A1]"
            {...register('description')}
          />
        </div>

        <div>
          <Label required>Status</Label>
          <Select
            options={[
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Inactive', value: 'INACTIVE' },
            ]}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {jobType ? 'Update Job Type' : 'Create Job Type'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
