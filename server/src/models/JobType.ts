import mongoose, { Schema, Document } from 'mongoose';

export interface JobTypeDocument extends Document {
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobTypeSchema = new Schema<JobTypeDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

JobTypeSchema.index({ name: 1 });

export const JobType = mongoose.model<JobTypeDocument>('JobType', JobTypeSchema);
