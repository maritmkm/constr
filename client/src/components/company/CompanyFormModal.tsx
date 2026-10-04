import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { FileUpload } from '../common/FileUpload';
import { Company, Location } from '../../types';

const schema = z.object({
  companyName: z.string().min(2, 'Company name is required').trim(),
  companyType: z.string().min(2, 'Company type is required').trim(),
  locationId: z.string().min(1, 'Please select a location'),
  ownerName: z.string().min(2, 'Owner name is required').trim(),
  address: z.string().min(5, 'Address is required').trim(),
  phoneNumber: z.string().min(7, 'Phone number is required').trim(),
  alternativePhoneNumber: z.string().optional(),
});

type FormDataValues = z.infer<typeof schema>;

export interface CompanyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  company?: Company | null;
  locations: Location[];
  isLoading?: boolean;
}

export const CompanyFormModal: React.FC<CompanyFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  company,
  locations,
  isLoading,
}) => {
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormDataValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (company) {
      reset({
        companyName: company.companyName,
        companyType: company.companyType,
        locationId: typeof company.locationId === 'object' ? company.locationId._id : company.locationId,
        ownerName: company.ownerName,
        address: company.address,
        phoneNumber: company.phoneNumber,
        alternativePhoneNumber: company.alternativePhoneNumber || '',
      });
    } else {
      reset({
        companyName: '',
        companyType: '',
        locationId: locations[0]?._id || '',
        ownerName: '',
        address: '',
        phoneNumber: '',
        alternativePhoneNumber: '',
      });
      setProfileFile(null);
    }
  }, [company, locations, reset, isOpen]);

  const handleFormSubmit = async (values: FormDataValues) => {
    const fd = new FormData();
    fd.append('companyName', values.companyName);
    fd.append('companyType', values.companyType);
    fd.append('locationId', values.locationId);
    fd.append('ownerName', values.ownerName);
    fd.append('address', values.address);
    fd.append('phoneNumber', values.phoneNumber);
    if (values.alternativePhoneNumber) {
      fd.append('alternativePhoneNumber', values.alternativePhoneNumber);
    }
    if (profileFile) {
      fd.append('profile', profileFile);
    }

    await onSubmit(fd);
    onClose();
  };

  const locationOptions = locations.map((loc) => ({
    label: loc.name,
    value: loc._id,
  }));

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={company ? 'Edit Company Profile' : 'Add New Client Company'}
      description="Register company profile details and main operational location."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label required>Company Name</Label>
            <Input
              placeholder="e.g. Apex Infrastructures"
              error={errors.companyName?.message}
              {...register('companyName')}
            />
          </div>

          <div>
            <Label required>Company Type</Label>
            <Input
              placeholder="e.g. Commercial Construction, Manufacturing"
              error={errors.companyType?.message}
              {...register('companyType')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label required>Location</Label>
            <Select
              options={locationOptions}
              error={errors.locationId?.message}
              {...register('locationId')}
            />
          </div>

          <div>
            <Label required>Owner / Primary Contact Name</Label>
            <Input
              placeholder="e.g. Rajesh Sharma"
              error={errors.ownerName?.message}
              {...register('ownerName')}
            />
          </div>
        </div>

        <div>
          <Label required>Address</Label>
          <textarea
            rows={2}
            placeholder="Full registered address..."
            className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2872A1]"
            {...register('address')}
          />
          {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label required>Phone Number</Label>
            <Input
              type="tel"
              placeholder="+91 98765 43210"
              error={errors.phoneNumber?.message}
              {...register('phoneNumber')}
            />
          </div>

          <div>
            <Label>Alternative Phone Number</Label>
            <Input
              type="tel"
              placeholder="+91 44 2233 4455"
              error={errors.alternativePhoneNumber?.message}
              {...register('alternativePhoneNumber')}
            />
          </div>
        </div>

        <div>
          <Label>Company Profile Logo / Image</Label>
          <FileUpload
            file={profileFile}
            existingUrl={company?.profileImage}
            onChange={(file: File | null) => setProfileFile(file)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {company ? 'Save Changes' : 'Create Company'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
