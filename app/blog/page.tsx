import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { connectToDatabase } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import BlogListContainer from "@/components/blog/BlogListContainer";
import { Newspaper } from "lucide-react";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogListingPage() {
  let posts: any[] = [];
  try {
    await connectToDatabase();
    const rawPosts = await BlogPost.find({ isPublished: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();
    posts = JSON.parse(JSON.stringify(rawPosts));
  } catch (error) {
    console.error("Failed to fetch blog posts server-side:", error);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-7 md:py-12 w-full space-y-6 md:space-y-10">
        {/* Page Header */}
        <div className="space-y-3 border-b border-brand-border pb-6">
          <span className="flex items-center justify-center gap-2 text-xs font-semibold text-goat-text uppercase tracking-wider">
            <Newspaper size={14} className="text-goat-primary" /> Articles &amp; Updates
          </span>
          <h1 className="font-display text-2xl sm:text-5xl text-brand-black tracking-wide uppercase">
            Goat Farming &amp; Mutton Guides — Ragu Farm Blog
          </h1>
          <h2 className="font-display text-lg text-goat-text uppercase tracking-wide">
            Breed Tips, Naatu Aadu Recipes &amp; Bakrid Guides
          </h2>
          <p className="text-sm font-medium text-brand-gray hidden md:block">
            Expert articles on goat breeds, naatu aadu kulambu recipes, Bakrid goat selection, mutton health benefits, and farm updates direct from Ragu Goat Farm, Villupuram, Tamil Nadu.
          </p>
          <details className="md:hidden text-xs text-brand-gray border border-brand-border rounded-xl p-3 mt-2 bg-brand-light-gray/30">
            <summary className="font-semibold cursor-pointer outline-none select-none text-goat-text uppercase tracking-wider">
              Show Blog Details &amp; Category Info
            </summary>
            <p className="mt-2 leading-relaxed">
              Expert articles on goat breeds, naatu aadu kulambu recipes, Bakrid goat selection, mutton health benefits, and farm updates direct from Ragu Goat Farm, Villupuram, Tamil Nadu.
            </p>
          </details>
        </div>

        {/* Interactive Blog List Grid (Client Component) */}
        <BlogListContainer initialPosts={posts} />
      </main>

      <Footer />
    </div>
  );
}
