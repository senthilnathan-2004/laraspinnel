"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Leaf, Flame } from "@phosphor-icons/react";

const imageKitLoader = ({ src, width, quality }: { src: string, width: number, quality?: number }) => {
  if (src.startsWith('https://ik.imagekit.io')) {
    const params = [`w-${width}`];
    if (quality) params.push(`q-${quality}`);
    return `${src}?tr=${params.join(",")}`;
  }
  return src;
};

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
      prefetch={true}
      className="group relative flex flex-col w-full overflow-hidden rounded-4xl bg-brand-black shadow-lg hover:shadow-2xl transition-all duration-700 aspect-square"
    >
      {/* Background Image with Zoom */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-900">
        {image ? (
          <Image
            loader={imageKitLoader}
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={75}
            className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-10">
            {isGoat ? <Leaf size={64} /> : <Flame size={64} />}
          </div>
        )}
      </div>

      {/* Dark Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Top Tag */}
      {tag && (
        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-10">
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 max-[355px]:px-1.5 max-[355px]:py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] max-[355px]:text-[8px] sm:text-xs font-medium tracking-wide shadow-sm">
            {isGoat ? (
              <Leaf weight="fill" className="text-green-300 w-2.5 h-2.5 max-[355px]:w-2 max-[355px]:h-2 sm:w-3 sm:h-3" />
            ) : (
              <Flame weight="fill" className="text-red-300 w-2.5 h-2.5 max-[355px]:w-2 max-[355px]:h-2 sm:w-3 sm:h-3" />
            )}
            <span className="max-[355px]:max-w-[50px] max-[355px]:truncate">{tag}</span>
          </div>
        </div>
      )}

      {/* Content at Bottom */}
      <div className="relative z-10 mt-auto p-4 sm:p-6 max-[355px]:p-2.5 flex flex-col gap-2 max-[355px]:gap-1 sm:gap-4 transform md:translate-y-2 translate-y-0 group-hover:translate-y-0 transition-transform duration-500">
        <div className="space-y-0.5 sm:space-y-1 max-[355px]:space-y-0">
          <h3 className="text-lg sm:text-2xl max-[355px]:text-[14px] font-display text-white tracking-wide leading-tight group-hover:text-white/90">
            {name}
          </h3>
          <p
            className={`text-sm sm:text-lg max-[355px]:text-[11px] font-semibold tracking-tight ${
              isGoat ? "text-green-400" : "text-red-400"
            }`}
          >
            {price}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 mt-0 sm:mt-1 max-[355px]:mt-0 overflow-hidden">
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] max-[355px]:text-[8.5px] sm:text-sm font-semibold text-white/90 md:text-white/80 group-hover:text-white transition-colors">
            <span>View Details</span>
            <div
              className={`flex items-center justify-center w-5 h-5 max-[355px]:w-4 max-[355px]:h-4 sm:w-8 sm:h-8 rounded-full transition-all duration-500 transform md:-translate-x-4 md:opacity-0 translate-x-0 opacity-100 group-hover:translate-x-0 group-hover:opacity-100 ${
                isGoat ? "bg-goat-primary" : "bg-mutton-primary"
              }`}
            >
              <ArrowRight className="text-white w-2.5 h-2.5 max-[355px]:w-2 max-[355px]:h-2 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
