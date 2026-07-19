"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Sparkles } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface PremiumCardProps {
  id?: string;
  name: string;
  price: string;
  tag?: string;
  image?: string;
  slug: string;
  theme?: "goat" | "mutton";
}

export default function PremiumCard({
  id,
  name,
  price,
  tag,
  image,
  slug,
  theme = "goat",
}: PremiumCardProps) {
  const url = `/shop/${slug}`;
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Extract numeric price from format (e.g. "₹249" -> 249)
    const numericPrice = parseFloat(price.replace(/[^\d.]/g, "")) || 0;

    addItem({
      productId: id || slug, // Fallback to slug if id not provided
      name,
      price: numericPrice,
      image: image || "",
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      href={url}
      prefetch={true}
      className="group relative flex flex-col w-full overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] bg-white border border-brand-border/60 shadow-xs hover:shadow-md transition-all duration-300 h-full"
    >
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] w-full bg-brand-light-gray overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={75}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-10">
            <Sparkles size={48} className="text-brand-black" />
          </div>
        )}

        {/* Top Sale/Save Tag */}
        {tag && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
            <div className="flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-rose-primary text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider shadow-sm">
              <span>{tag}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section at Bottom */}
      <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 gap-2 sm:gap-3 bg-white">
        <div className="space-y-0.5 sm:space-y-1">
          {/* Subtle Category/Tag indicator */}
          <span className="block truncate text-[8px] sm:text-[9px] font-bold tracking-widest text-brand-gray uppercase">
            {tag ? "Special Offer" : "Handcrafted"}
          </span>
          <h3 className="truncate text-xs sm:text-sm font-display font-extrabold text-brand-black tracking-wide leading-snug group-hover:text-goat-primary transition-colors">
            {name}
          </h3>
        </div>

        {/* Price and Add to Cart Row */}
        <div className="flex items-center justify-between gap-1.5 mt-auto pt-2 border-t border-brand-border/40">
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold text-goat-primary">
              {price}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold transition-all duration-300 flex items-center gap-1 shadow-xs cursor-pointer border ${
              added
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : "bg-goat-primary text-white border-transparent hover:bg-goat-hover"
            }`}
          >
            {added ? (
              <>
                <span className="text-[10px] sm:text-xs font-bold">✓</span>
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart size={10} className="sm:w-3 sm:h-3" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
