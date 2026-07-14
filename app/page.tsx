import React from "react";
import type { Metadata } from "next";
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
import HomePreloader from "@/components/home/HomePreloader";
export const metadata: Metadata = {
  title: "Ragu Goat Farm | Live Goats & Mutton Villupuram",
  description:
    "Buy healthy live goats & fresh mutton online from Ragu Goat Farm, Villupuram. Farm-fresh breeds with delivery across Tamil Nadu. Book now!",
  keywords: [
    "live goat for sale Tamil Nadu",
    "goat farm Villupuram",
    "naatu aadu vitpanai",
    "Bakrid goat booking 2026",
    "fresh mutton delivery Villupuram",
    "Tellicherry goat for sale",
    "Boer goat Tamil Nadu",
    "mutton home delivery near me",
    "bulk mutton order Villupuram",
    "goat farm near Villupuram",
    "goat online booking Tamil Nadu",
    "country goat mutton naatu aadu",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ragu Goat Farm | Live Goat & Fresh Mutton — Villupuram",
    description:
      "Order pasture-raised live goats and bulk fresh mutton from Ragu Goat Farm. Tellicherry, Boer, Kanni Aadu breeds. Home delivery across Tamil Nadu.",
    type: "website",
    locale: "en_IN",
    siteName: "Ragu Goat Farm",
    url: "/",
    images: [
      {
        url: "/placeholder-goat.jpg",
        width: 1200,
        height: 630,
        alt: "Ragu Goat Farm Boer Goat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ragu Goat Farm | Live Goat & Fresh Mutton Delivery",
    description:
      "Buy healthy live goats and farm-fresh bulk mutton from Ragu Goat Farm, Villupuram, Tamil Nadu.",
  },
};



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
    <HomePreloader>
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
    </HomePreloader>
  );
}
