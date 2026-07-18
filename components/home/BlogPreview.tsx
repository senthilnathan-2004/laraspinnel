"use client";

import React, { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";

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

const mockPosts: BlogPost[] = [
  { _id: "m1", title: "Essential Summer Care Tips for Boer Goats", excerpt: "Learn how to keep your Boer goats hydrated, cool, and protected from heat stress during peak summer months.", coverImage: "/placeholder-goat.jpg", author: "Ragu Farm Team", tags: ["Farming Tips"], slug: "summer-care-boer-goats" },
  { _id: "m2", title: "Why Farm-Raised Mutton is a Healthier Choice", excerpt: "Understand the nutritional benefits, quality differences, and pasture-to-plate traceability of farm-raised bulk meat.", coverImage: "/placeholder-mutton.jpg", author: "Ragu Farm Team", tags: ["Articles"], slug: "farm-raised-mutton-healthier" },
  { _id: "m3", title: "Understanding Native vs. Premium Goat Breeds", excerpt: "A comprehensive guide comparison on Tellicherry, Boer, and native goat breeds suited for breeding and festivals.", coverImage: "/placeholder-goat.jpg", author: "Ragu Farm Team", tags: ["Farming Tips"], slug: "native-vs-premium-goat-breeds" },
  { _id: "m4", title: "Winter Care for Your Farm Animals", excerpt: "Keep your livestock warm and cozy during the chilly winter months with these essential tips.", coverImage: "/placeholder-goat.jpg", author: "Ragu Farm Team", tags: ["Farming Tips"], slug: "winter-care" },
  { _id: "m5", title: "Organic Feeding Strategies", excerpt: "Boost your goat's growth naturally with our proven organic pasture feeding strategies.", coverImage: "/placeholder-goat.jpg", author: "Ragu Farm Team", tags: ["Feeding"], slug: "organic-feeding" },
  { _id: "m6", title: "Top 5 Goat Breeds in Tamil Nadu", excerpt: "Discover the best local breeds that are highly adapted to the Tamil Nadu climate.", coverImage: "/placeholder-goat.jpg", author: "Ragu Farm Team", tags: ["Breeds"], slug: "top-5-goat-breeds" },
  { _id: "m7", title: "Sustainable Farming Practices", excerpt: "How we ensure eco-friendly meat production and prioritize sustainability at our farm.", coverImage: "/placeholder-mutton.jpg", author: "Ragu Farm Team", tags: ["Sustainability"], slug: "sustainable-farming" },
];

export default function BlogPreview() {
  const { data: posts = [], isLoading } = useSWR<BlogPost[]>("/api/blog?limit=7", fetcher);
  const fetchedItems = posts.length > 0 ? posts : mockPosts;

  const [visibleItems, setVisibleItems] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth >= 1024) setVisibleItems(3);
      else if (window.innerWidth >= 768) setVisibleItems(2);
      else setVisibleItems(1);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const totalItemsAllowed = visibleItems === 3 ? 7 : visibleItems === 2 ? 5 : 3;
  const itemsToRender = fetchedItems.slice(0, totalItemsAllowed);
  const maxSlide = Math.max(0, itemsToRender.length - visibleItems);

  useEffect(() => {
    if (currentSlide > maxSlide) {
      setCurrentSlide(maxSlide);
    }
  }, [maxSlide, currentSlide]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  }, [maxSlide]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  }, [maxSlide]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="py-20 bg-brand-light-gray/40 border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border pb-4 gap-3 sm:gap-0">
          <style>{`
            @keyframes arrowSlide {
              0%, 100% { transform: translateX(0); }
              50% { transform: translateX(4px); }
            }
            @media (max-width: 1023px) {
              .animate-arrow-slide {
                animation: arrowSlide 1.5s ease-in-out infinite;
              }
            }
          `}</style>
          <h2 className="font-display text-2xl md:text-3xl text-brand-black tracking-wide uppercase">
            Farm Stories & Tips
          </h2>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-black hover:text-goat-primary transition-colors"
          >
            <span>View All Articles</span>
            <ArrowRight size={14} className="animate-arrow-slide lg:transition-transform lg:group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative -mx-4 overflow-hidden py-2">
          <div 
            className="flex transition-transform duration-500 ease-in-out items-stretch"
            style={{ transform: `translateX(-${currentSlide * (100 / visibleItems)}%)` }}
          >
            {itemsToRender.map((post) => (
              <div key={post._id} className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-4 h-auto">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col h-full bg-white border border-brand-border rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-brand-light-gray shrink-0">
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
                  <div className="p-3 md:p-5 space-y-3 flex flex-col flex-grow">
                    <h3 className="font-semibold text-brand-black text-lg group-hover:text-goat-primary transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-brand-gray line-clamp-2 leading-relaxed flex-grow">
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
          
          {/* Controls */}
          {maxSlide > 0 && (
            <div className="flex items-center justify-center gap-5 mt-8">
              <button 
                onClick={prevSlide}
                className="w-9 h-9 rounded-full bg-white border border-brand-border flex items-center justify-center text-brand-black shadow-sm active:scale-95 transition-transform"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex gap-2.5">
                {[...Array(maxSlide + 1)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentSlide === idx ? "w-8 bg-brand-black" : "w-2.5 bg-brand-border"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={nextSlide}
                className="w-9 h-9 rounded-full bg-white border border-brand-border flex items-center justify-center text-brand-black shadow-sm active:scale-95 transition-transform"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
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
