import mongoose from "mongoose";
import Banner from "../models/Banner";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const defaultBanners = [
  {
    imageUrl: "/placeholder-goat.jpg",
    headline: "Premium Live Goats, Delivered Across Tamil Nadu",
    subtext: "Choose from Boer, Tellicherry, and native breeds. Direct farm pricing.",
    buttonText: "Explore Goats",
    buttonLink: "/goats",
    buttonTheme: "green",
    order: 1,
    isActive: true,
  },
  {
    imageUrl: "/placeholder-mutton.jpg",
    headline: "Farm-Fresh Bulk Mutton, Booked in Minutes",
    subtext: "Fresh quality cuts for families, events, and commercial orders.",
    buttonText: "Explore Mutton",
    buttonLink: "/mutton",
    buttonTheme: "red",
    order: 2,
    isActive: true,
  }
];

async function seedBanners() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB");

    await Banner.deleteMany({});
    console.log("Cleared existing banners");

    await Banner.insertMany(defaultBanners);
    console.log("Seeded default banners successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Failed to seed banners:", error);
    process.exit(1);
  }
}

seedBanners();
