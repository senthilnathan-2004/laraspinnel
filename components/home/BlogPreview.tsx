"use client";

import React from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, User } from "lucide-react";

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

export default function BlogPreview() {
  const { data: posts = [], isLoading } = useSWR<BlogPost[]>("/api/blog?limit=3", fetcher);

  // Fallback defaults if no blog posts seeded
  const items = posts.length > 0 ? posts.slice(0, 3) : [
    {
      _id: "default-1",
      title: "Essential Summer Care Tips for Boer Goats",
      excerpt: "Learn how to keep your Boer goats hydrated, cool, and protected from heat stress during peak summer months.",
      coverImage: "/placeholder-goat.jpg",
      author: "Ragu Farm Team",
      tags: ["Farming Tips"],
      publishedAt: new Date().toISOString(),
      slug: "summer-care-boer-goats",
    },
    {
      _id: "default-2",
      title: "Why Farm-Raised Mutton is a Healthier Choice",
      excerpt: "Understand the nutritional benefits, quality differences, and pasture-to-plate traceability of farm-raised bulk meat.",
      coverImage: "/placeholder-mutton.jpg",
      author: "Ragu Farm Team",
      tags: ["Articles"],
      publishedAt: new Date().toISOString(),
      slug: "farm-raised-mutton-healthier",
    },
    {
      _id: "default-3",
      title: "Understanding Native vs. Premium Goat Breeds",
      excerpt: "A comprehensive guide comparison on Tellicherry, Boer, and native goat breeds suited for breeding and festivals.",
      coverImage: "/placeholder-goat.jpg",
      author: "Ragu Farm Team",
      tags: ["Farming Tips"],
      publishedAt: new Date().toISOString(),
      slug: "native-vs-premium-goat-breeds",
    }
  ];

  return (
    <section className="py-20 bg-brand-light-gray/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border pb-4 gap-3 sm:gap-0">
          <h2 className="font-display text-3xl text-brand-black tracking-wide uppercase">
            Farm Stories & Tips
          </h2>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-black hover:text-goat-primary transition-colors"
          >
            <span>View All Articles</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3 Blog Cards list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((post, i) => (
            <div key={post._id} className={i >= 2 ? "hidden md:block" : ""}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block bg-white border border-brand-border rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
              >
                {/* Cover Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-brand-light-gray">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={75}
                    className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    <FileText size={40} className="opacity-20" />
                  </div>
                )}
                {/* Category Floating Chip */}
                {post.tags?.[0] && (
                  <span className="absolute top-3.5 left-3.5 bg-goat-tint text-goat-text text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-goat-primary/10 shadow-sm">
                    {post.tags[0]}
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="p-3 md:p-5 space-y-3">
                <h3 className="font-semibold text-brand-black text-lg group-hover:text-goat-primary transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-brand-gray line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Meta details footer */}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Minimal loader icon fallback
function FileText({ size = 20, className = "" }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      width={size}
      height={size}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    </svg>
  );
}
