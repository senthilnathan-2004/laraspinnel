"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PremiumCard from "@/components/home/PremiumCard";
import SkeletonCard from "@/components/shared/SkeletonCard";
import CustomSelect from "@/components/shared/CustomSelect";
import { Search, ShoppingBag } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ShopPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse initial query params
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialSort = searchParams.get("sort") || "latest";

  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);

  // Sync state with URL search params
  useEffect(() => {
    setCategory(searchParams.get("category") || "all");
    setSearchTerm(searchParams.get("search") || "");
    setSort(searchParams.get("sort") || "latest");
  }, [searchParams]);

  // Fetch Categories
  const { data: categories = [] } = useSWR("/api/categories", fetcher);

  // Fetch Products
  const queryParams = new URLSearchParams();
  if (category && category !== "all") queryParams.append("category", category);
  if (searchTerm) queryParams.append("search", searchTerm);
  if (sort) queryParams.append("sort", sort);

  const { data: products = [], isLoading, error } = useSWR(
    `/api/products?${queryParams.toString()}`,
    fetcher
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ search: searchTerm });
  };

  const updateUrlParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === "" || val === "all") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-7 md:py-12 w-full space-y-8 animate-in fade-in">
        {/* Page Header */}
        <div className="space-y-3 border-b border-brand-border pb-6 text-center">
          <span className="flex items-center justify-center gap-2 text-xs font-semibold text-goat-text uppercase tracking-wider">
            <ShoppingBag size={14} className="text-goat-primary" /> Gift Catalog
          </span>
          <h1 className="font-display text-3xl sm:text-5xl text-brand-black tracking-wide uppercase">
            Shop Handmade Gifts
          </h1>
          <p className="text-sm font-medium text-brand-gray">
            Explore our collection of custom crochet bouquets, frames, keychains, and hampers.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-brand-border rounded-2xl p-3 md:p-5 space-y-4 shadow-card">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full lg:flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-gray">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by name..."
                className="w-full h-11 pl-10 pr-4 bg-brand-light-gray/50 border border-brand-border rounded-xl text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary transition-all"
              />
              <button type="submit" className="sr-only">Search</button>
            </form>

            {/* Selects */}
            <div className="flex w-full lg:w-auto items-center gap-3">
              {/* Category Filter */}
              <div className="flex-1 min-w-0 lg:flex-none lg:w-48">
                <CustomSelect
                  options={[
                    { label: "All Categories", value: "all" },
                    ...categories.map((c: any) => ({ label: c.name, value: c.slug })),
                  ]}
                  value={category}
                  onChange={(val) => {
                    setCategory(val);
                    updateUrlParams({ category: val });
                  }}
                  theme="goat"
                />
              </div>

              {/* Sort selector */}
              <div className="flex-1 min-w-0 lg:flex-none lg:w-48">
                <CustomSelect
                  options={[
                    { label: "Latest Arrivals", value: "latest" },
                    { label: "Price (Low to High)", value: "price-asc" },
                    { label: "Price (High to Low)", value: "price-desc" },
                  ]}
                  value={sort}
                  onChange={(val) => {
                    setSort(val);
                    updateUrlParams({ sort: val });
                  }}
                  theme="goat"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="block"><SkeletonCard key={idx} /></div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-600 text-sm font-semibold py-8">
            Failed to load products list.
          </p>
        ) : products.length === 0 ? (
          <div className="text-center text-brand-gray py-20 border border-brand-border border-dashed rounded-3xl bg-brand-light-gray/20">
            <ShoppingBag className="mx-auto mb-3 text-neutral-300 animate-bounce" size={48} />
            <p className="text-sm font-semibold text-brand-black">No products found</p>
            <p className="text-xs mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product: any) => (
              <div key={product._id}>
                <PremiumCard
                  id={product._id}
                  name={product.name}
                  price={product.discountPrice ? `₹${product.discountPrice}` : `₹${product.price}`}
                  tag={product.discountPrice ? `SAVE ₹${product.price - product.discountPrice}` : undefined}
                  image={product.images?.[0]}
                  slug={product.slug}
                  theme="goat"
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-goat-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}
