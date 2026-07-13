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
    <section className="py-20 bg-brand-light-gray/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border pb-4 gap-3 sm:gap-0">
          <h2 className="font-display text-3xl text-brand-black tracking-wide uppercase">
            Popular Goat Varieties
          </h2>
          <Link
            href="/goats"
            className="inline-flex items-center gap-1 text-sm font-semibold text-goat-primary hover:text-goat-hover transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* List Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="block"><SkeletonCard /></div>
            <div className="block"><SkeletonCard /></div>
            <div className="hidden sm:block"><SkeletonCard /></div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {goats.slice(0, 3).map((goat, i) => (
              <div key={goat._id} className={i >= 2 ? "hidden sm:block" : ""}>
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
