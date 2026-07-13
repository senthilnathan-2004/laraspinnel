import { z } from "zod";

// Phone number regex for 10-digit Indian phone numbers (optionally prefix with +91 or 0)
const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;

export const goatVarietySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  breed: z.string().min(2, "Breed must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  weightRange: z.string().min(1, "Weight range is required"),
  ageRange: z.string().min(1, "Age range is required"),
  priceEstimate: z.string().min(1, "Price estimate is required"),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string()).min(1, "At least one image is required"),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const muttonPackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().min(1, "Price is required (e.g. ₹450/kg)"),
  weightOptions: z.array(z.string()).default([]),
  districtsAvailable: z.array(z.string()).default([]),
  images: z.array(z.string()).min(1, "At least one image is required"),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const bookingSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(phoneRegex, "Please enter a valid 10-digit phone number"),
  altPhone: z.string().regex(phoneRegex, "Please enter a valid 10-digit phone number").optional().or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  productType: z.enum(["goat", "mutton"]),
  varietyOrPackId: z.string().min(1, "Please select a product"),
  varietyOrPackName: z.string().min(1, "Product name is required"),
  quantity: z.preprocess((val) => Number(val), z.number().int().min(1, "Quantity must be at least 1")),
  preferredDate: z.preprocess((val) => new Date(val as string), z.date().refine((date) => date >= new Date(new Date().setHours(0,0,0,0)), "Date cannot be in the past")),
  deliveryAddress: z.string().min(10, "Delivery address must be at least 10 characters"),
  district: z.string().optional(),
  manualDistrict: z.string().optional(),
  weightSelection: z.string().optional(),
  deliveryTiming: z.string().optional(),
  notes: z.string().optional().or(z.literal("")),
});

export const contactMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(phoneRegex, "Please enter a valid 10-digit phone number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  coverImage: z.string().optional(),
  author: z.string().default("Ragu Farm Team"),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export const bannerSchema = z.object({
  imageUrl: z.string().min(1, "Image is required"),
  headline: z.string().min(5, "Headline must be at least 5 characters"),
  subtext: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  buttonTheme: z.enum(["green", "red"]).default("green"),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const festivalBookingSchema = z.object({
  functionCategory: z.string().min(1, "Please select a function category"),
  weightRequired: z.string().min(1, "Weight requirement is required"),
  preferredColor: z.string().min(1, "Preferred color is required"),
  unwantedColor: z.string().min(1, "Unwanted color is required"),
  preferredAge: z.string().min(1, "Preferred age is required"),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  deliveryTiming: z.string().min(1, "Delivery timing is required"),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(phoneRegex, "Please enter a valid 10-digit phone number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().min(10, "Complete address is required"),
  notes: z.string().optional().or(z.literal("")),
});

export type FestivalBookingFormData = z.infer<typeof festivalBookingSchema>;
