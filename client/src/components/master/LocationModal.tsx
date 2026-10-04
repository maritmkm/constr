import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Location } from '../../types';

const schema = z.object({
  name: z.string().min(2, 'Location name must be at least 2 characters').trim(),
});

type FormData = z.infer<typeof schema>;

export interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  location?: Location | null;
  isLoading?: boolean;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  location,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (location) {
      reset({ name: location.name });
    } else {
      reset({ name: '' });
    }
  }, [location, reset, isOpen]);

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={location ? 'Edit Location' : 'Add New Location'}
      description="Create or modify a location entry for workforce operations."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-2">
        <div>
          <Label required>Location Name</Label>
          <Input
            placeholder="e.g. Chennai, Mumbai, Bangalore"
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {location ? 'Update Location' : 'Create Location'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
