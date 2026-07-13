"use client";

import React from "react";
import { useSettings } from "@/hooks/useSettings";
import { MapPin } from "@phosphor-icons/react";
import { GiGoat } from "react-icons/gi";

export default function ServiceAreaBanner() {
  const { settings } = useSettings();

  const districtsStr = settings.mutton_districts || "Coimbatore, Tiruppur, Erode, Villupuram";

  return (
    <section className="md:hidden flex flex-col md:flex-row w-full overflow-hidden select-none border-y border-brand-border text-sm">
      {/* Left Goat Half */}
      <div className="flex-1 bg-goat-tint text-goat-text py-5 px-4 md:px-6 flex items-center justify-start md:justify-center gap-3 border-b md:border-b-0 md:border-r border-brand-border/40">
        <GiGoat size={28} className="text-goat-primary shrink-0" />
        <div>
          <span className="font-bold text-brand-black block text-xs uppercase tracking-wider">
            Live Goats Delivery
          </span>
          <span className="text-xs text-goat-text mt-0.5 block font-medium">
            Available across all 38 districts of Tamil Nadu
          </span>
        </div>
      </div>

      {/* Right Mutton Half */}
      <div className="flex-1 bg-mutton-tint text-mutton-text py-5 px-4 md:px-6 flex items-center justify-start md:justify-center gap-3">
        <MapPin size={24} weight="fill" className="text-mutton-primary shrink-0" />
        <div>
          <span className="font-bold text-brand-black block text-xs uppercase tracking-wider">
            Bulk Mutton Service Areas
          </span>
          <span className="text-xs text-mutton-text mt-0.5 block font-medium">
            Delivered fresh in: {districtsStr}
          </span>
        </div>
      </div>
    </section>
  );
}
