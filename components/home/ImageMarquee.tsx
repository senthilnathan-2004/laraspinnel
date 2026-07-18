"use client";

import React from "react";
import Image from "next/image";
import { useSettings } from "@/hooks/useSettings";

interface ImageMarqueeProps {
  images?: string[];
  bgColor?: string;
  direction?: "left" | "right";
}

export default function ImageMarquee({ 
  images: propImages, 
  bgColor = "bg-brand-light-gray",
  direction = "left"
}: ImageMarqueeProps) {
  const { settings } = useSettings();
  
  // If variety_marquee_images is stored as a JSON string, parse it.
  // Otherwise it might be a comma-separated string, or already an array.
  let settingsImages: string[] = [];
  try {
    if (settings.variety_marquee_images) {
      if (typeof settings.variety_marquee_images === 'string') {
        settingsImages = JSON.parse(settings.variety_marquee_images);
      } else if (Array.isArray(settings.variety_marquee_images)) {
        settingsImages = settings.variety_marquee_images;
      }
    }
  } catch (e) {
    settingsImages = [];
  }

  const images = propImages || settingsImages;

  if (!images || images.length === 0) return null;

  const animationName = direction === "right" ? "marquee-image-reverse" : "marquee-image";

  return (
    <div className={`relative overflow-hidden py-10 border-y border-brand-border/50 ${bgColor}`}>
      {/* Left Blur Gradient */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 md:w-16 lg:w-[250px] xl:w-[400px] bg-gradient-to-r from-brand-light-gray via-brand-light-gray/80 to-transparent z-10" />
      
      {/* Right Blur Gradient */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 md:w-16 lg:w-[250px] xl:w-[400px] bg-gradient-to-l from-brand-light-gray via-brand-light-gray/80 to-transparent z-10" />

      <style>{`
        @keyframes marquee-image {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-image {
          animation: marquee-image 35s linear infinite;
        }
        .animate-marquee-image-reverse {
          animation: marquee-image 35s linear infinite reverse;
        }
        .animate-marquee-image:hover, .animate-marquee-image-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className={`flex ${direction === "right" ? "animate-marquee-image-reverse" : "animate-marquee-image"} whitespace-nowrap w-max items-center`}>
        {[1, 2].map((setIndex) => (
          <div key={setIndex} className="flex items-center">
            {images.map((imgSrc, idx) => (
              <div 
                key={`${setIndex}-${idx}`} 
                className="group mx-4 md:mx-6 shrink-0 relative h-32 w-32 md:h-40 md:w-40 rounded-2xl overflow-hidden bg-brand-light-gray border-4 border-white shadow-sm ring-1 ring-brand-border/50"
              >
                <Image
                  src={imgSrc}
                  alt={`Goat Variety ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 128px, 160px"
                />
                {/* Light gray color overlay on the image */}
                <div className="absolute inset-0 bg-gray-500/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none z-10" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
