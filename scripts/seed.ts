import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Manually load .env.local if not loaded (e.g. when running standalone node script)
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    envConfig.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...values] = trimmed.split("=");
        if (key && values.length > 0) {
          process.env[key.trim()] = values.join("=").trim();
        }
      }
    });
  }
}

loadEnv();

import AdminUser from "../models/AdminUser";
import SiteSettings from "../models/SiteSettings";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined. Please check your .env.local file.");
  process.exit(1);
}

const defaultSettings = [
  { key: "farm_name", value: "Ragu Goat Farm" },
  { key: "tagline", value: "Fresh, healthy, farm-raised live goats & bulk mutton" },
  { key: "contact_phone", value: "+91 9442379832" },
  { key: "contact_whatsapp", value: "+91 9442379832" },
  { key: "contact_email", value: "senthilraguanthan2004@gmail.com" },
  { key: "contact_address", value: "2/90 MettuStreet, Therkunam, Villupuram, Tamil Nadu - 604102" },
  { key: "business_hours", value: "Monday - Sunday: 6:00 AM - 8:00 PM" },
  { key: "mutton_districts", value: "Coimbatore,Tiruppur,Erode,Villupuram" },
  { key: "logo_url", value: "" },
  { key: "favicon_url", value: "" },
  { key: "seo_title", value: "Ragu Goat Farm | Premium Live Goats & Fresh Bulk Mutton in Tamil Nadu" },
  { key: "seo_description", value: "Order premium breed live goats (Boer, Tellicherry) delivered across Tamil Nadu and farm-fresh bulk mutton in Coimbatore, Tiruppur, Erode, and Villupuram." }
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected successfully!");

    // 1. Seed Admin User
    const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@ragugoatfarm.com";
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || "admin123";

    console.log(`Seeding Admin User: ${adminEmail}`);
    const existingAdmin = await AdminUser.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await AdminUser.create({
        name: "Super Admin",
        email: adminEmail,
        passwordHash,
        role: "superadmin"
      });
      console.log(`Admin user created successfully! Email: ${adminEmail}, Password: ${adminPassword}`);
    } else {
      console.log("Admin user already exists, skipping creation.");
    }

    // 2. Seed Default Site Settings
    console.log("Seeding default Site Settings...");
    for (const setting of defaultSettings) {
      const existingSetting = await SiteSettings.findOne({ key: setting.key });
      if (!existingSetting) {
        await SiteSettings.create(setting);
        console.log(`Created setting: ${setting.key}`);
      } else {
        console.log(`Setting ${setting.key} already exists, skipping.`);
      }
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
