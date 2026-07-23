"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, Gift, Heart, Star } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  slug: string;
}

interface GalleryItem {
  src: string;
  alt: string;
  name: string;
  slug: string;
}

// Curated handcrafted-crochet photography from the Lara's Pinnal catalog
const FALLBACK_ITEMS: GalleryItem[] = [
  {
    src: "https://images.unsplash.com/photo-1677378701669-c5201fad9ce3?w=480&q=75&auto=format&fit=crop",
    alt: "Pink Tulip Bouquet — custom handmade by Lara's Pinnal",
    name: "Pink Tulip Bouquet",
    slug: "pink-tulip-bloom-bouquet",
  },
  {
    src: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=480&q=75&auto=format&fit=crop",
    alt: "Handmade Gift Hamper — custom handmade by Lara's Pinnal",
    name: "Handmade Gift Hamper",
    slug: "ultimate-love-gift-hamper",
  },
  {
    src: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=480&q=75&auto=format&fit=crop",
    alt: "Cute Bunny Arrangement — custom handmade by Lara's Pinnal",
    name: "Cute Bunny Arrangement",
    slug: "pink-bunny-crochet-plush",
  },
  {
    src: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=480&q=75&auto=format&fit=crop",
    alt: "Lavender Purple Bouquet — custom handmade by Lara's Pinnal",
    name: "Lavender Purple Bouquet",
    slug: "lavender-crochet-bouquet",
  },
  {
    src: "https://images.unsplash.com/photo-1559251606-c623743a6d76?w=480&q=75&auto=format&fit=crop",
    alt: "Cute Teddy Bear Amigurumi — custom handmade by Lara's Pinnal",
    name: "Cute Teddy Bear Amigurumi",
    slug: "cute-teddy-bear-amigurumi",
  },
  {
    src: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=480&q=75&auto=format&fit=crop",
    alt: "Handmade Gift Basket — custom handmade by Lara's Pinnal",
    name: "Handmade Gift Basket",
    slug: "baby-shower-warm-hamper",
  },
  {
    src: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=480&q=75&auto=format&fit=crop",
    alt: "Couple Portrait Crochet Frame — custom handmade by Lara's Pinnal",
    name: "Couple Portrait Crochet Frame",
    slug: "couple-portrait-crochet-frame",
  },
  {
    src: "https://images.unsplash.com/photo-1576243101635-a5c66024f53c?w=480&q=75&auto=format&fit=crop",
    alt: "Bangle Set Accessories — custom handmade by Lara's Pinnal",
    name: "Bangle Set Accessories",
    slug: "crochet-hair-bow-clip-set",
  },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Leaf icons next to heading
const LeftLeafSVG = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 text-gold-primary -rotate-45"
    aria-hidden="true"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2Z" />
    <path d="M9 22v-4h4" />
  </svg>
);

const RightLeafSVG = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 text-gold-primary scale-x-[-1] -rotate-45"
    aria-hidden="true"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2Z" />
    <path d="M9 22v-4h4" />
  </svg>
);

// Flower stem icon for Choose Your Colors
const FlowerSVG = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 text-gold-primary"
    aria-hidden="true"
  >
    <path d="M12 2v20M8 8a4 4 0 0 1 8 0M6 12a6 6 0 0 1 12 0M10 18a2 2 0 0 1 4 0" />
  </svg>
);

// Hand holding heart icon for Handmade to Order
const HandHeartSVG = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 text-gold-primary"
    aria-hidden="true"
  >
    <path d="M18 11h-5a1 1 0 0 1-1-1V5a3 3 0 0 0-3-3 1 1 0 0 0-1 1v10a2 2 0 0 1-2 2H5" />
    <path d="M12 18v2a2 2 0 0 0 2 2h4a4 4 0 0 0 4-4v-1.5a1.5 1.5 0 0 0-1.5-1.5H18Z" />
    <path d="M12 14c0-1-1-2-2.5-2S7 13 7 14c0 1.5 1.5 2.5 3 3.5 1.5-1 3-2 3-3.5Z" />
  </svg>
);

interface MobileCustomOrderProps {
  customOrderLink?: string;
  exploreLink?: string;
  eyebrow?: string;
  headingLines?: string[];
  description?: string;
  points?: string[];
  primaryText?: string;
  secondaryText?: string;
}

export default function MobileCustomOrder({
  customOrderLink = "/custom-order",
  exploreLink = "/shop",
  eyebrow = "CUSTOM MADE · JUST FOR YOU",
  headingLines = ["Made by Hand.", "Made for You."],
  description = "From forever bouquets to meaningful gifts, we create something uniquely yours.",
  points = ["Choose Your Colors", "Personalized Details", "Handmade to Order"],
  primaryText = "Start Your Custom Order",
  secondaryText = "View Custom Creations",
}: MobileCustomOrderProps) {
  // Fetch live products
  const { data: products = [] } = useSWR<Product[]>("/api/products?sort=latest", fetcher, {
    revalidateOnFocus: false,
  });

  const galleryItems = useMemo(() => {
    const catalog = (Array.isArray(products) ? products : [])
      .filter((p) => p?.images?.[0])
      .slice(0, 8)
      .map((p) => ({
        src: p.images[0],
        alt: `${p.name} — custom handmade by Lara's Pinnal`,
        name: p.name,
        slug: p.slug,
      }));

    if (catalog.length >= 8) return catalog;
    const needed = 8 - catalog.length;
    return [...catalog, ...FALLBACK_ITEMS.slice(0, needed)];
  }, [products]);

  // Distribute items across 4 slides: Slide = { top, bottom }
  const slides = useMemo(() => {
    return [
      { top: galleryItems[0], bottom: galleryItems[4] },
      { top: galleryItems[1], bottom: galleryItems[5] },
      { top: galleryItems[2], bottom: galleryItems[6] },
      { top: galleryItems[3], bottom: galleryItems[7] },
    ];
  }, [galleryItems]);

  // Embla setup
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;

    const updateSnaps = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
    };
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("init", updateSnaps);
    emblaApi.on("reInit", updateSnaps);
    emblaApi.on("select", onSelect);

    // Run updates asynchronously in the next tick to prevent synchronous setState cascades
    const timer = setTimeout(() => {
      updateSnaps();
      onSelect();
    }, 0);

    return () => {
      emblaApi.off("init", updateSnaps);
      emblaApi.off("reInit", updateSnaps);
      emblaApi.off("select", onSelect);
      clearTimeout(timer);
    };
  }, [emblaApi]);

  const onDotClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const handleViewCreations = useCallback((e: React.MouseEvent) => {
    const galleryEl = document.getElementById("custom-creations-gallery");
    if (galleryEl) {
      e.preventDefault();
      galleryEl.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="mx-4 my-6 rounded-4xl overflow-hidden bg-linear-to-b from-cream-bg via-[#FAF1E6] to-rose-tint relative shadow-[0_4px_30px_rgba(43,36,32,0.04)] border border-brand-border/45 flex flex-col pt-10">
      
      {/* Botanical Decorative Overlays */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute top-0 right-0 w-36 h-36 text-rose-primary/15 pointer-events-none z-0"
        aria-hidden="true"
      >
        <path d="M90,10 C70,30 50,45 20,60" />
        <path d="M75,22 C68,20 62,24 64,30 C66,36 72,34 75,22 Z" fill="currentColor" fillOpacity="0.08" />
        <path d="M60,33 C53,32 48,37 51,42 C54,47 59,44 60,33 Z" fill="currentColor" fillOpacity="0.08" />
        <path d="M44,43 C38,44 35,50 39,54 C43,58 46,53 44,43 Z" fill="currentColor" fillOpacity="0.08" />
        <path d="M80,15 C82,23 78,28 72,26 C66,24 70,17 80,15 Z" fill="currentColor" fillOpacity="0.08" />
        <path d="M63,25 C67,31 63,38 57,37 C51,36 53,29 63,25 Z" fill="currentColor" fillOpacity="0.08" />
      </svg>

      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute top-[32%] right-0 w-28 h-32 text-gold-primary/12 pointer-events-none z-0"
        aria-hidden="true"
      >
        <path d="M95,50 C80,52 65,58 40,75" />
        <path d="M80,51 C75,47 69,50 70,56 C71,62 77,61 80,51 Z" fill="currentColor" fillOpacity="0.06" />
        <path d="M65,56 C60,53 54,57 56,63 C58,69 63,67 65,56 Z" fill="currentColor" fillOpacity="0.06" />
        <path d="M50,64 C46,61 40,65 42,70 C44,75 48,73 50,64 Z" fill="currentColor" fillOpacity="0.06" />
      </svg>

      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute bottom-[28%] right-0 w-32 h-36 text-rose-primary/15 pointer-events-none z-0"
        aria-hidden="true"
      >
        <path d="M95,85 C80,80 65,70 45,45" />
        <path d="M80,78 C76,73 70,75 70,81 C70,87 76,87 80,78 Z" fill="currentColor" fillOpacity="0.08" />
        <path d="M68,67 C63,63 58,66 59,71 C60,76 65,75 68,67 Z" fill="currentColor" fillOpacity="0.08" />
        <path d="M56,56 C52,52 47,56 49,60 C51,64 54,62 56,56 Z" fill="currentColor" fillOpacity="0.08" />
      </svg>

      {/* Hero Content Stack */}
      <div className="relative z-10 px-7 sm:px-8 space-y-6">
        
        {/* Eyebrow Label */}
        <div className="flex items-center gap-2.5">
          <span className="h-[1.5px] w-6 bg-gold-primary" aria-hidden="true" />
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-gold-text">
            {eyebrow}
          </p>
        </div>

        {/* Heading */}
        <h2 className="font-display text-4xl sm:text-5xl leading-[1.1] tracking-wide text-brand-black font-extrabold">
          {headingLines.map((line, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </h2>

        {/* Decorative Divider */}
        <div className="flex items-center gap-3 py-1">
          <span className="h-px w-12 bg-brand-border" aria-hidden="true" />
          <Heart size={11} className="text-gold-primary" strokeWidth={2} />
          <span className="h-px w-12 bg-brand-border" aria-hidden="true" />
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-brand-gray/90 leading-[1.6] max-w-72.5 sm:max-w-xs font-medium">
          {description}
        </p>

        {/* Three Benefit Icons Row — icons assigned by position */}
        <div className="grid grid-cols-3 gap-2 pt-4">
          {points.slice(0, 3).map((label, i) => (
            <div key={label} className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#FCF5ED] border border-brand-border/40 flex items-center justify-center shadow-sm">
                {i === 0 ? (
                  <FlowerSVG />
                ) : i === 1 ? (
                  <Gift size={20} className="text-gold-primary" strokeWidth={1.8} />
                ) : (
                  <HandHeartSVG />
                )}
              </div>
              <span className="text-[9px] xs:text-[10px] font-extrabold uppercase tracking-wider text-brand-black leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <div className="pt-4">
          <Link
            href={customOrderLink}
            className="group inline-flex items-center justify-center relative w-full h-13.5 rounded-full bg-brand-black text-white font-bold text-[13px] tracking-wide shadow-[0_4px_16px_rgba(43,36,32,0.15)] active:scale-[0.98] active:shadow-[0_2px_8px_rgba(43,36,32,0.1)] transition-all duration-300"
          >
            {primaryText}
            <ArrowRight
              size={15}
              className="absolute right-6 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Secondary CTA */}
        <div className="flex justify-center pb-2">
          <Link
            href={exploreLink}
            onClick={handleViewCreations}
            className="text-xs font-bold text-brand-black uppercase tracking-wider underline decoration-gold-primary decoration-[1.5px] underline-offset-8 py-2 active:text-gold-hover transition-colors"
          >
            {secondaryText}
          </Link>
        </div>

      </div>

      {/* Gallery Transition Spacer */}
      <div className="h-10" />

      {/* Custom Creations Subsection */}
      <div
        id="custom-creations-gallery"
        className="relative z-10 pt-8 pb-10 border-t border-brand-border/30 flex flex-col items-center rounded-t-[28px]"
      >
        
        {/* Subsection Header */}
        <div className="flex items-center gap-3">
          <LeftLeafSVG />
          <h3 className="font-display text-2xl text-brand-black font-extrabold tracking-wide">
            Custom Creations
          </h3>
          <RightLeafSVG />
        </div>

        {/* Subsection Subtitle */}
        <p className="text-[11px] sm:text-xs text-brand-gray font-semibold tracking-wider uppercase mt-2">
          Endless ideas. Made just for you.
        </p>

        {/* Product Carousel Grid Container */}
        <div className="w-full mt-6 overflow-hidden" ref={emblaRef}>
          
          <div className="flex">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="flex-[0_0_78%] min-w-0 pl-4 flex flex-col gap-5 first:pl-6 last:pr-6"
              >
                
                {/* Row 1 Card (Top) */}
                <div className="w-[88%] self-start">
                  <Link
                    href={`/shop/${slide.top.slug}`}
                    className="block aspect-4/5 w-full relative overflow-hidden rounded-[20px] bg-[#FDFBF7] border border-white/90 shadow-[0_4px_15px_rgba(43,36,32,0.03)] group"
                  >
                    <Image
                      src={slide.top.src}
                      alt={slide.top.alt}
                      fill
                      sizes="60vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      priority={index === 0}
                    />
                  </Link>
                </div>

                {/* Row 2 Card (Bottom, Staggered Right) */}
                <div className="w-[88%] self-end">
                  <Link
                    href={`/shop/${slide.bottom.slug}`}
                    className="block aspect-4/5 w-full relative overflow-hidden rounded-[20px] bg-[#FDFBF7] border border-white/90 shadow-[0_4px_15px_rgba(43,36,32,0.03)] group"
                  >
                    <Image
                      src={slide.bottom.src}
                      alt={slide.bottom.alt}
                      fill
                      sizes="60vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => onDotClick(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                index === selectedIndex ? "bg-brand-black" : "bg-brand-border"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>

      {/* Bottom Trust Bar */}
      <div className="relative z-10 mt-auto border-t border-brand-border/45 bg-[#FFFDF9] py-5">
        <div className="grid grid-cols-3 divide-x divide-brand-border/45 text-center">
          
          <div className="flex flex-col items-center justify-center gap-1.5 px-1.5">
            <BadgeCheck size={18} className="text-gold-primary" strokeWidth={1.8} />
            <span className="text-[9px] xs:text-[10px] font-extrabold uppercase tracking-wide text-brand-black">
              100% Handmade
            </span>
          </div>

          <div className="flex flex-col items-center justify-center gap-1.5 px-1.5">
            <Heart size={18} className="text-gold-primary" strokeWidth={1.8} />
            <span className="text-[9px] xs:text-[10px] font-extrabold uppercase tracking-wide text-brand-black">
              Made with Love
            </span>
          </div>

          <div className="flex flex-col items-center justify-center gap-1.5 px-1.5">
            <Star size={18} className="text-gold-primary" strokeWidth={1.8} />
            <span className="text-[9px] xs:text-[10px] font-extrabold uppercase tracking-wide text-brand-black">
              Unique & Personal
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
