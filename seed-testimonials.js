const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    review: { type: String, required: true },
    initial: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);

const seedData = [
  {
    name: "Ramesh Kumar",
    location: "Coimbatore, TN",
    review: "Ordered 15 live goats for a family celebration. The breed quality was exceptional, and they arrived right on time in excellent health. Best farm service in Tamil Nadu!",
    initial: "R",
    isActive: true,
  },
  {
    name: "Revathi S.",
    location: "Villupuram, TN",
    review: "Ragu Goat Farm is our default source for bulk mutton. The cuts are fresh, clean, and delivered in hygienic food-grade packages. Highly recommend their weekly family packs.",
    initial: "R",
    isActive: true,
  },
  {
    name: "Mohamed Asif",
    location: "Tiruppur, TN",
    review: "Purchased Boer goats for festival breeding. The farm team helped us select the right weight classes and guided us on care. Very professional, honest farm pricing.",
    initial: "M",
    isActive: true,
  }
];

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("Connecting to Mongo:", uri ? uri.substring(0, 20) + "..." : "undefined");
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    // Check if any testimonials exist
    const count = await Testimonial.countDocuments();
    if (count === 0) {
      console.log("No testimonials found. Inserting defaults...");
      await Testimonial.insertMany(seedData);
      console.log("Default testimonials seeded successfully!");
    } else {
      console.log(`Found ${count} existing testimonials. Skipping seed to prevent duplicates.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding testimonials:", error);
    process.exit(1);
  }
}

seed();
