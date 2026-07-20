"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/hooks/useSettings";

export default function FooterBanner() {
  const { settings } = useSettings();
  const imageUrl = settings.home_footer_banner_image;
  const link = settings.home_footer_banner_link;

  if (!imageUrl) return null;

  const banner = (
    <div className="relative w-full aspect-video overflow-hidden rounded-2xl bg-brand-light-gray">
      <Image
        src={imageUrl}
        alt="Promotional banner"
        fill
        sizes="(max-width: 768px) 100vw, 1200px"
        className="object-cover"
      />
    </div>
  );

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {link ? (
          <Link href={link} className="block group">
            <div className="transition-transform duration-300 group-hover:scale-[1.01]">{banner}</div>
          </Link>
        ) : (
          banner
        )}
      </div>
    </section>
  );
}
