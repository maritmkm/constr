import mongoose, { Schema, Document } from 'mongoose';

export interface CompanyDocument extends Document {
  companyName: string;
  companyType: string;
  locationId: mongoose.Types.ObjectId;
  ownerName: string;
  address: string;
  phoneNumber: string;
  alternativePhoneNumber?: string;
  profileImage?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<CompanyDocument>(
  {
    companyName: { type: String, required: true, trim: true },
    companyType: { type: String, required: true, trim: true },
    locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    ownerName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    alternativePhoneNumber: { type: String, trim: true },
    profileImage: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

CompanySchema.index({ companyName: 1 });
CompanySchema.index({ locationId: 1 });
CompanySchema.index({ isDeleted: 1 });

export const Company = mongoose.model<CompanyDocument>('Company', CompanySchema);
