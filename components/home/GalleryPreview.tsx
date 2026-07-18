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

  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev >= items.length - 1 ? 0 : prev + 1));
    }, 2500);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <section className="relative overflow-hidden py-20 bg-white">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40V0h40' fill='none' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-display text-2xl md:text-4xl text-brand-black tracking-wide uppercase">
            A Look Inside Our Farm
          </h2>
          <p className="text-sm font-medium text-brand-gray">
            Healthy livestock, fresh cuts, and farm-raised quality. See for yourself.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 auto-rows-[160px] sm:auto-rows-[220px] lg:auto-rows-[200px]">
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

            const isActive = activeIndex === i;

            return (
              <Link
                href="/gallery"
                key={img._id}
                className={`relative w-full h-full overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border-4 bg-brand-light-gray group cursor-pointer transition-all duration-500 ease-out ${
                  isActive 
                    ? "border-brand-gray shadow-xl z-10" 
                    : "border-brand-border/50 hover:border-brand-border shadow-sm z-0"
                } ${bentoClasses} ${displayClass}`}
              >
                {/* Image */}
                {img.imageUrl && (
                  <Image
                    src={img.imageUrl}
                    alt={img.altText}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={75}
                    className={`object-cover ${i === 0 ? "object-bottom md:object-[center_20%]" : "object-[center_20%]"} ${isActive ? "scale-[1.02]" : "group-hover:scale-[1.02]"} transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]`}
                  />
                )}

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
