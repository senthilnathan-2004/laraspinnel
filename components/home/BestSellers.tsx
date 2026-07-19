"use client";

import React from "react";
import useSWR from "swr";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import PremiumCard from "./PremiumCard";
import SkeletonCard from "../shared/SkeletonCard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  slug: string;
}

export default function BestSellers() {
  const { data: products = [], isLoading, error } = useSWR<Product[]>(
    "/api/products?sort=latest",
    fetcher
  );

  return (
    <section className="relative overflow-hidden py-20 bg-brand-light-gray/20 border-t border-brand-border">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40V0h40' fill='none' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 space-y-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border pb-4 gap-3 sm:gap-0">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-goat-primary">
              <Sparkles size={16} className="animate-pulse text-gold-primary" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-brand-gray">Popular Choices</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-brand-black tracking-wide uppercase">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-goat-primary hover:text-goat-hover transition-colors"
          >
            <span>Explore All</span>
            <ArrowRight size={14} className="animate-arrow-slide lg:transition-transform lg:group-hover:translate-x-1" />
          </Link>
        </div>

        {/* List Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="block"><SkeletonCard /></div>
            <div className="block"><SkeletonCard /></div>
            <div className="block"><SkeletonCard /></div>
            <div className="block"><SkeletonCard /></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-600 text-sm font-semibold py-8">
            Failed to load best sellers.
          </p>
        ) : products.length === 0 ? (
          <div className="text-center text-brand-gray py-12">
            <p className="text-sm font-semibold">No best sellers available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.slice(0, 8).map((product, idx) => (
              <div 
                key={product._id} 
                className={idx >= 6 ? "hidden md:block" : "block"}
              >
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
      </div>
    </section>
  );
}
