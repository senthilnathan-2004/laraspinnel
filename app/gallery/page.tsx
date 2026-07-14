"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, ChevronLeft, ChevronRight, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { MagnifyingGlassPlus } from "@phosphor-icons/react";
import useSWR from "swr";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface GalleryImage {
  _id: string;
  imageUrl: string;
  altText: string;
  caption?: string;
  category: "goat" | "mutton" | "farm" | "event";
}

export default function GalleryPage() {
  const { data: images = [], isLoading, error } = useSWR<GalleryImage[]>("/api/gallery", fetcher);

  const [activeTab, setActiveTab] = useState("All");
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeTab === "All") {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter((img) => img.category === activeTab.toLowerCase()));
    }
  }, [activeTab, images]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    const nextIdx = lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1;
    setLightboxIndex(nextIdx);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    const nextIdx = lightboxIndex === filteredImages.length - 1 ? 0 : lightboxIndex + 1;
    setLightboxIndex(nextIdx);
  };

  const categories = ["All", "Goat", "Mutton", "Farm", "Event"];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-12 w-full space-y-10 pb-20">
        {/* Page Header */}
        <div className="space-y-3 border-b border-brand-border pb-6">
          <span className="text-xs font-semibold text-goat-text uppercase tracking-wider">📸 Media Gallery</span>
          <h1 className="font-display text-4xl sm:text-5xl text-brand-black tracking-wide uppercase">
            Inside Ragu Goat Farm — Live Goats &amp; Fresh Mutton
          </h1>
          <h2 className="font-display text-lg text-goat-text uppercase tracking-wide">
            Farm Pastures, Healthy Livestock &amp; Packaging Gallery
          </h2>
          <p className="text-sm font-medium text-brand-gray hidden md:block">
            A visual look inside our Villupuram farm healthy naatu aadu breeds, pasture grazing fields, hygienic mutton packaging, and event deliveries from Ragu Goat Farm, Tamil Nadu.
          </p>
          <details className="md:hidden text-xs text-brand-gray border border-brand-border rounded-xl p-3 mt-2 bg-brand-light-gray/30">
            <summary className="font-semibold cursor-pointer outline-none select-none text-goat-text uppercase tracking-wider">
              Show Gallery Details &amp; Info
            </summary>
            <p className="mt-2 leading-relaxed">
              A visual look inside our Villupuram farm healthy naatu aadu breeds, pasture grazing fields, hygienic mutton packaging, and event deliveries from Ragu Goat Farm, Tamil Nadu.
            </p>
          </details>
        </div>

        {/* Tab Selection Filter Row */}
        <div className="flex border-b border-brand-border overflow-x-auto justify-start md:justify-center select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 md:px-6 py-3 text-sm font-semibold border-b-2 outline-none whitespace-nowrap transition-colors cursor-pointer ${activeTab === cat
                  ? "border-goat-primary text-goat-primary"
                  : "border-transparent text-brand-gray hover:text-brand-black"
                }`}
            >
              {cat === "Goat" ? "Live Goats" : cat === "Mutton" ? "Mutton Packs" : cat === "Farm" ? "Our Farm" : cat === "Event" ? "Events" : "All Photos"}
            </button>
          ))}
        </div>

        {/* Gallery Masonry/Flex grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square bg-neutral-100 animate-pulse rounded-2xl"></div>
            <div className="aspect-square bg-neutral-100 animate-pulse rounded-2xl"></div>
            <div className="aspect-square bg-neutral-100 animate-pulse rounded-2xl"></div>
            <div className="aspect-square bg-neutral-100 animate-pulse rounded-2xl"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-600 font-semibold py-12">
            Failed to load gallery images. Please refresh and try again.
          </p>
        ) : filteredImages.length === 0 ? (
          <div className="p-12 text-center text-brand-gray border border-brand-border bg-white rounded-2xl max-w-md mx-auto space-y-4">
            <ImageIcon size={48} className="mx-auto text-neutral-300" />
            <h3 className="font-semibold text-brand-black">No images found</h3>
            <p className="text-xs">There are no photos under this category at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((img, idx) => (
              <div
                key={img._id}
                onClick={() => setLightboxIndex(idx)}
                className="relative aspect-square overflow-hidden rounded-2xl border border-brand-border bg-brand-light-gray group cursor-pointer shadow-3xs"
              >
                {/* Image */}
                {img.imageUrl && (
                  <Image
                    src={img.imageUrl}
                    alt={img.altText}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    sizes="(max-w-768px) 100vw, 300px"
                  />
                )}
                {/* Category tag label */}
                <div className="absolute top-3 left-3 bg-brand-black/75 text-white text-[9px] uppercase font-extrabold px-2 py-0.5 rounded backdrop-blur-xs select-none shadow-3xs">
                  {img.category}
                </div>
                {/* Hover overlay indicator */}
                <div className="absolute inset-0 bg-brand-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <MagnifyingGlassPlus size={36} weight="bold" className="text-white" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* LIGHTBOX OVERLAY */}
      {lightboxIndex !== null && filteredImages[lightboxIndex] && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 bg-brand-black/95 z-[9999] flex flex-col justify-between p-3 md:p-6 select-none animate-in fade-in duration-200"
        >
          {/* Top panel: count & close */}
          <div className="flex justify-between items-center text-white text-sm">
            <span>
              {lightboxIndex + 1} of {filteredImages.length}
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>
          </div>

          {/* Middle: Image display and navigation controls */}
          <div className="flex-1 flex items-center justify-between relative max-w-5xl mx-auto w-full">
            {/* Left Nav Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-0 p-2 hover:bg-white/10 rounded-full transition-colors text-white z-10 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft size={36} />
            </button>

            {/* Display Image */}
            <div className="w-full h-[65vh] flex items-center justify-center p-3 md:p-4 relative">
              <Image
                src={filteredImages[lightboxIndex].imageUrl}
                alt={filteredImages[lightboxIndex].altText}
                fill
                className="object-contain rounded-lg animate-in zoom-in-95 duration-200"
                sizes="(max-w-1024px) 100vw, 1024px"
              />
            </div>

            {/* Right Nav Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-0 p-2 hover:bg-white/10 rounded-full transition-colors text-white z-10 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight size={36} />
            </button>
          </div>

          {/* Bottom Panel: Caption text */}
          <div className="text-center text-white space-y-1 py-4 max-w-xl mx-auto">
            {filteredImages[lightboxIndex].caption && (
              <h4 className="font-semibold text-base">
                {filteredImages[lightboxIndex].caption}
              </h4>
            )}
            <p className="text-xs text-neutral-500">
              Category: {filteredImages[lightboxIndex].category} &middot; {filteredImages[lightboxIndex].altText}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
