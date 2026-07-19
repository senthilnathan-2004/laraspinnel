import { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { SITE_URL } from "@/lib/siteUrl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Static routes
  const staticRoutes = [
    "",
    "/shop",
    "/categories",
    "/about",
    "/contact",
    "/cart",
    "/checkout",
    "/privacy-policy",
    "/terms-of-service",
    "/shipping-policy",
    "/refund-policy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  let dynamicRoutes: any[] = [];

  try {
    await connectToDatabase();

    // Fetch dynamic product detail pages
    const products = await Product.find({ isActive: true }).select("slug updatedAt");
    const productRoutes = products.map((p) => ({
      url: `${baseUrl}/shop/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    // Fetch dynamic category search queries
    const categories = await Category.find({ isActive: true }).select("slug updatedAt");
    const categoryRoutes = categories.map((c) => ({
      url: `${baseUrl}/shop?category=${c.slug}`,
      lastModified: c.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

    dynamicRoutes = [...productRoutes, ...categoryRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
export const revalidate = 0;
