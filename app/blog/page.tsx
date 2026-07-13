"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, Calendar, User, FileText, ArrowRight } from "lucide-react";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  author: string;
  tags?: string[];
  publishedAt?: string;
  slug: string;
}

export default function BlogListingPage() {
  const { data: posts = [], isLoading, error } = useSWR<BlogPost[]>("/api/blog", fetcher);

  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  // Get unique list of tags
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags || []))).filter(Boolean);

  useEffect(() => {
    let results = [...posts];

    // Search filter
    if (searchTerm) {
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tag filter
    if (selectedTag !== "All") {
      results = results.filter((p) => p.tags?.includes(selectedTag));
    }

    setFilteredPosts(results);
  }, [searchTerm, selectedTag, posts]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-12 w-full space-y-10">
        {/* Page Header */}
        <div className="space-y-2 border-b border-brand-border pb-6">
          <span className="text-xs font-semibold text-goat-text uppercase tracking-wider">📰 Articles & Updates</span>
          <h1 className="font-display text-4xl sm:text-5xl text-brand-black tracking-wide uppercase">
            Ragu Farm Blog
          </h1>
          <p className="text-sm font-medium text-brand-gray max-w-xl">
            Read about goat farming tips, breed comparisons, healthy mutton recipes, and updates direct from our Villupuram farm.
          </p>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="bg-white border border-brand-border rounded-2xl p-3 md:p-5 space-y-4 shadow-card">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-gray">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blog articles by title or keyword..."
              className="w-full h-11 pl-10 pr-4 bg-brand-light-gray/50 border border-brand-border rounded-xl text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary transition-all"
            />
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-brand-border pt-4 text-xs font-semibold select-none">
              <span className="text-brand-gray uppercase tracking-wider font-bold mr-1">Categories:</span>
              <button
                onClick={() => setSelectedTag("All")}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedTag === "All"
                    ? "bg-goat-tint text-goat-text border-goat-primary/20"
                    : "bg-white text-brand-black border-brand-border hover:bg-brand-light-gray"
                }`}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    selectedTag === tag
                      ? "bg-goat-tint text-goat-text border-goat-primary/20"
                      : "bg-white text-brand-black border-brand-border hover:bg-brand-light-gray"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Listing Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-80 bg-neutral-100 rounded-2xl animate-pulse"></div>
            <div className="h-80 bg-neutral-100 rounded-2xl animate-pulse"></div>
            <div className="h-80 bg-neutral-100 rounded-2xl animate-pulse"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-600 font-semibold py-12">
            Failed to load blog articles. Please refresh and try again.
          </p>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-brand-gray border border-brand-border bg-white rounded-2xl max-w-md mx-auto space-y-4">
            <FileText size={48} className="mx-auto text-neutral-300" />
            <h3 className="font-semibold text-brand-black">No articles found</h3>
            <p className="text-xs">Adjust your search parameters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group bg-white border border-brand-border rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-brand-light-gray">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <FileText size={40} className="opacity-20" />
                    </div>
                  )}
                  {post.tags?.[0] && (
                    <span className="absolute top-3.5 left-3.5 bg-goat-tint text-goat-text text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-goat-primary/10 shadow-sm">
                      {post.tags[0]}
                    </span>
                  )}
                </div>

                {/* Text details */}
                <div className="p-3 md:p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-brand-black text-lg group-hover:text-goat-primary transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-brand-gray line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-brand-gray border-t border-brand-border pt-4 mt-2">
                    <div className="flex items-center gap-1">
                      <User size={12} className="text-neutral-400" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono">
                      <Calendar size={12} className="text-neutral-400" />
                      <span>
                        {new Date(post.publishedAt || "").toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
