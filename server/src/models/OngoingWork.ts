import mongoose, { Schema, Document } from 'mongoose';

export type WorkStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface AssignedEmployee {
  employeeId: mongoose.Types.ObjectId;
  jobTypeId: mongoose.Types.ObjectId;
  employeeNameSnapshot?: string;
  jobTypeNameSnapshot?: string;
  startDate: Date;
  endDate: Date;
  status?: string;
  assignedAt?: Date;
}

export interface OngoingWorkDocument extends Document {
  companyId: mongoose.Types.ObjectId;
  locationId: mongoose.Types.ObjectId;
  overallStartDate: Date;
  overallEndDate: Date;
  status: WorkStatus;
  employees: AssignedEmployee[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AssignedEmployeeSchema = new Schema<AssignedEmployee>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    jobTypeId: { type: Schema.Types.ObjectId, ref: 'JobType', required: true },
    employeeNameSnapshot: { type: String },
    jobTypeNameSnapshot: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, default: 'ASSIGNED' },
    assignedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const OngoingWorkSchema = new Schema<OngoingWorkDocument>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    overallStartDate: { type: Date, required: true },
    overallEndDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'],
      default: 'ONGOING',
      required: true,
    },
    employees: { type: [AssignedEmployeeSchema], required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

OngoingWorkSchema.index({ companyId: 1 });
OngoingWorkSchema.index({ locationId: 1 });
OngoingWorkSchema.index({ status: 1 });
OngoingWorkSchema.index({ overallStartDate: 1, overallEndDate: 1 });
OngoingWorkSchema.index({ 'employees.employeeId': 1 });

export const OngoingWork = mongoose.model<OngoingWorkDocument>('OngoingWork', OngoingWorkSchema);
