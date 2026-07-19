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

const PhilosophyContent = dynamic(() => import("@/components/home/PhilosophyContent"), {
  ssr: false,
});

const FinalCTA = dynamic(() => import("@/components/home/FinalCTA"), {
  ssr: false,
  loading: () => <div className="min-h-[150px]" />,
});

const TextMarquee = dynamic(() => import("@/components/home/TextMarquee"), {
  ssr: false,
  loading: () => <div className="min-h-[48px]" />,
});

interface BelowFoldSectionsProps {
  philosophyContent: string;
}

export default function BelowFoldSections({ philosophyContent }: BelowFoldSectionsProps) {
  return (
    <>
      {/* Featured Products catalog */}
      <FeaturedProducts />

      {/* Why Choose Us (HowItWorks refactored) */}
      <HowItWorks />

      {/* Customer Testimonials */}
      <Testimonials />

      {/* Comprehensive SEO & Philosophy Story Block */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 my-16">
        <section className="bg-brand-light-gray/20 rounded-2xl p-4 sm:p-6 lg:p-8 border border-brand-border text-left relative overflow-hidden group hover:border-goat-primary/30 transition-colors">
          {/* Decorative subtle background accent */}
          <div className="hidden lg:block absolute -top-24 -right-24 w-64 h-64 bg-goat-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-goat-primary/10 transition-colors" />

          {/* Top Row: Heading */}
          <div className="space-y-4 relative z-10 mb-8 lg:mb-12">
            <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-goat-primary/10 border border-goat-primary/20 text-goat-primary text-[10px] font-bold uppercase tracking-widest">
              Our Story
            </div>
            <h2 className="font-display text-2xl md:text-4xl lg:text-5xl text-brand-black uppercase tracking-wide leading-tight">
              Hand-Knitted Gifts Crafted With Soft Cotton and Infinite Love
            </h2>
          </div>

          {/* Bottom Row: Story Content */}
          <PhilosophyContent content={philosophyContent} />
        </section>
      </div>

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
