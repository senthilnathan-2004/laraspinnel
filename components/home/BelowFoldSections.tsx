"use client";

import dynamic from "next/dynamic";
import { useSettings } from "@/hooks/useSettings";
import { DEFAULT_MARQUEE_ITEMS, parseList } from "@/lib/siteContent";

const FeaturedProducts = dynamic(() => import("@/components/home/FeaturedProducts"), {
  ssr: false,
  loading: () => <div className="min-h-[300px] bg-brand-light-gray/40 animate-pulse" />,
});

const CategoryShowcase = dynamic(() => import("@/components/home/CategoryShowcase"), {
  ssr: false,
  loading: () => <div className="min-h-[300px] bg-white animate-pulse" />,
});

const HowItWorks = dynamic(() => import("@/components/home/HowItWorks"), {
  ssr: false,
  loading: () => <div className="min-h-[200px]" />,
});

const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
  ssr: false,
  loading: () => <div className="min-h-[300px]" />,
});

const PromoShowcase = dynamic(() => import("@/components/home/PromoShowcase"), {
  ssr: false,
  loading: () => <div className="min-h-[480px]" />,
});

const TextMarquee = dynamic(() => import("@/components/home/TextMarquee"), {
  ssr: false,
  loading: () => <div className="min-h-[48px]" />,
});

const FooterBanner = dynamic(() => import("@/components/home/FooterBanner"), {
  ssr: false,
  loading: () => null,
});

export default function BelowFoldSections() {
  const { settings } = useSettings();
  const marqueeItems = parseList<string>(settings.home_marquee, DEFAULT_MARQUEE_ITEMS);

  return (
    <>
      {/* Bangles category showcase */}
      <CategoryShowcase title="Bangles" categorySlug="bangles" />

      {/* Featured Products catalog */}
      <FeaturedProducts />

      {/* Why Choose Us (HowItWorks refactored) */}
      <HowItWorks />

      {/* Promo Showcase — rotating auto-scroll cards */}
      <PromoShowcase />

      {/* Customer Testimonials */}
      <Testimonials />

      {/* Gift Categories / Marketing Marquee */}
      <TextMarquee
        items={marqueeItems}
        bgColor="bg-[#111111]"
        textColor="text-white"
        dividerColor="text-white/20"
        borderColor="border-white/10"
      />

      {/* 16:9 promotional banner — last section before the footer */}
      <FooterBanner />
    </>
  );
}
