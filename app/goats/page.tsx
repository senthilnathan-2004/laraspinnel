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
        <div className="space-y-2 border-b border-brand-border pb-6">
          <span className="text-xs font-semibold text-goat-text uppercase tracking-wider">🌿 Live Livestock Catalog</span>
          <h1 className="font-display text-4xl sm:text-5xl text-brand-black tracking-wide uppercase">
            Our Goat Varieties
          </h1>
          <p className="text-sm font-medium text-brand-gray max-w-xl">
            Browse our pasture-raised healthy breeds available for breeding, rearing, and festivals. Delivered safely across all districts in Tamil Nadu.
          </p>
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
      </main>

      <Footer />
    </div>
  );
}
