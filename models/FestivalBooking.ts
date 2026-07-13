import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFestivalBooking extends Document {
  bookingRefId: string;
  functionCategory: string; // Hindu, Muslim, Christian, Other
  weightRequired: string; // e.g. 15kg
  preferredColor: string;
  unwantedColor: string;
  preferredAge: string;
  deliveryDate: string;
  deliveryTiming: string;
  
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  
  notes?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FestivalBookingSchema = new Schema<IFestivalBooking>(
  {
    bookingRefId: { type: String, required: true, unique: true, index: true },
    functionCategory: { type: String, required: true },
    weightRequired: { type: String, required: true },
    preferredColor: { type: String, required: true },
    unwantedColor: { type: String, required: true },
    preferredAge: { type: String, required: true },
    deliveryDate: { type: String, required: true },
    deliveryTiming: { type: String, required: true },
    
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    
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

const FestivalBooking: Model<IFestivalBooking> =
  mongoose.models.FestivalBooking ||
  mongoose.model<IFestivalBooking>("FestivalBooking", FestivalBookingSchema);

export default FestivalBooking;
