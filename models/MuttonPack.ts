import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMuttonPack extends Document {
  name: string;
  slug: string;
  description: string;
  images: string[];
  weightOptions: string[];
  price: string;
  districtsAvailable: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MuttonPackSchema = new Schema<IMuttonPack>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    weightOptions: { type: [String], default: [] },
    price: { type: String, required: true },
    districtsAvailable: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MuttonPack: Model<IMuttonPack> =
  mongoose.models.MuttonPack || mongoose.model<IMuttonPack>("MuttonPack", MuttonPackSchema);

export default MuttonPack;
