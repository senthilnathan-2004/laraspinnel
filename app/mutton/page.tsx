"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FilterBar from "@/components/catalog/FilterBar";
import VarietyCard from "@/components/catalog/VarietyCard";
import SkeletonCard from "@/components/shared/SkeletonCard";
import EmptyState from "@/components/shared/EmptyState";
import { useSettings } from "@/hooks/useSettings";
import { MapPin, Info } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface MuttonPack {
  _id: string;
  name: string;
  price: string;
  description: string;
  weightOptions?: string[];
  districtsAvailable?: string[];
  images: string[];
  slug: string;
  isFeatured: boolean;
}

const EMPTY_ARRAY: MuttonPack[] = [];

export default function MuttonListingPage() {
  const { data, isLoading, error } = useSWR<MuttonPack[]>("/api/mutton", fetcher);
  const packs = data || EMPTY_ARRAY;
  const { settings } = useSettings();

  const [filteredPacks, setFilteredPacks] = useState<MuttonPack[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedTag, setSelectedTag] = useState("All");

  const districtsStr = settings.mutton_districts || "Coimbatore, Tiruppur, Erode, Villupuram";
  
  // Collect unique tags/chips (e.g. from districts or packaging labels)
  const tags = Array.from(
    new Set(packs.flatMap((p) => p.districtsAvailable || []))
  ).filter(Boolean);

  useEffect(() => {
    let results = [...packs];

    // Search filter
    if (searchTerm) {
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tag filter (filtering by district availability)
    if (selectedTag !== "All") {
      results = results.filter((p) => p.districtsAvailable?.includes(selectedTag));
    }

    // Sorting
    results.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === "price-asc") {
        // Strip non-numbers to sort price estimate
        const pA = parseFloat(a.price.replace(/[^\d.]/g, "")) || 0;
        const pB = parseFloat(b.price.replace(/[^\d.]/g, "")) || 0;
        return pA - pB;
      }
      if (sortBy === "price-desc") {
        const pA = parseFloat(a.price.replace(/[^\d.]/g, "")) || 0;
        const pB = parseFloat(b.price.replace(/[^\d.]/g, "")) || 0;
        return pB - pA;
      }
      return 0;
    });

    setFilteredPacks(results);
  }, [searchTerm, sortBy, selectedTag, packs]);

  const handleReset = () => {
    setSearchTerm("");
    setSortBy("name-asc");
    setSelectedTag("All");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-12 w-full space-y-10">
        {/* Page Header */}
        <div className="space-y-2 border-b border-brand-border pb-6">
          <span className="text-xs font-semibold text-mutton-text uppercase tracking-wider">🥩 Premium Mutton Catalog</span>
          <h1 className="font-display text-4xl sm:text-5xl text-brand-black tracking-wide uppercase">
            Fresh Mutton Packages
          </h1>
          <p className="text-sm font-medium text-brand-gray max-w-xl">
            Order farm-fresh bulk mutton packages, prepared hygienically in customizable portions and delivered to your doorstep.
          </p>
        </div>

        {/* District service banner */}
        <div className="bg-mutton-tint/40 border border-mutton-primary/10 rounded-2xl p-3 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
          <div className="flex gap-3 items-start">
            <MapPin size={22} className="text-mutton-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-brand-black">Fresh Mutton Delivery Districts</p>
              <p className="text-xs text-mutton-text mt-0.5 font-medium">
                We deliver fresh bulk mutton to {districtsStr} districts.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-brand-gray bg-white border border-brand-border px-3 py-1.5 rounded-xl shadow-2xs shrink-0 self-start sm:self-auto">
            <Info size={14} className="text-neutral-400" />
            <span>Outside these districts? Contact us</span>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedBreed=""
          onBreedChange={() => {}}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          breeds={[]}
          tags={tags}
          theme="mutton"
          searchSuggestions={Array.from(new Set(packs.map(p => p.name)))}
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
            Failed to load mutton packages. Please refresh and try again.
          </p>
        ) : filteredPacks.length === 0 ? (
          <EmptyState onReset={handleReset} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPacks.map((pack) => (
              <VarietyCard
                key={pack._id}
                name={pack.name}
                price={pack.price}
                tag={pack.districtsAvailable?.[0] ? `In ${pack.districtsAvailable[0]}` : "Fresh Cut"}
                image={pack.images?.[0]}
                slug={pack.slug}
                theme="mutton"
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
