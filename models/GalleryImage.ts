import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGalleryImage extends Document {
  imageUrl: string;
  altText: string;
  caption?: string;
  category: "goat" | "mutton" | "farm" | "event";
  order: number;
  createdAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    imageUrl: { type: String, required: true },
    altText: { type: String, required: true },
    caption: { type: String },
    category: {
      type: String,
      enum: ["goat", "mutton", "farm", "event"],
      required: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const GalleryImage: Model<IGalleryImage> =
  mongoose.models.GalleryImage ||
  mongoose.model<IGalleryImage>("GalleryImage", GalleryImageSchema);

export default GalleryImage;
