import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  bookingRefId: string;
  customerName: string;
  phone: string;
  altPhone?: string;
  email?: string;
  productType: "goat" | "mutton";
  varietyOrPackId: mongoose.Types.ObjectId;
  varietyOrPackName: string;
  quantity: number;
  weightSelection?: string;
  preferredDate: Date;
  deliveryTiming?: string;
  deliveryAddress: string;
  district?: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingRefId: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    altPhone: { type: String },
    email: { type: String },
    productType: { type: String, enum: ["goat", "mutton"], required: true },
    varietyOrPackId: { type: Schema.Types.ObjectId, required: true },
    varietyOrPackName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    weightSelection: { type: String },
    preferredDate: { type: Date, required: true },
    deliveryTiming: { type: String },
    deliveryAddress: { type: String, required: true },
    district: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

// Indexes for admin list sort, status filters, and schedule/pending counts
BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ createdAt: -1 });
BookingSchema.index({ preferredDate: 1, status: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
