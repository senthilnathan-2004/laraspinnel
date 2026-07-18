import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  location: string;
  goal: string;
  outcome: string;
  initial: string;
  rating: number;
  refId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    goal: { type: String, required: true },
    outcome: { type: String, required: true },
    initial: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    refId: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes for active testimonials and admin sort
TestimonialSchema.index({ isActive: 1, createdAt: -1 });
TestimonialSchema.index({ createdAt: -1 });

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
