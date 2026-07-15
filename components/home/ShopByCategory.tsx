import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Tag } from "@phosphor-icons/react/dist/ssr";

export default function ShopByCategory({ settings }: { settings: any }) {
  let displayDistricts = "Coimbatore, Tiruppur, and Erode";
  if (settings?.mutton_districts) {
    const districtsList = settings.mutton_districts.split(',').map((d: string) => d.trim()).filter(Boolean);
    if (districtsList.length <= 3) {
      if (districtsList.length === 1) displayDistricts = districtsList[0];
      else if (districtsList.length === 2) displayDistricts = `${districtsList[0]} and ${districtsList[1]}`;
      else displayDistricts = `${districtsList.slice(0, -1).join(', ')}, and ${districtsList[districtsList.length - 1]}`;
    } else {
      displayDistricts = `${districtsList.slice(0, 3).join(', ')}...`;
    }
  }

  return (
    <section className="py-24 bg-brand-light-gray/20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="font-display text-4xl md:text-5xl text-brand-black tracking-wide uppercase">
            {settings.home_shop_title || "What Are You Looking For?"}
          </h2>
          <p className="text-base font-medium text-brand-gray/80">
            {settings.home_shop_subtitle || "Choose your category to browse healthy pasture livestock or fresh wholesale protein."}
          </p>
        </div>

        {/* Two cards container */}
        <div className="grid grid-cols-2 gap-3 md:gap-8 lg:gap-12">
          {/* Card 1: Live Goats */}
          <Link
            href="/goats"
            className="group relative flex flex-col w-full min-h-[220px] md:min-h-[400px] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700"
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full bg-brand-black">
              <Image
                src={settings.home_shop_image_1 || "/placeholder-goat.jpg"}
                alt="Live Goats"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                quality={75}
                className="object-cover opacity-90 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 group-hover:opacity-100"
              />
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

            {/* Top Tag */}
            <div className="absolute top-3 left-3 md:top-8 md:left-8 z-10">
              <div className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[9px] md:text-xs font-semibold tracking-wide shadow-sm">
                <Tag weight="fill" className="text-green-300 w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                <span className="truncate max-w-[80px] md:max-w-none">Tamil Nadu Delivery</span>
              </div>
            </div>

            {/* Content Bottom */}
            <div className="relative z-10 mt-auto p-4 md:p-10 flex flex-col gap-2 md:gap-4 transform md:translate-y-4 translate-y-0 group-hover:translate-y-0 transition-transform duration-700">
              <div className="space-y-1 md:space-y-3">
                <h3 className="font-display text-white text-xl md:text-4xl lg:text-5xl leading-tight group-hover:text-white/90">
                  Live Goats
                </h3>
                <p className="text-white/80 text-[10px] md:text-base leading-tight md:leading-relaxed max-w-sm line-clamp-2 md:line-clamp-none">
                  Explore a wide breed variety, including Boer, Tellicherry, and native stock. We deliver right to your location.
                </p>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-1.5 md:gap-3 mt-1 md:mt-4 overflow-hidden">
                <div className="flex items-center gap-1.5 md:gap-3 text-xs md:text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                  <span className="text-xs md:text-base">Browse</span>
                  <div className="flex items-center justify-center w-6 h-6 md:w-10 md:h-10 rounded-full bg-goat-primary transition-all duration-500 transform md:-translate-x-6 md:opacity-0 translate-x-0 opacity-100 group-hover:translate-x-0 group-hover:opacity-100 shadow-md">
                    <ArrowRight className="text-white w-3 h-3 md:w-4.5 md:h-4.5" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: Bulk Mutton */}
          <Link
            href="/mutton"
            className="group relative flex flex-col w-full min-h-[220px] md:min-h-[400px] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700"
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full bg-brand-black">
              <Image
                src={settings.home_shop_image_2 || "/placeholder-mutton.jpg"}
                alt="Bulk Mutton"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                quality={75}
                className="object-cover opacity-90 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 group-hover:opacity-100"
              />
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

            {/* Top Tag */}
            <div className="absolute top-3 left-3 md:top-8 md:left-8 z-10">
              <div className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[9px] md:text-xs font-semibold tracking-wide shadow-sm">
                <Tag weight="fill" className="text-red-300 w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                <span className="truncate max-w-[80px] md:max-w-none">Select Districts</span>
              </div>
            </div>

            {/* Content Bottom */}
            <div className="relative z-10 mt-auto p-4 md:p-10 flex flex-col gap-2 md:gap-4 transform md:translate-y-4 translate-y-0 group-hover:translate-y-0 transition-transform duration-700">
              <div className="space-y-1 md:space-y-3">
                <h3 className="font-display text-white text-xl md:text-4xl lg:text-5xl leading-tight group-hover:text-white/90">
                  Bulk Mutton
                </h3>
                <p className="text-white/80 text-[10px] md:text-base leading-tight md:leading-relaxed max-w-sm line-clamp-2 md:line-clamp-none">
                  Fresh, prime, custom meat cuts packed cleanly. Available for delivery within {displayDistricts}.
                </p>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-1.5 md:gap-3 mt-1 md:mt-4 overflow-hidden">
                <div className="flex items-center gap-1.5 md:gap-3 text-xs md:text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                  <span className="text-xs md:text-base">Browse</span>
                  <div className="flex items-center justify-center w-6 h-6 md:w-10 md:h-10 rounded-full bg-mutton-primary transition-all duration-500 transform md:-translate-x-6 md:opacity-0 translate-x-0 opacity-100 group-hover:translate-x-0 group-hover:opacity-100 shadow-md">
                    <ArrowRight className="text-white w-3 h-3 md:w-4.5 md:h-4.5" />
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
