"use client";

import React, { useState, useEffect } from "react";
import FilterBar from "@/components/catalog/FilterBar";
import VarietyCard from "@/components/catalog/VarietyCard";
import EmptyState from "@/components/shared/EmptyState";

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

export default function MuttonClientList({ initialPacks }: { initialPacks: MuttonPack[] }) {
  const [filteredPacks, setFilteredPacks] = useState<MuttonPack[]>(initialPacks);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedTag, setSelectedTag] = useState("All");

  const tags = Array.from(
    new Set(initialPacks.flatMap((p) => p.districtsAvailable || []))
  ).filter(Boolean);

  useEffect(() => {
    let results = [...initialPacks];

    if (searchTerm) {
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTag !== "All") {
      results = results.filter((p) => p.districtsAvailable?.includes(selectedTag));
    }

    results.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === "price-asc") {
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
  }, [searchTerm, sortBy, selectedTag, initialPacks]);

  const handleReset = () => {
    setSearchTerm("");
    setSortBy("name-asc");
    setSelectedTag("All");
  };

  return (
    <>
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
        searchSuggestions={Array.from(new Set(initialPacks.map(p => p.name)))}
      />

      {filteredPacks.length === 0 ? (
        <EmptyState onReset={handleReset} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
    </>
  );
}
