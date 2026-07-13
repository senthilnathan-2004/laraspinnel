"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tag } from "@phosphor-icons/react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ShopByCategory() {
  const { data: settings = {} } = useSWR("/api/settings", fetcher);

  return (
    <section className="py-24 bg-brand-light-gray/20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="font-display text-4xl md:text-5xl text-brand-black tracking-wide uppercase">
            {settings.home_shop_title || "What Are You Looking For?"}
          </h2>
          <p className="text-base font-medium text-brand-gray/80">
            {settings.home_shop_subtitle || "Choose your category to browse live farm goats or clean bulk mutton cuts."}
          </p>
        </div>

        {/* Two cards container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Card 1: Live Goats */}
          <Link
            href="/goats"
            className="group relative flex flex-col w-full min-h-[350px] md:min-h-[400px] rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700"
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full bg-brand-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.home_shop_image_1 || "/placeholder-goat.jpg"}
                alt="Live Goats"
                className="w-full h-full object-cover opacity-90 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 group-hover:opacity-100"
              />
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

            {/* Top Tag */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wide shadow-sm">
                <Tag size={14} weight="fill" className="text-green-300" />
                <span>Tamil Nadu Delivery</span>
              </div>
            </div>

            {/* Content Bottom */}
            <div className="relative z-10 mt-auto p-8 md:p-10 flex flex-col gap-4 transform md:translate-y-4 translate-y-0 group-hover:translate-y-0 transition-transform duration-700">
              <div className="space-y-3">
                <h3 className="font-display text-white text-4xl md:text-5xl leading-tight group-hover:text-white/90">
                  Live Goats
                </h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-sm">
                  Explore a wide breed variety, including Boer, Tellicherry, and native breeds. We deliver right to your location.
                </p>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-3 mt-4 overflow-hidden">
                <div className="flex items-center gap-3 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                  <span className="text-base">Browse Goats</span>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-goat-primary transition-all duration-500 transform md:-translate-x-6 md:opacity-0 translate-x-0 opacity-100 group-hover:translate-x-0 group-hover:opacity-100 shadow-md">
                    <ArrowRight size={18} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: Bulk Mutton */}
          <Link
            href="/mutton"
            className="group relative flex flex-col w-full min-h-[350px] md:min-h-[400px] rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700"
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full bg-brand-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.home_shop_image_2 || "/placeholder-mutton.jpg"}
                alt="Bulk Mutton"
                className="w-full h-full object-cover opacity-90 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 group-hover:opacity-100"
              />
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

            {/* Top Tag */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wide shadow-sm">
                <Tag size={14} weight="fill" className="text-red-300" />
                <span>Select Districts Only</span>
              </div>
            </div>

            {/* Content Bottom */}
            <div className="relative z-10 mt-auto p-8 md:p-10 flex flex-col gap-4 transform md:translate-y-4 translate-y-0 group-hover:translate-y-0 transition-transform duration-700">
              <div className="space-y-3">
                <h3 className="font-display text-white text-4xl md:text-5xl leading-tight group-hover:text-white/90">
                  Bulk Mutton
                </h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-sm">
                  Fresh, quality, custom mutton cuts packed cleanly. Available for delivery within Coimbatore, Tiruppur, and Erode.
                </p>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-3 mt-4 overflow-hidden">
                <div className="flex items-center gap-3 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                  <span className="text-base">Browse Mutton</span>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-mutton-primary transition-all duration-500 transform md:-translate-x-6 md:opacity-0 translate-x-0 opacity-100 group-hover:translate-x-0 group-hover:opacity-100 shadow-md">
                    <ArrowRight size={18} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
