import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GoatsClientList from "./GoatsClientList";
import { connectToDatabase } from "@/lib/db";
import GoatVariety from "@/models/GoatVariety";

export const revalidate = 60; // Cache for 60 seconds

export default async function GoatsListingPage() {
  await connectToDatabase();
  const dbGoats = await GoatVariety.find({ isActive: true }).sort({ isFeatured: -1, name: 1 }).lean();
  
  // Serialize for client component
  const initialGoats = JSON.parse(JSON.stringify(dbGoats));

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-12 w-full space-y-10">
        {/* Page Header */}
        <div className="space-y-3 border-b border-brand-border pb-6">
          <span className="text-xs font-semibold text-goat-text uppercase tracking-wider">🌿 Live Livestock Catalog</span>
          <h1 className="font-display text-4xl sm:text-5xl text-brand-black tracking-wide uppercase">
            Live Goat Varieties — Pasture Raised Breeds for Sale
          </h1>
          <h2 className="font-display text-lg text-goat-text uppercase tracking-wide">
            Find Your Perfect Breed — Tellicherry, Boer, Kanni Aadu &amp; More
          </h2>
          <p className="text-sm font-medium text-brand-gray hidden md:block">
            Browse our healthy naatu aadu and premium crossbreeds available for Bakrid sacrifice, rearing, and breeding. All goats are vaccinated and delivered safely across Villupuram, Tindivanam, and all Tamil Nadu districts.
          </p>
          <details className="md:hidden text-xs text-brand-gray border border-brand-border rounded-xl p-3 mt-2 bg-brand-light-gray/30">
            <summary className="font-semibold cursor-pointer outline-none select-none text-goat-text uppercase tracking-wider">
              Show Farm &amp; Delivery Details
            </summary>
            <p className="mt-2 leading-relaxed">
              Browse our healthy naatu aadu and premium crossbreeds available for Bakrid sacrifice, rearing, and breeding. All goats are vaccinated and delivered safely across Villupuram, Tindivanam, and all Tamil Nadu districts.
            </p>
          </details>
        </div>

        {/* Client List with Filters */}
        <GoatsClientList initialGoats={initialGoats} />

        {/* SEO Content Block */}
        <section className="bg-brand-light-gray/20 rounded-2xl p-4 md:p-6 border border-brand-border mt-12 text-left w-full mx-auto space-y-4">
          <h3 className="font-display text-2xl text-brand-black uppercase tracking-wide">
            Buy Live Goats Online in Tamil Nadu
          </h3>
          <p className="text-brand-gray text-sm leading-relaxed text-justify">
            Discover a wide selection of pasture raised, healthy live goats at Ragu Goat Farm. We specialize in premium breeds such as Boer, Tellicherry, Kanni Aadu, and local Naatu Aadu. Whether you need livestock for breeding, farming, or festive occasions like Bakrid, our goats are reared in open pastures with natural feed and regular veterinary care to ensure superior health and growth. We offer transparent pricing and reliable transport services across Villupuram, Tindivanam, Pondicherry, and other major districts in Tamil Nadu.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
