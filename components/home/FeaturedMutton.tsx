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
    <section className="relative overflow-hidden py-20 bg-white">
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
            Popular Mutton Packs
          </h2>
          <Link
            href="/mutton"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-mutton-primary hover:text-mutton-hover transition-colors"
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
            Failed to load mutton packs.
          </p>
        ) : packs.length === 0 ? (
          <div className="text-center text-brand-gray py-12">
            <p className="text-sm font-semibold">No featured mutton packs set up.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {packs.slice(0, 4).map((pack) => (
              <div key={pack._id}>
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
