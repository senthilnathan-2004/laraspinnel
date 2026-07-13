"use client";

import React from "react";
import useSWR from "swr";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PremiumCard from "./PremiumCard";
import SkeletonCard from "../shared/SkeletonCard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface MuttonPack {
  _id: string;
  name: string;
  price: string;
  districtsAvailable?: string[];
  images: string[];
  slug: string;
}

export default function FeaturedMutton() {
  const { data: packs = [], isLoading, error } = useSWR<MuttonPack[]>(
    "/api/mutton?featured=true",
    fetcher
  );

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border pb-4 gap-3 sm:gap-0">
          <h2 className="font-display text-3xl text-brand-black tracking-wide uppercase">
            Popular Mutton Packs
          </h2>
          <Link
            href="/mutton"
            className="inline-flex items-center gap-1 text-sm font-semibold text-mutton-primary hover:text-mutton-hover transition-colors"
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
            Failed to load mutton packs.
          </p>
        ) : packs.length === 0 ? (
          <div className="text-center text-brand-gray py-12">
            <p className="text-sm font-semibold">No featured mutton packs set up.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {packs.slice(0, 3).map((pack, i) => (
              <div key={pack._id} className={i >= 2 ? "hidden sm:block" : ""}>
                <PremiumCard
                  name={pack.name}
                  price={pack.price}
                  tag={pack.districtsAvailable?.[0] ? `In ${pack.districtsAvailable[0]}` : "Fresh Cut"}
                  image={pack.images?.[0]}
                  slug={pack.slug}
                  theme="mutton"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
