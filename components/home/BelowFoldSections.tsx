"use client";

/**
 * BelowFoldSections — Client Component wrapper for all below-fold sections.
 *
 * `ssr: false` in next/dynamic is only valid inside Client Components.
 * We group all below-fold sections here so their JS bundles are deferred
 * and don't compete with the hero image / above-fold content on the critical path.
 *
 * `props.philosophyContent` is passed from the Server Component (page.tsx) so
 * the philosophy text is always available without an extra client fetch.
 */

import dynamic from "next/dynamic";

const FeaturedVarieties = dynamic(() => import("@/components/home/FeaturedVarieties"), {
  ssr: false,
  loading: () => <div className="min-h-[300px] bg-brand-light-gray/40" />,
});
const ImageMarquee = dynamic(() => import("@/components/home/ImageMarquee"), {
  ssr: false,
  loading: () => <div className="min-h-[180px]" />,
});
const ServiceAreaBanner = dynamic(() => import("@/components/home/ServiceAreaBanner"), {
  ssr: false,
  loading: () => <div className="min-h-[120px]" />,
});
const FeaturedMutton = dynamic(() => import("@/components/home/FeaturedMutton"), {
  ssr: false,
  loading: () => <div className="min-h-[300px]" />,
});
const HowItWorks = dynamic(() => import("@/components/home/HowItWorks"), {
  ssr: false,
  loading: () => <div className="min-h-[200px]" />,
});
const GalleryPreview = dynamic(() => import("@/components/home/GalleryPreview"), {
  ssr: false,
  loading: () => <div className="min-h-[400px]" />,
});
const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
  ssr: false,
  loading: () => <div className="min-h-[300px]" />,
});
const PhilosophyContent = dynamic(() => import("@/components/home/PhilosophyContent"), {
  ssr: false,
});
const BlogPreview = dynamic(() => import("@/components/home/BlogPreview"), {
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

interface BelowFoldSectionsProps {
  philosophyContent: string;
}

export default function BelowFoldSections({ philosophyContent }: BelowFoldSectionsProps) {
  return (
    <>
      {/* Featured Live Goats Variety cards */}
      <FeaturedVarieties />

      {/* Variety Image Marquee - Hidden on desktop */}
      <div className="lg:hidden">
        <ImageMarquee />
      </div>

      {/* Service areas banner */}
      <ServiceAreaBanner />

      {/* Featured Mutton Packs cards */}
      <FeaturedMutton />

      {/* How Booking Works flow strip */}
      <HowItWorks />

      {/* Farm Gallery previews */}
      <GalleryPreview />


      {/* Customer Testimonials and Trust Badges */}
      <Testimonials />

      {/* Comprehensive SEO & Philosophy Text Block */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 my-16">
        <section className="bg-brand-light-gray/20 rounded-2xl p-4 sm:p-6 lg:p-8 border border-brand-border text-left relative overflow-hidden group hover:border-goat-primary/30 transition-colors">
          {/* Decorative subtle background accent for desktop */}
          <div className="hidden lg:block absolute -top-24 -right-24 w-64 h-64 bg-goat-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-goat-primary/10 transition-colors" />

          {/* Top Row: Heading */}
          <div className="space-y-4 relative z-10 mb-8 lg:mb-12">
            <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-goat-primary/10 border border-goat-primary/20 text-goat-primary text-[10px] font-bold uppercase tracking-widest">
              Our Philosophy
            </div>
            <h2 className="font-display text-2xl md:text-4xl lg:text-5xl text-brand-black uppercase tracking-wide leading-tight">
              Your Trusted Source for Premium Livestock and Fresh Meat in Tamil Nadu
            </h2>
          </div>

          {/* Bottom Row: Expanded Content */}
          <PhilosophyContent content={philosophyContent} />
        </section>
      </div>

      {/* Blog post previews */}
      <BlogPreview />

      {/* Goat Varieties / Marketing Marquee */}
      <TextMarquee
        items={["Boer Goat", "Tellicherry", "Kanni Aadu", "Sirohi", "Native Breed", "Dorper"]}
        bgColor="bg-brand-black"
        textColor="text-white"
        dividerColor="text-white/20"
      />

      {/* Centered final Booking CTA */}
      <FinalCTA />
    </>
  );
}
