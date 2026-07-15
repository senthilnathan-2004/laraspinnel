"use client";

import React, { useState, useEffect } from "react";
import FilterBar from "@/components/catalog/FilterBar";
import VarietyCard from "@/components/catalog/VarietyCard";
import EmptyState from "@/components/shared/EmptyState";

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

export default function GoatsClientList({ initialGoats }: { initialGoats: GoatVariety[] }) {
  const [filteredGoats, setFilteredGoats] = useState<GoatVariety[]>(initialGoats);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedTag, setSelectedTag] = useState("All");

  const breeds = Array.from(new Set(initialGoats.map((g) => g.breed))).filter(Boolean);
  const tags = Array.from(new Set(initialGoats.flatMap((g) => g.tags || []))).filter(Boolean);

  useEffect(() => {
    let results = [...initialGoats];

    if (searchTerm) {
      results = results.filter(
        (g) =>
          g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.breed.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBreed !== "all") {
      results = results.filter((g) => g.breed === selectedBreed);
    }

    if (selectedTag !== "All") {
      results = results.filter((g) => g.tags?.includes(selectedTag));
    }

    results.sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "featured") return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      return 0;
    });

    setFilteredGoats(results);
  }, [searchTerm, selectedBreed, sortBy, selectedTag, initialGoats]);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedBreed("all");
    setSortBy("name-asc");
    setSelectedTag("All");
  };

  return (
    <>
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
        searchSuggestions={Array.from(new Set(initialGoats.flatMap(g => [g.name, g.breed])))}
      />

      {filteredGoats.length === 0 ? (
        <EmptyState onReset={handleReset} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
    </>
  );
}
