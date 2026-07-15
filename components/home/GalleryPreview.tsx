"use client";

import React from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { MagnifyingGlassPlus } from "@phosphor-icons/react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface GalleryImage {
  _id: string;
  imageUrl: string;
  altText: string;
}

export default function GalleryPreview() {
  const { data: images = [], isLoading } = useSWR<GalleryImage[]>("/api/gallery", fetcher);

  // Fallback defaults if no gallery images seeded
  const items = images.length > 0 ? images.slice(0, 4) : [
    { _id: "default-1", imageUrl: "/placeholder-goat.jpg", altText: "Farm View 1" },
    { _id: "default-2", imageUrl: "/placeholder-mutton.jpg", altText: "Farm View 2" },
    { _id: "default-3", imageUrl: "/placeholder-goat.jpg", altText: "Farm View 3" },
    { _id: "default-4", imageUrl: "/placeholder-mutton.jpg", altText: "Farm View 4" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-display text-4xl text-brand-black tracking-wide uppercase">
            A Look Inside Our Farm
          </h2>
          <p className="text-sm font-medium text-brand-gray">
            Healthy livestock, fresh cuts, and farm-raised quality. See for yourself.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 auto-rows-[160px] sm:auto-rows-[220px] md:auto-rows-[280px]">
          {items.map((img, i) => {
            let bentoClasses = "col-span-1 row-span-1"; // Normal for mobile
            let displayClass = ""; // Show by default

            if (i === 0) {
              bentoClasses = "col-span-1 row-span-1 md:col-span-2 md:row-span-2"; // Large feature on desktop, normal square on mobile
            } else if (i === 1) {
              bentoClasses = "col-span-1 row-span-1 md:col-span-2 md:row-span-1"; // Wide block on desktop, normal square on mobile
            } else if (i === 2) {
              bentoClasses = "col-span-1 row-span-1 md:col-span-1 md:row-span-1"; 
            } else if (i === 3) {
              bentoClasses = "col-span-1 row-span-1 md:col-span-1 md:row-span-1"; 
            }

            return (
              <Link
                href="/gallery"
                key={img._id}
                className={`relative w-full h-full overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-brand-border bg-brand-light-gray group cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500 ${bentoClasses} ${displayClass}`}
              >
                {/* Image */}
                {img.imageUrl && (
                  <Image
                    src={img.imageUrl}
                    alt={img.altText}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-cover ${i === 0 ? "object-bottom md:object-[center_20%]" : "object-[center_20%]"} group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]`}
                  />
                )}

                {/* Hover Dark Overlay with magnifying glass */}
                <div className="absolute inset-0 bg-brand-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-500 ease-out">
                    <MagnifyingGlassPlus size={28} weight="bold" className="text-white" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View Full Gallery Link Button */}
        <div className="text-center pt-4">
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center border-2 border-brand-black hover:bg-brand-black hover:text-white text-brand-black text-sm font-semibold h-11 px-8 rounded-full transition-all duration-200 shadow-xs"
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
