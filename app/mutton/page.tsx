
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
        <div className="space-y-3 border-b border-brand-border pb-6">
          <span className="text-xs font-semibold text-mutton-text uppercase tracking-wider">🥩 Premium Mutton Catalog</span>
          <h1 className="font-display text-4xl sm:text-5xl text-brand-black tracking-wide uppercase">
            Fresh Mutton Packs — Farm to Home Delivery
          </h1>
          <h2 className="font-display text-lg text-mutton-text uppercase tracking-wide">
            Bulk Naatu Aadu Mutton — 5kg, 10kg &amp; Custom Packs
          </h2>
          <p className="text-sm font-medium text-brand-gray hidden md:block">
            Order farm fresh bulk mutton packages, freshly cut and hygienically packed, and delivered to your doorstep across Villupuram, Tindivanam, and other major districts in Tamil Nadu. Perfect for weddings, functions, and regular orders.
          </p>
          <details className="md:hidden text-xs text-brand-gray border border-brand-border rounded-xl p-3 mt-2 bg-brand-light-gray/30">
            <summary className="font-semibold cursor-pointer outline-none select-none text-mutton-text uppercase tracking-wider">
              Show Farm &amp; Delivery Details
            </summary>
            <p className="mt-2 leading-relaxed">
              Order farm fresh bulk mutton packages, freshly cut and hygienically packed, and delivered to your doorstep across Villupuram, Tindivanam, and other major districts in Tamil Nadu. Perfect for weddings, functions, and regular orders.
            </p>
          </details>
        </div>

        {/* District service banner */}
        <div className="bg-mutton-tint/40 border border-mutton-primary/10 rounded-2xl p-3 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
          <div className="flex gap-3 items-start">
            <MapPin size={22} className="text-mutton-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-brand-black">Fresh Mutton Delivery Districts</h3>
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
          onBreedChange={() => { }}
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

        {/* SEO Content Block */}
        <section className="bg-brand-light-gray/20 rounded-2xl p-4 md:p-6 border border-brand-border mt-12 text-left w-full mx-auto space-y-4">
          <h3 className="font-display text-2xl text-brand-black uppercase tracking-wide">
            Bulk Farm Fresh Mutton Delivery
          </h3>
          <p className="text-brand-gray text-sm leading-relaxed">
            Elevate your culinary experience with premium, farm fresh mutton from Ragu Goat Farm. We supply hygienic, bulk mutton packs ideal for weddings, restaurants, family gatherings, and commercial orders. Sourced exclusively from healthy, young country goats (Naatu Aadu) raised on our farm, our meat guarantees tenderness and rich traditional flavor. Enjoy seamless booking and prompt cold chain delivery directly to your doorstep in Villupuram, Pondicherry, Tindivanam, Vanur and surrounding districts in Tamil Nadu.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
