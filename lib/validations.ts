import { z } from "zod";

// Phone number regex for 10-digit Indian phone numbers (optionally prefix with +91 or 0)
const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
const pincodeRegex = /^\d{6}$/;

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().min(1, "Category image is required"),
  isActive: z.boolean().default(true),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.preprocess((val) => Number(val), z.number().positive("Price must be a positive number")),
  discountPrice: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().positive("Discount price must be positive").optional()
  ),
  description: z.string().min(10, "Description must be at least 10 characters"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  stock: z.preprocess((val) => Number(val), z.number().int().nonnegative("Stock cannot be negative")),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const orderSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(phoneRegex, "Please enter a valid 10-digit phone number"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  pincode: z.string().regex(pincodeRegex, "Please enter a valid 6-digit pin code"),
  notes: z.string().optional().or(z.literal("")),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      name: z.string().min(1),
      price: z.number().positive(),
      quantity: z.number().int().min(1),
      image: z.string().min(1),
      customText: z.string().max(300, "Customization note is too long").optional().or(z.literal("")),
      customImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
    })
  ).min(1, "Cart cannot be empty"),
});

export const contactMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(phoneRegex, "Please enter a valid 10-digit phone number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
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

export type OrderFormData = z.infer<typeof orderSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;

