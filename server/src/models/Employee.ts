import mongoose, { Schema, Document } from 'mongoose';

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';

export interface EmployeeDocument extends Document {
  name: string;
  phoneNumber: string;
  locationId: mongoose.Types.ObjectId;
  address: string;
  alternativePhoneNumber?: string;
  status: EmployeeStatus;
  jobTypeId: mongoose.Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<EmployeeDocument>(
  {
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    address: { type: String, required: true, trim: true },
    alternativePhoneNumber: { type: String, trim: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE'],
      default: 'ACTIVE',
      required: true,
    },
    jobTypeId: { type: Schema.Types.ObjectId, ref: 'JobType', required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

EmployeeSchema.index({ name: 1 });
EmployeeSchema.index({ phoneNumber: 1 });
EmployeeSchema.index({ locationId: 1 });
EmployeeSchema.index({ jobTypeId: 1 });
EmployeeSchema.index({ status: 1 });

export const Employee = mongoose.model<EmployeeDocument>('Employee', EmployeeSchema);
