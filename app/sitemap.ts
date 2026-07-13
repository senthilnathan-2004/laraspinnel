import { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/db";
import GoatVariety from "@/models/GoatVariety";
import MuttonPack from "@/models/MuttonPack";
import BlogPost from "@/models/BlogPost";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ragugoatfarm.com";

  // Static routes
  const staticRoutes = [
    "",
    "/goats",
    "/mutton",
    "/blog",
    "/gallery",
    "/about",
    "/contact",
    "/book",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  let dynamicRoutes: any[] = [];

  try {
    await connectToDatabase();

    // Fetch dynamic goat breed pages
    const goats = await GoatVariety.find({}).select("slug updatedAt");
    const goatRoutes = goats.map((g) => ({
      url: `${baseUrl}/goats/${g.slug}`,
      lastModified: g.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    // Fetch dynamic mutton pack pages
    const muttons = await MuttonPack.find({}).select("slug updatedAt");
    const muttonRoutes = muttons.map((m) => ({
      url: `${baseUrl}/mutton/${m.slug}`,
      lastModified: m.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    // Fetch dynamic blog posts
    const blogs = await BlogPost.find({ isPublished: true }).select("slug publishedAt updatedAt");
    const blogRoutes = blogs.map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.updatedAt || b.publishedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

    dynamicRoutes = [...goatRoutes, ...muttonRoutes, ...blogRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
export const revalidate = 3600; // Revalidate sitemap every hour
