import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGoatVariety extends Document {
  name: string;
  slug: string;
  description: string;
  breed: string;
  images: string[];
  weightRange: string;
  ageRange: string;
  priceEstimate: string;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GoatVarietySchema = new Schema<IGoatVariety>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    breed: { type: String, required: true },
    images: { type: [String], default: [] },
    weightRange: { type: String, required: true },
    ageRange: { type: String, required: true },
    priceEstimate: { type: String, required: true },
    tags: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes for public catalog (active + featured) and admin sort
GoatVarietySchema.index({ isActive: 1, isFeatured: -1, name: 1 });
GoatVarietySchema.index({ createdAt: -1 });

const GoatVariety: Model<IGoatVariety> =
  mongoose.models.GoatVariety || mongoose.model<IGoatVariety>("GoatVariety", GoatVarietySchema);

export default GoatVariety;
