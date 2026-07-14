"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FilterBar from "@/components/catalog/FilterBar";
import VarietyCard from "@/components/catalog/VarietyCard";
import SkeletonCard from "@/components/shared/SkeletonCard";
import EmptyState from "@/components/shared/EmptyState";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface GoatVariety {
  _id: string;
  name: string;
  breed: string;
  priceEstimate: string;
  weightRange: string;
  ageRange: string;
  tags?: string[];
  images: string[];
  slug: string;
  isFeatured: boolean;
}

const EMPTY_ARRAY: GoatVariety[] = [];

export default function GoatsListingPage() {
  const { data, isLoading, error } = useSWR<GoatVariety[]>("/api/goats", fetcher);
  const goats = data || EMPTY_ARRAY;

  const [filteredGoats, setFilteredGoats] = useState<GoatVariety[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedTag, setSelectedTag] = useState("All");

  // Get unique list of breeds for filters
  const breeds = Array.from(new Set(goats.map((g) => g.breed))).filter(Boolean);

  // Get unique list of tags
  const tags = Array.from(new Set(goats.flatMap((g) => g.tags || []))).filter(Boolean);

  useEffect(() => {
    let results = [...goats];

    // Search filter
    if (searchTerm) {
      results = results.filter(
        (g) =>
          g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.breed.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Breed filter
    if (selectedBreed !== "all") {
      results = results.filter((g) => g.breed === selectedBreed);
    }

    // Tag filter
    if (selectedTag !== "All") {
      results = results.filter((g) => g.tags?.includes(selectedTag));
    }

    // Sorting
    results.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === "featured") {
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
      return 0;
    });

    setFilteredGoats(results);
  }, [searchTerm, selectedBreed, sortBy, selectedTag, goats]);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedBreed("all");
    setSortBy("name-asc");
    setSelectedTag("All");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-12 w-full space-y-10">
        {/* Page Header */}
        <div className="space-y-3 border-b border-brand-border pb-6">
          <span className="text-xs font-semibold text-goat-text uppercase tracking-wider">🌿 Live Livestock Catalog</span>
          <h1 className="font-display text-4xl sm:text-5xl text-brand-black tracking-wide uppercase">
            Live Goat Varieties — Pasture Raised Breeds for Sale
          </h1>
          <h2 className="font-display text-lg text-goat-text uppercase tracking-wide">
            Find Your Perfect Breed — Tellicherry, Boer, Kanni Aadu &amp; More
          </h2>
          <p className="text-sm font-medium text-brand-gray hidden md:block">
            Browse our healthy naatu aadu and premium crossbreeds available for Bakrid sacrifice, rearing, and breeding. All goats are vaccinated and delivered safely across Villupuram, Tindivanam, and all Tamil Nadu districts.
          </p>
          <details className="md:hidden text-xs text-brand-gray border border-brand-border rounded-xl p-3 mt-2 bg-brand-light-gray/30">
            <summary className="font-semibold cursor-pointer outline-none select-none text-goat-text uppercase tracking-wider">
              Show Farm &amp; Delivery Details
            </summary>
            <p className="mt-2 leading-relaxed">
              Browse our healthy naatu aadu and premium crossbreeds available for Bakrid sacrifice, rearing, and breeding. All goats are vaccinated and delivered safely across Villupuram, Tindivanam, and all Tamil Nadu districts.
            </p>
          </details>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedBreed={selectedBreed}
          onBreedChange={setSelectedBreed}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          breeds={breeds}
          tags={tags}
          theme="goat"
          searchSuggestions={Array.from(new Set(goats.flatMap(g => [g.name, g.breed])))}
        />

        {/* Catalog Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : error ? (
          <p className="text-center text-red-600 font-semibold py-12">
            Failed to load goat varieties. Please refresh and try again.
          </p>
        ) : filteredGoats.length === 0 ? (
          <EmptyState onReset={handleReset} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGoats.map((goat) => (
              <VarietyCard
                key={goat._id}
                name={goat.name}
                price={goat.priceEstimate}
                tag={goat.tags?.[0]}
                image={goat.images?.[0]}
                slug={goat.slug}
                theme="goat"
              />
            ))}
          </div>
        )}

        {/* SEO Content Block */}
        <section className="bg-brand-light-gray/20 rounded-2xl p-4 md:p-6 border border-brand-border mt-12 text-left w-full mx-auto space-y-4">
          <h3 className="font-display text-2xl text-brand-black uppercase tracking-wide">
            Buy Live Goats Online in Tamil Nadu
          </h3>
          <p className="text-brand-gray text-sm leading-relaxed">
            Discover a wide selection of pasture-raised, healthy live goats at Ragu Goat Farm. We specialize in premium breeds such as Boer, Tellicherry, Kanni Aadu, and local Naatu Aadu. Whether you need livestock for breeding, farming, or festive occasions like Bakrid, our goats are reared in open pastures with natural feed and regular veterinary care to ensure superior health and growth. We offer transparent pricing and reliable transport services across Villupuram, Tindivanam, Chennai, and other major districts in Tamil Nadu.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
