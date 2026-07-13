import mongoose from 'mongoose';

// Temporary hack to allow executing via tsx if we don't have the mongoose models imported properly.
// The models might be tightly coupled to Next.js so we'll just use a raw mongoose model.

const SiteSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, default: "" },
});

const SiteSettings = mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);

const sampleImages = [
  "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1559868661-d779ce614a93?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1584988755675-a831e5f8ceb0?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1606558230552-8d76a742880b?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1616781254823-3860bb43ea06?auto=format&fit=crop&q=80&w=600",
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected successfully.");

    console.log("Seeding variety_marquee_images...");
    const jsonString = JSON.stringify(sampleImages);

    await SiteSettings.findOneAndUpdate(
      { key: "variety_marquee_images" },
      { value: jsonString },
      { upsert: true, new: true }
    );

    console.log("Successfully seeded variety_marquee_images!");
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed:", err);
    process.exit(1);
  }
}

seed();
