"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronLeft, ChevronDown, CheckCircle, Phone, ShoppingBag, Loader2, ArrowLeft } from "lucide-react";
import { Leaf } from "@phosphor-icons/react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { SITE_URL } from "@/lib/siteUrl";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface GoatVariety {
  _id: string;
  name: string;
  breed: string;
  description: string;
  priceEstimate: string;
  weightRange: string;
  ageRange: string;
  tags?: string[];
  images: string[];
  slug: string;
  isFeatured: boolean;
}

interface GoatClientPageProps {
  initialGoat: GoatVariety;
}

export default function GoatClientPage({ initialGoat }: GoatClientPageProps) {
  const router = useRouter();
  
  // Removed useSWR, using initialGoat directly
  const goat = initialGoat;

  const [activeImage, setActiveImage] = useState("");
  const [accordionOpen, setAccordionOpen] = useState<{ [key: string]: boolean }>({
    breeding: false,
    delivery: false,
    payment: false,
  });

  // Sync active image when data loads
  useEffect(() => {
    if (goat?.images?.[0]) {
      setActiveImage(goat.images[0]);
    }
  }, [goat]);

  const toggleAccordion = (key: string) => {
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      {/* Product schema is emitted server-side in layout.tsx (crawler-visible). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${SITE_URL}/`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Live Goats",
                "item": `${SITE_URL}/goats`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": goat.name,
                "item": typeof window !== "undefined" ? window.location.href : ""
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What are the breeding and care guidelines for this goat?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our goats are raised in optimal sanitary pasture conditions. They feed on natural green fodder, dry grass, and nutrient mixes. We recommend setting up clean, ventilated sheds and feeding regular vaccinations to prevent seasonal sickness."
                }
              },
              {
                "@type": "Question",
                "name": "How is safe delivery of live goats arranged?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We arrange specialized animal transport vehicles with regular stops to avoid stress during transit. Delivery coordinates across all 38 districts of Tamil Nadu. Transit charges apply based on distance from Villupuram farm center."
                }
              },
              {
                "@type": "Question",
                "name": "What is the booking and payment process?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Book online with zero immediate payment. Our farm coordinator calls you to verify weights and delivery schedules. A partial advance payment is requested once shipping dates are verified, with balance on delivery."
                }
              }
            ]
          })
        }}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-7 md:py-12 w-full space-y-8 pb-32 md:pb-16">

        {/* Back Link */}
        <Link
          href="/goats"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-gray hover:text-brand-black transition-colors -ml-1.5"
        >
          <ChevronLeft size={16} />
          <span>Back to Goats Catalog</span>
        </Link>
        {/* Visible breadcrumb (matches BreadcrumbList JSON-LD above) */}
        <nav aria-label="Breadcrumb" className="text-xs text-brand-gray w-full overflow-hidden">
          <ol className="flex flex-nowrap items-center gap-1.5 whitespace-nowrap">
            <li><Link href="/" className="hover:text-brand-black transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/goats" className="hover:text-brand-black transition-colors">Goats</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-brand-black font-medium truncate max-w-[10rem] sm:max-w-[16rem]">{goat.name}</li>
          </ol>
        </nav>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            {/* Primary Display */}
            <div className="relative aspect-square border border-brand-border rounded-2xl overflow-hidden bg-brand-light-gray">
              {activeImage && (
                <Image
                  src={activeImage}
                  alt={goat.name}
                  fill
                  className="object-cover"
                  sizes="(max-w-780px) 100vw, 50vw"
                  priority
                />
              )}
            </div>
            {/* Thumbnails Row */}
            {goat.images && goat.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 select-none">
                {goat.images.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(url)}
                    className={`relative w-20 h-20 border rounded-xl overflow-hidden shrink-0 cursor-pointer transition-all ${
                      activeImage === url
                        ? "border-goat-primary ring-2 ring-goat-tint"
                        : "border-brand-border hover:border-brand-gray"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${goat.name} view ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information details */}
          <div className="space-y-6">
            <div className="space-y-3">
              {/* Floating breed badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-goat-tint text-goat-text border border-goat-primary/10 text-xs font-semibold px-3 py-1 rounded-lg">
                  <Leaf size={12} weight="fill" className="text-goat-primary" />
                  <span>Breed: {goat.breed}</span>
                </span>
                {goat.isFeatured && (
                  <span className="bg-brand-black text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                    Highly Requested
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl sm:text-5xl text-brand-black uppercase leading-tight tracking-wide">
                {goat.name}
              </h1>

              {/* Pricing Estimate */}
              <div className="space-y-1">
                <span className="text-xs text-brand-gray font-semibold uppercase tracking-wider block">Estimated Price</span>
                <span className="text-2xl md:text-3xl font-extrabold text-goat-primary block tracking-tight">
                  {goat.priceEstimate}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-brand-gray leading-relaxed text-justify">{goat.description}</p>

            {/* Desktop CTAs (Hidden on mobile where sticky bar shows) */}
            <div className="hidden md:flex items-center gap-4 pt-2">
              <Link
                href={`/book?type=goat&id=${goat._id}`}
                className="flex-2 bg-goat-primary hover:bg-goat-hover text-white font-semibold text-sm h-12 rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all shadow-sm shadow-goat-primary/20"
              >
                <ShoppingBag size={18} />
                <span>Book This Goat</span>
              </Link>
              <a
                href="tel:+919442379832"
                className="flex-1 bg-brand-black hover:bg-neutral-800 text-white font-semibold text-sm h-12 rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <Phone size={18} />
                <span>Call Now</span>
              </a>
            </div>

            {/* Verification highlights list */}
            <div className="p-3 md:p-4 bg-brand-light-gray rounded-2xl border border-brand-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-black">
                <CheckCircle size={15} className="text-goat-primary shrink-0" />
                <span>100% vaccinated & health checked</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-black">
                <CheckCircle size={15} className="text-goat-primary shrink-0" />
                <span>Free consultation & care guidelines included</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-black">
                <CheckCircle size={15} className="text-goat-primary shrink-0" />
                <span>Safely shipped in specialized livestock transit</span>
              </div>
            </div>

            {/* Specifications Specs Table */}
            <div className="space-y-3">
              <h3 className="font-semibold text-brand-black text-sm uppercase tracking-wider">Breed Specifications</h3>
              <div className="border border-brand-border rounded-xl overflow-hidden text-sm">
                <div className="grid grid-cols-2 border-b border-brand-border">
                  <div className="bg-brand-light-gray px-4 py-3 text-brand-gray font-semibold">Weight Class</div>
                  <div className="px-4 py-3 text-brand-black font-semibold">{goat.weightRange}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="bg-brand-light-gray px-4 py-3 text-brand-gray font-semibold">Age Bracket</div>
                  <div className="px-4 py-3 text-brand-black font-semibold">{goat.ageRange}</div>
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-3 pt-4 border-t border-brand-border">
              {/* Item 1: Breeding Guidelines */}
              <div className="border border-brand-border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion("breeding")}
                  className="w-full flex items-center justify-between p-3 md:p-4 text-left font-semibold text-sm text-brand-black hover:bg-brand-light-gray transition-colors"
                >
                  <span>Breeding & Care Guidelines</span>
                  <ChevronDown
                    size={16}
                    className={`text-brand-gray transition-transform ${
                      accordionOpen.breeding ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {accordionOpen.breeding && (
                  <div className="p-3 md:p-4 border-t border-brand-border text-xs text-brand-gray leading-relaxed bg-brand-light-gray/20 text-justify">
                    Our goats are raised in optimal sanitary pasture conditions. They feed on natural green fodder, dry grass, and nutrient mixes. We recommend setting up clean, ventilated sheds and feeding regular vaccinations to prevent seasonal sickness.
                  </div>
                )}
              </div>

              {/* Item 2: Delivery */}
              <div className="border border-brand-border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion("delivery")}
                  className="w-full flex items-center justify-between p-3 md:p-4 text-left font-semibold text-sm text-brand-black hover:bg-brand-light-gray transition-colors"
                >
                  <span>Safe Delivery Information</span>
                  <ChevronDown
                    size={16}
                    className={`text-brand-gray transition-transform ${
                      accordionOpen.delivery ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {accordionOpen.delivery && (
                  <div className="p-3 md:p-4 border-t border-brand-border text-xs text-brand-gray leading-relaxed bg-brand-light-gray/20 text-justify">
                    We arrange specialized animal transport vehicles with regular stops to avoid stress during transit. Delivery coordinates across all 38 districts of Tamil Nadu. Transit charges apply based on distance from Villupuram farm center.
                  </div>
                )}
              </div>

              {/* Item 3: Payment */}
              <div className="border border-brand-border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion("payment")}
                  className="w-full flex items-center justify-between p-3 md:p-4 text-left font-semibold text-sm text-brand-black hover:bg-brand-light-gray transition-colors"
                >
                  <span>Booking & Payment Process</span>
                  <ChevronDown
                    size={16}
                    className={`text-brand-gray transition-transform ${
                      accordionOpen.payment ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {accordionOpen.payment && (
                  <div className="p-3 md:p-4 border-t border-brand-border text-xs text-brand-gray leading-relaxed bg-brand-light-gray/20 text-justify">
                    Book online with zero immediate payment. Our farm coordinator calls you to verify weights and delivery schedules. A partial advance payment is requested once shipping dates are verified, with balance on delivery.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom CTA bar (Mobile Only / Floating) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-border p-3 md:p-4 flex gap-4 md:hidden z-40 shadow-lg">
        {/* Call Now button */}
        <a
          href="tel:+919442379832"
          className="flex-1 bg-brand-black hover:bg-neutral-800 text-white font-semibold text-sm h-12 rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <Phone size={16} />
          <span>Call Now</span>
        </a>

        {/* Book Now button */}
        <Link
          href={`/book?type=goat&id=${goat._id}`}
          className="flex-2 bg-goat-primary hover:bg-goat-hover text-white font-semibold text-sm h-12 rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <ShoppingBag size={16} />
          <span>Book This Goat</span>
        </Link>
      </div>

      <Footer />
    </div>
  );
}
