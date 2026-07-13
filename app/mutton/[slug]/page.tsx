"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronLeft, ChevronDown, CheckCircle, Phone, ShoppingBag, Loader2, MapPin, Info, ArrowLeft } from "lucide-react";
import { Flame } from "@phosphor-icons/react";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface MuttonPack {
  _id: string;
  name: string;
  price: string;
  description: string;
  weightOptions?: string[];
  districtsAvailable?: string[];
  images: string[];
  slug: string;
  isFeatured: boolean;
}

export default function MuttonDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: pack, error, isLoading } = useSWR<MuttonPack>(
    slug ? `/api/mutton/${slug}` : null,
    fetcher
  );

  const [activeImage, setActiveImage] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [accordionOpen, setAccordionOpen] = useState<{ [key: string]: boolean }>({
    hygiene: false,
    delivery: false,
    payment: false,
  });

  // Sync active image and default weight option when data loads
  useEffect(() => {
    if (pack?.images?.[0]) {
      setActiveImage(pack.images[0]);
    }
    if (pack?.weightOptions?.[0]) {
      setSelectedWeight(pack.weightOptions[0]);
    }
  }, [pack]);

  const toggleAccordion = (key: string) => {
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24">
          <Loader2 size={36} className="animate-spin text-mutton-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-4 md:px-6 py-24 text-center space-y-6">
          <h1 className="font-display text-3xl uppercase text-brand-black">Mutton Pack Not Found</h1>
          <p className="text-brand-gray text-sm">
            The mutton package you are looking for does not exist or has been deactivated.
          </p>
          <Link
            href="/mutton"
            className="inline-flex items-center gap-1.5 bg-brand-black text-white hover:bg-mutton-primary px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Catalog</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-12 w-full space-y-8 pb-32 md:pb-16">
        {/* Back Link */}
        <Link
          href="/mutton"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-gray hover:text-brand-black transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Back to Mutton Packs</span>
        </Link>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            {/* Primary Display */}
            <div className="relative aspect-square border border-brand-border rounded-2xl overflow-hidden bg-brand-light-gray">
              {activeImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeImage}
                  alt={pack.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {/* Thumbnails Row */}
            {pack.images && pack.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 select-none">
                {pack.images.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(url)}
                    className={`relative w-20 h-20 border rounded-xl overflow-hidden shrink-0 cursor-pointer transition-all ${
                      activeImage === url
                        ? "border-mutton-primary ring-2 ring-mutton-tint"
                        : "border-brand-border hover:border-brand-gray"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`${pack.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information details */}
          <div className="space-y-6">
            <div className="space-y-3">
              {/* Floating mutton badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-mutton-tint text-mutton-text border border-mutton-primary/10 text-xs font-semibold px-3 py-1 rounded-lg">
                  <Flame size={12} weight="fill" className="text-mutton-primary" />
                  <span>Fresh Halal Meat</span>
                </span>
                {pack.isFeatured && (
                  <span className="bg-brand-black text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                    Popular Demand
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-display text-4xl sm:text-5xl text-brand-black uppercase leading-tight tracking-wide">
                {pack.name}
              </h1>

              {/* Pricing Rate */}
              <div className="space-y-1">
                <span className="text-xs text-brand-gray font-semibold uppercase tracking-wider block">Price / Rate</span>
                <span className="text-3xl font-extrabold text-mutton-primary block tracking-tight">
                  {pack.price}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-brand-gray leading-relaxed">{pack.description}</p>

            {/* Desktop CTAs (Hidden on mobile where sticky bar shows) */}
            <div className="hidden md:flex items-center gap-4 pt-2">
              <Link
                href={`/book?type=mutton&id=${pack._id}&weight=${selectedWeight}`}
                className="flex-[2] bg-mutton-primary hover:bg-mutton-hover text-white font-semibold text-sm h-12 rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all shadow-sm shadow-mutton-primary/20"
              >
                <ShoppingBag size={18} />
                <span>Book Mutton Pack</span>
              </Link>
              <a
                href="tel:+919876543210"
                className="flex-1 bg-brand-black hover:bg-neutral-800 text-white font-semibold text-sm h-12 rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <Phone size={18} />
                <span>Call Now</span>
              </a>
            </div>

            {/* Weight Option selector */}
            {pack.weightOptions && pack.weightOptions.length > 0 && (
              <div className="space-y-1.5 max-w-xs">
                <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">
                  Select Weight Option:
                </label>
                <div className="flex flex-wrap gap-2 text-sm select-none">
                  {pack.weightOptions.map((opt) => {
                    const isSelected = selectedWeight === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedWeight(opt)}
                        className={`px-4 py-2 border rounded-xl font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-mutton-primary text-white border-transparent shadow-sm"
                            : "bg-white text-brand-black border-brand-border hover:bg-brand-light-gray"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Delivery Districts availability Box */}
            <div className="bg-mutton-tint/40 border border-mutton-primary/10 rounded-2xl p-3 md:p-5 space-y-3 select-none">
              <div className="flex gap-2.5 items-start">
                <MapPin size={18} className="text-mutton-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-brand-black uppercase tracking-wider">Available Districts</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {pack.districtsAvailable && pack.districtsAvailable.length > 0 ? (
                      pack.districtsAvailable.map((dist, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-brand-border px-2.5 py-1 rounded-lg text-xs font-semibold text-brand-black shadow-3xs"
                        >
                          {dist}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-mutton-text font-medium">Coimbatore, Tiruppur, Erode, Villupuram</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center text-[10px] text-brand-gray bg-white border border-brand-border px-2.5 py-1.5 rounded-xl shadow-3xs w-fit">
                <Info size={12} className="text-neutral-400 shrink-0" />
                <span>Next-day doorstep delivery for morning slaughter fresh bookings.</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-3 pt-4 border-t border-brand-border">
              {/* Item 1: Hygiene Packaging */}
              <div className="border border-brand-border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion("hygiene")}
                  className="w-full flex items-center justify-between p-3 md:p-4 text-left font-semibold text-sm text-brand-black hover:bg-brand-light-gray transition-colors"
                >
                  <span>Slaughter & Hygiene Standards</span>
                  <ChevronDown
                    size={16}
                    className={`text-brand-gray transition-transform ${
                      accordionOpen.hygiene ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {accordionOpen.hygiene && (
                  <div className="p-3 md:p-4 border-t border-brand-border text-xs text-brand-gray leading-relaxed bg-brand-light-gray/20">
                    All meat is 100% Halal cut, slaughtered early morning in municipal-certified clean environments. We perform meticulous cleaning, portioning, and pack them instantly in vacuum-sealed food-grade packs with ice-chill packs.
                  </div>
                )}
              </div>

              {/* Item 2: Delivery */}
              <div className="border border-brand-border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion("delivery")}
                  className="w-full flex items-center justify-between p-3 md:p-4 text-left font-semibold text-sm text-brand-black hover:bg-brand-light-gray transition-colors"
                >
                  <span>Chilled Transit Delivery</span>
                  <ChevronDown
                    size={16}
                    className={`text-brand-gray transition-transform ${
                      accordionOpen.delivery ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {accordionOpen.delivery && (
                  <div className="p-3 md:p-4 border-t border-brand-border text-xs text-brand-gray leading-relaxed bg-brand-light-gray/20">
                    We deliver mutton fresh and chilled using temperature-controlled insulated cold boxes. Slaughters happen at 4:30 AM, with delivery trucks leaving for Coimbatore, Tiruppur, and Erode by 6:00 AM. Doorstep arrival between 7:00 AM - 10:00 AM.
                  </div>
                )}
              </div>

              {/* Item 3: Payment */}
              <div className="border border-brand-border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion("payment")}
                  className="w-full flex items-center justify-between p-3 md:p-4 text-left font-semibold text-sm text-brand-black hover:bg-brand-light-gray transition-colors"
                >
                  <span>Order Processing & Verification</span>
                  <ChevronDown
                    size={16}
                    className={`text-brand-gray transition-transform ${
                      accordionOpen.payment ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {accordionOpen.payment && (
                  <div className="p-3 md:p-4 border-t border-brand-border text-xs text-brand-gray leading-relaxed bg-brand-light-gray/20">
                    Submit your booking reservation online with zero advanced charge. Our farm coordinator calls you to verify portion sizing, specialized cutting preference (chops, curry cut, fat selection), and confirm delivery slot. Payment on delivery.
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
          href="tel:+919876543210"
          className="flex-1 bg-brand-black hover:bg-neutral-800 text-white font-semibold text-sm h-12 rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <Phone size={16} />
          <span>Call Now</span>
        </a>

        {/* Book Now button */}
        <Link
          href={`/book?type=mutton&id=${pack._id}&weight=${selectedWeight}`}
          className="flex-[2] bg-mutton-primary hover:bg-mutton-hover text-white font-semibold text-sm h-12 rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <ShoppingBag size={16} />
          <span>Book Mutton Pack</span>
        </Link>
      </div>

      <Footer />
    </div>
  );
}
