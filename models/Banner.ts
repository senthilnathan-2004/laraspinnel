import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBanner extends Document {
  imageUrl: string;
  headline: string;
  subtext?: string;
  buttonText?: string;
  buttonLink?: string;
  buttonTheme: "green" | "red";
  order: number;
  isActive: boolean;
  createdAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    imageUrl: { type: String, required: true },
    headline: { type: String, required: true },
    subtext: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
    buttonTheme: { type: String, enum: ["green", "red"], default: "green" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes for public active banners and ordered display
BannerSchema.index({ isActive: 1, order: 1 });
BannerSchema.index({ order: 1, createdAt: -1 });

const Banner: Model<IBanner> =
  mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);

export default Banner;
