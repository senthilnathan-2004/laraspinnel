import mongoose from "mongoose";
import BlogPost from "../models/BlogPost";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const samplePosts = [
  {
    title: "Beginner's Guide to Goat Farming in Tamil Nadu",
    slug: "beginners-guide-goat-farming-tamil-nadu",
    excerpt: "Learn the basics of starting and managing a successful goat farm in the climatic conditions of Tamil Nadu.",
    content: "<h2>Introduction to Goat Farming</h2><p>Goat farming is a highly profitable business in Tamil Nadu. The local climate is very suitable for breeds like Tellicherry and Boer...</p><p>First, you need to ensure proper housing and ventilation. Second, focus on high-quality green fodder.</p>",
    coverImage: "https://images.unsplash.com/photo-1524024973431-2ad916746881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "Ragu Farm Team",
    tags: ["Farming Tips", "Beginner"],
    isPublished: true,
    publishedAt: new Date(),
  },
  {
    title: "Top 5 Mutton Recipes for Sunday Family Lunch",
    slug: "top-5-mutton-recipes-sunday-lunch",
    excerpt: "Discover the best traditional South Indian mutton recipes that will make your Sunday family gatherings special.",
    content: "<h2>1. Traditional Coimbatore Mutton Curry</h2><p>This spicy and flavorful curry uses freshly ground spices and goes perfectly with idli, dosa, or rice.</p><h2>2. Mutton Chukka</h2><p>A dry roast preparation that is heavily spiced with black pepper.</p>",
    coverImage: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "Chef Kumar",
    tags: ["Recipes", "Mutton"],
    isPublished: true,
    publishedAt: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    title: "Understanding Goat Breeds: Tellicherry vs Boer",
    slug: "understanding-goat-breeds-tellicherry-vs-boer",
    excerpt: "A detailed comparison of Tellicherry and Boer goats to help you choose the right breed for your farm.",
    content: "<h2>Tellicherry Goats</h2><p>Originating from Kerala, these goats are known for their high adaptability and excellent reproductive capabilities.</p><h2>Boer Goats</h2><p>Known for their fast growth rate and high meat yield, Boer goats require more intensive care.</p>",
    coverImage: "https://images.unsplash.com/photo-1574676506450-41315967dc8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "Ragu Farm Team",
    tags: ["Breeds", "Farming Tips"],
    isPublished: true,
    publishedAt: new Date(Date.now() - 172800000), // 2 days ago
  }
];

async function seedBlogs() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB");

    await BlogPost.deleteMany({});
    console.log("Cleared existing blog posts");

    await BlogPost.insertMany(samplePosts);
    console.log(`Inserted ${samplePosts.length} sample blog posts`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding blog posts:", error);
    process.exit(1);
  }
}

seedBlogs();
