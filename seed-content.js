const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, default: "" },
  },
  { timestamps: true }
);

const SiteSettings = mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);

const seedData = {
  home_shop_title: "What Are You Looking For?",
  home_shop_subtitle: "Choose your category to browse live farm goats or clean bulk mutton cuts.",
  home_shop_image_1: "/placeholder-goat.jpg",
  home_shop_image_2: "/placeholder-mutton.jpg",
  home_testimonials_title: "What Our Customers Say",
  home_testimonials_subtitle: "Stories of satisfaction from farmers, families, and commercial buyers.",
  home_stat_1: "500+ Happy Customers",
  home_stat_2: "Tamil Nadu Wide Goats",
  home_stat_3: "Fresh Quality Guaranteed",
  about_intro_title: "About Ragu Goat Farm",
  about_intro_subtitle: "Pioneering organic, pasture-raised livestock farming in Villupuram, Tamil Nadu.",
  about_intro_p1: "At Ragu Goat Farm, we believe that premium quality begins with wholesome care. Located in the lush pastures of Villupuram, our farm spans acres of open grazing fields. Our animals are pasture-raised, allowing them natural forage access alongside nutrient-rich feed.",
  about_intro_p2: "We started with a vision to streamline livestock ordering in Tamil Nadu, eliminating middle-agency price hikes. By combining modern veterinary management with direct-to-customer deliveries, we ensure healthy animals reach your doorstep at transparent farm rates.",
  about_intro_image: "/placeholder-goat.jpg",
  about_why_title: "Why Choose Ragu Farm?",
  about_why_subtitle: "We stand by rigorous quality markers that differentiate our livestock and meat.",
  about_why_1_title: "Hygienic Care Standards",
  about_why_1_desc: "Our Villupuram farm employs advanced veterinary inspection, regular vaccination cycles, and clean organic grazing feeding practices.",
  about_why_2_title: "Traceable Quality Breeds",
  about_why_2_desc: "We focus on premium breeds like Boer, Tellicherry, and native livestock with fully traceable lineage and health reports.",
  about_why_3_title: "Safe specialized transit",
  about_why_3_desc: "We own customized animal transport fleets equipped to keep livestock stress-free and hydrated during shipment.",
  about_stat_1_val: "50+ ACRES",
  about_stat_1_label: "Pasture Grazing",
  about_stat_2_val: "1,200+",
  about_stat_2_label: "Goats Reared",
  about_stat_3_val: "99.8%",
  about_stat_3_label: "Health Clearance",
  about_stat_4_val: "3,500+",
  about_stat_4_label: "Deliveries Completed",
  contact_map_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125433.09848529045!2d76.92055610080645!3d10.66986518712613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba836b28eb6ea85%3A0xaae3bbecafcc2061!2sVillupuram%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1709400000000!5m2!1sen!2sin"
};

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("Connecting to Mongo:", uri ? uri.substring(0, 20) + "..." : "undefined");
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    for (const [key, value] of Object.entries(seedData)) {
      await SiteSettings.findOneAndUpdate(
        { key },
        { $setOnInsert: { value } }, // Only insert if missing
        { upsert: true, new: true }
      );
      console.log(`Seeded: ${key}`);
    }

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
