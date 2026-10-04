import mongoose, { Schema, Document } from 'mongoose';

export interface LocationDocument extends Document {
  name: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<LocationDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

LocationSchema.index({ name: 1 });

export const Location = mongoose.model<LocationDocument>('Location', LocationSchema);
