"use client";

import dynamic from "next/dynamic";

const FeaturedProducts = dynamic(() => import("@/components/home/FeaturedProducts"), {
  ssr: false,
  loading: () => <div className="min-h-[300px] bg-brand-light-gray/40 animate-pulse" />,
});

const HowItWorks = dynamic(() => import("@/components/home/HowItWorks"), {
  ssr: false,
  loading: () => <div className="min-h-[200px]" />,
});

const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
  ssr: false,
  loading: () => <div className="min-h-[300px]" />,
});

const FinalCTA = dynamic(() => import("@/components/home/FinalCTA"), {
  ssr: false,
  loading: () => <div className="min-h-[150px]" />,
});

const TextMarquee = dynamic(() => import("@/components/home/TextMarquee"), {
  ssr: false,
  loading: () => <div className="min-h-[48px]" />,
});

export default function BelowFoldSections() {
  return (
    <>
      {/* Featured Products catalog */}
      <FeaturedProducts />

      {/* Why Choose Us (HowItWorks refactored) */}
      <HowItWorks />

      {/* Customer Testimonials */}
      <Testimonials />

      {/* Gift Categories / Marketing Marquee */}
      <TextMarquee
        items={["Crochet Bouquets", "Custom Frames", "Baby Plushies", "Desk Decor", "Keychains", "Festive Rakhis", "Gifts Under ₹999"]}
        bgColor="bg-brand-black"
        textColor="text-white"
        dividerColor="text-white/20"
      />

      {/* Centered final Checkout CTA */}
      <FinalCTA />
    </>
  );
}
