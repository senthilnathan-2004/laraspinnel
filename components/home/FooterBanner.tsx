"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/hooks/useSettings";
import { getThemeAccentHex } from "@/lib/siteContent";
import { hexToRgba } from "@/lib/utils";

const CARD_CLASSES =
  "relative w-full overflow-hidden rounded-2xl bg-brand-light-gray ring-1 ring-goat-primary/15 shadow-[0_8px_30px_rgba(0,0,0,0.06)]";

function CardDecoration({ colorHex }: { colorHex: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 rounded-tl-2xl"
        style={{ borderColor: hexToRgba(colorHex, 0.9) }}
      />
      <div
        className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 rounded-br-2xl"
        style={{ borderColor: hexToRgba(colorHex, 0.9) }}
      />
      <div
        className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 rounded-tr-xl"
        style={{ borderColor: hexToRgba(colorHex, 0.6) }}
      />
      <div
        className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 rounded-bl-xl"
        style={{ borderColor: hexToRgba(colorHex, 0.6) }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border"
        style={{ borderColor: hexToRgba(colorHex, 0.3) }}
      />
      <span className="absolute top-5 right-6 text-xl drop-shadow-sm rotate-12" style={{ color: colorHex }}>
        ✦
      </span>
      <span className="absolute bottom-6 left-8 text-base drop-shadow-sm -rotate-6" style={{ color: hexToRgba(colorHex, 0.8) }}>
        ✦
      </span>
      <span className="absolute top-1/3 left-6 text-sm drop-shadow-sm rotate-45" style={{ color: hexToRgba(colorHex, 0.7) }}>
        ✦
      </span>
      <span className="absolute bottom-10 right-10 text-sm drop-shadow-sm -rotate-12" style={{ color: hexToRgba(colorHex, 0.7) }}>
        ✦
      </span>
    </div>
  );
}

export default function FooterBanner() {
  const { settings } = useSettings();
  const tabletImageUrl = settings.home_footer_banner_image;
  // Falls back to the tablet image (cropped) until a dedicated mobile image is uploaded.
  const mobileImageUrl = settings.home_footer_banner_mobile_image || tabletImageUrl;
  const link = settings.home_footer_banner_link;
  const decorationColor = getThemeAccentHex(settings.home_footer_banner_decoration_color || "brown");
  // Image-only opacity — the card decoration (corner accents/sparkles) always stays fully visible.
  const imageOpacity = Number(settings.home_footer_banner_image_opacity ?? 100) / 100;

  if (!tabletImageUrl && !mobileImageUrl) return null;

  const content = (
    <div className="transition-transform duration-300 group-hover:scale-[1.01] space-y-0">
      {/* Mobile — 3:4, separately uploaded image */}
      {mobileImageUrl && (
        <div className={`sm:hidden aspect-[3/4] ${CARD_CLASSES}`}>
          <Image
            src={mobileImageUrl}
            alt="Promotional banner"
            fill
            sizes="100vw"
            className="object-cover"
            style={{ opacity: imageOpacity }}
          />
          <CardDecoration colorHex={decorationColor} />
        </div>
      )}

      {/* Tablet — 4:3, separately uploaded image */}
      {tabletImageUrl && (
        <div className={`hidden sm:block aspect-[4/3] ${CARD_CLASSES}`}>
          <Image
            src={tabletImageUrl}
            alt="Promotional banner"
            fill
            sizes="1200px"
            className="object-cover"
            style={{ opacity: imageOpacity }}
          />
          <CardDecoration colorHex={decorationColor} />
        </div>
      )}
    </div>
  );

  return (
    <section className="relative overflow-hidden py-12 md:py-16 bg-white lg:hidden">
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {link ? (
          <Link href={link} className="block group">
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    </section>
  );
}
