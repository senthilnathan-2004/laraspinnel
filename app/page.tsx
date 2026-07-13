import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSlider from "@/components/home/HeroSlider";
import ShopByCategory from "@/components/home/ShopByCategory";
import FeaturedVarieties from "@/components/home/FeaturedVarieties";
import FeaturedMutton from "@/components/home/FeaturedMutton";
import HowItWorks from "@/components/home/HowItWorks";
import GalleryPreview from "@/components/home/GalleryPreview";
import BlogPreview from "@/components/home/BlogPreview";
import Testimonials from "@/components/home/Testimonials";
import ServiceAreaBanner from "@/components/home/ServiceAreaBanner";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/layout/Footer";
import TextMarquee from "@/components/home/TextMarquee";
import ImageMarquee from "@/components/home/ImageMarquee";
import FestivalGoatCTA from "@/components/home/FestivalGoatCTA";

export default function HomePage() {
  const qualityItems = [
    "Premium Quality",
    "Farm Fresh",
    "100% Organic",
    "Veterinary Inspected",
    "Traceable Lineage",
    "Hygienic Packaging"
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Scroll-aware sticky Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Banner Slider */}
        <HeroSlider />

        {/* Desktop-only Marquee 1 */}
        <div className="hidden lg:block">
          <TextMarquee 
            items={["Wholesale Available", "Farm Direct Pricing", "Cash On Delivery", "Custom Cuts", "Lowest Price Guaranteed"]} 
            bgColor="bg-brand-light-gray" 
            textColor="text-brand-black" 
            dividerColor="text-brand-black/20" 
          />
        </div>

        {/* Shop by Category cards */}
        <ShopByCategory />

        {/* Festival Goat CTA Block */}
        <FestivalGoatCTA />



        {/* Featured Live Goats Variety cards */}
        <FeaturedVarieties />
        
        {/* Variety Image Marquee */}
        <ImageMarquee />

        {/* Service areas banner */}
        <ServiceAreaBanner />



        {/* Featured Mutton Packs cards */}
        <FeaturedMutton />

        {/* How Booking Works flow strip */}
        <HowItWorks />

        {/* Farm Gallery previews */}
        <GalleryPreview />

        {/* Desktop-only Marquee 2 */}
        <div className="hidden lg:block">
          <ImageMarquee direction="right" bgColor="bg-transparent border-none" />
        </div>

        {/* Customer Testimonials and Trust Badges */}
        <Testimonials />

        {/* Blog post previews */}
        <BlogPreview />

        {/* Goat Varieties / Marketing Marquee */}
        <TextMarquee items={["Boer Goat", "Tellicherry", "Kanni Aadu", "Sirohi", "Native Breed", "Dorper"]} bgColor="bg-brand-black" textColor="text-white" dividerColor="text-white/20" />

        {/* Centered final Booking CTA */}
        <FinalCTA />
      </main>

      {/* Footer block */}
      <Footer />
    </div>
  );
}
