"use client";

import React from "react";
import useSWR from "swr";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import PremiumCard from "./PremiumCard";
import SkeletonCard from "../shared/SkeletonCard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface GoatVariety {
  _id: string;
  name: string;
  priceEstimate: string;
  tags?: string[];
  images: string[];
  slug: string;
}

export default function FeaturedVarieties() {
  const { data: goats = [], isLoading, error } = useSWR<GoatVariety[]>(
    "/api/goats?featured=true",
    fetcher
  );

  return (
    <section className="relative overflow-hidden py-20 bg-brand-light-gray/40 border-t border-brand-border">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40V0h40' fill='none' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 space-y-8">
        {/* Header row */}
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
            Popular Goat Varieties
          </h2>
          <Link
            href="/goats"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-goat-primary hover:text-goat-hover transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={14} className="animate-arrow-slide lg:transition-transform lg:group-hover:translate-x-1" />
          </Link>
        </div>

        {/* List Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="block"><SkeletonCard /></div>
            <div className="block"><SkeletonCard /></div>
            <div className="block"><SkeletonCard /></div>
            <div className="block"><SkeletonCard /></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-600 text-sm font-semibold py-8">
            Failed to load varieties.
          </p>
        ) : goats.length === 0 ? (
          <div className="text-center text-brand-gray py-12">
            <p className="text-sm font-semibold">No featured varieties set up.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {goats.slice(0, 4).map((goat) => (
              <div key={goat._id}>
                <PremiumCard
                  name={goat.name}
                  price={goat.priceEstimate}
                  tag={goat.tags?.[0]}
                  image={goat.images?.[0]}
                  slug={goat.slug}
                  theme="goat"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
