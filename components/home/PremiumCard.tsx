"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Leaf, Flame } from "@phosphor-icons/react";

interface PremiumCardProps {
  image: string;
  name: string;
  price: string;
  tag?: string;
  slug: string;
  theme: "goat" | "mutton";
}

export default function PremiumCard({
  image,
  name,
  price,
  tag,
  slug,
  theme,
}: PremiumCardProps) {
  const isGoat = theme === "goat";
  const url = isGoat ? `/goats/${slug}` : `/mutton/${slug}`;

  return (
    <Link
      href={url}
      className="group relative flex flex-col w-full overflow-hidden rounded-[2rem] bg-brand-black shadow-lg hover:shadow-2xl transition-all duration-700 aspect-square"
    >
      {/* Background Image with Zoom */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-900">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-10">
            {isGoat ? <Leaf size={64} /> : <Flame size={64} />}
          </div>
        )}
      </div>

      {/* Dark Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Top Tag */}
      {tag && (
        <div className="absolute top-5 left-5 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-medium tracking-wide shadow-sm">
            {isGoat ? (
              <Leaf size={12} weight="fill" className="text-green-300" />
            ) : (
              <Flame size={12} weight="fill" className="text-red-300" />
            )}
            <span>{tag}</span>
          </div>
        </div>
      )}

      {/* Content at Bottom */}
      <div className="relative z-10 mt-auto p-6 flex flex-col gap-4 transform md:translate-y-2 translate-y-0 group-hover:translate-y-0 transition-transform duration-500">
        <div className="space-y-1">
          <h3 className="text-2xl font-display text-white tracking-wide leading-tight group-hover:text-white/90">
            {name}
          </h3>
          <p
            className={`text-lg font-semibold tracking-tight ${
              isGoat ? "text-green-400" : "text-red-400"
            }`}
          >
            {price}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 mt-1 overflow-hidden">
          <div className="flex items-center gap-2 text-sm font-semibold text-white/90 md:text-white/80 group-hover:text-white transition-colors">
            <span>View Details</span>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 transform md:-translate-x-4 md:opacity-0 translate-x-0 opacity-100 group-hover:translate-x-0 group-hover:opacity-100 ${
                isGoat ? "bg-goat-primary" : "bg-mutton-primary"
              }`}
            >
              <ArrowRight size={14} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
