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
import { connectToDatabase } from "@/lib/db";
import Banner from "@/models/Banner";

export const metadata: Metadata = {
  title: "Ragu Goat Farm | Live Goats & Mutton in Tamil Nadu",
  description:
    "Buy healthy live goats & fresh mutton online from Ragu Goat Farm, Villupuram. Farm-fresh naatu aadu, Boer breeds with delivery across Tamil Nadu. Book now!",
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



export default async function HomePage() {
  const qualityItems = [
    "Premium Quality",
    "Farm Fresh",
    "100% Organic",
    "Veterinary Inspected",
    "Traceable Lineage",
    "Hygienic Packaging"
  ];

  let initialBanners: any[] = [];
  try {
    await connectToDatabase();
    const dbBanners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
    initialBanners = dbBanners.map((b: any) => ({
      _id: b._id.toString(),
      imageUrl: b.imageUrl,
      headline: b.headline,
      subtext: b.subtext || "",
      buttonText: b.buttonText || "",
      buttonLink: b.buttonLink || "",
      buttonTheme: b.buttonTheme || "green",
    }));
  } catch (err) {
    console.error("Failed to load initial banners", err);
  }

  return (
    <HomePreloader>
      <div className="min-h-screen bg-white flex flex-col justify-between">
        {/* Scroll-aware sticky Navbar */}
        <Navbar />

        <main className="flex-1">
          {/* Visually hidden H1 for SEO since HeroSlider fetches client-side */}
          <h1 className="sr-only">Ragu Goat Farm - Live Goats & Fresh Mutton in Villupuram</h1>

          {/* Hero Banner Slider */}
          <HeroSlider initialBanners={initialBanners} />

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

          {/* SEO Content Block (Card Style) */}
          <div className="max-w-7xl mx-auto px-4 md:px-6 my-16">
            <section className="bg-brand-light-gray/20 rounded-2xl p-4 sm:p-6 lg:p-12 border border-brand-border text-left flex flex-col lg:flex-row gap-6 lg:gap-16 items-start lg:items-center relative overflow-hidden group hover:border-goat-primary/30 transition-colors">
              {/* Decorative subtle background accent for desktop */}
              <div className="hidden lg:block absolute -top-24 -right-24 w-64 h-64 bg-goat-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-goat-primary/10 transition-colors" />

              {/* Left Column: Heading */}
              <div className="lg:w-5/12 space-y-4 relative z-10">
                <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-goat-primary/10 border border-goat-primary/20 text-goat-primary text-[10px] font-bold uppercase tracking-widest">
                  Farm to Table Quality
                </div>
                <h2 className="font-display text-2xl md:text-4xl lg:text-5xl text-brand-black uppercase tracking-wide leading-tight lg:text-justify">
                  Your Trusted Source for Premium Live Goats and Fresh Mutton in Tamil Nadu
                </h2>
              </div>
              
              {/* Right Column: Content */}
              <div className="lg:w-7/12 space-y-4 lg:space-y-6 relative z-10 lg:border-l lg:border-brand-border/60 lg:pl-16">
                <p className="text-brand-gray leading-relaxed text-sm md:text-base">
                  At Ragu Goat Farm, we take pride in raising healthy, pasture-fed goats across Villupuram and surrounding districts. Whether you are looking for premium Boer, Tellicherry, or native Naatu Aadu breeds for farming or festivals like Bakrid, we guarantee the highest quality livestock. Our bulk mutton delivery service ensures that you receive hygienic, farm-fresh cuts tailored for your special events and commercial needs, delivered promptly to your location.
                </p>
                <p className="text-brand-gray leading-relaxed text-sm md:text-base hidden sm:block">
                  With years of expertise in goat farming, we prioritize animal welfare, organic feeding practices, and regular veterinary checkups. Buy directly from our farm to enjoy unmatched quality, transparent pricing, and reliable delivery across Tamil Nadu. Experience the difference of true farm-to-table quality today.
                </p>
              </div>
            </section>
          </div>

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
