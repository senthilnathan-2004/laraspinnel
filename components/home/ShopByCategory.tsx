"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ShopByCategory({ settings }: { settings: any }) {
  const { data: categories = [], isLoading } = useSWR("/api/categories", fetcher);

  return (
    <section className="py-20 bg-brand-light-gray border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-brand-border pb-4 gap-3 sm:gap-0">
          <div>
            <h2 className="font-display text-2xl md:text-4xl text-brand-black tracking-wide uppercase">
              {settings.home_shop_title || "Handmade Gifts Crafted with Love"}
            </h2>
            <p className="text-sm font-medium text-brand-gray mt-1 text-justify md:text-left">
              {settings.home_shop_subtitle || "Browse our collection of hand-knitted crochet bouquets, customized frames, hampers, and accessories."}
            </p>
          </div>
        </div>

        {/* Dynamic Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="space-y-3">
                <div className="w-full aspect-square rounded-2xl md:rounded-[2rem] bg-neutral-200 animate-pulse" />
                <div className="h-4 bg-neutral-200 rounded animate-pulse w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category: any) => (
              <Link
                key={category._id}
                href={`/shop?category=${category.slug}`}
                className="group flex flex-col items-center text-center gap-3 w-full"
              >
                {/* Rounded Square Card with Off-White Background */}
                <div className="relative aspect-square w-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-[#F3F4F6] border border-brand-border/40 transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 200px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    quality={75}
                  />
                </div>

                {/* Title Text Underneath */}
                <h3 className="font-semibold text-brand-black text-xs md:text-base leading-tight transition-colors group-hover:text-goat-primary uppercase tracking-wide px-1">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
