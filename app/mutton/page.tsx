import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MuttonClientList from "./MuttonClientList";
import { connectToDatabase } from "@/lib/db";
import MuttonPack from "@/models/MuttonPack";
import SiteSettings from "@/models/SiteSettings";
import { MapPin, Info, ChevronDown, Beef } from "lucide-react";

export const revalidate = 60; // Cache for 60 seconds

export default async function MuttonListingPage() {
  await connectToDatabase();
  const dbPacks = await MuttonPack.find({ isActive: true }).sort({ isFeatured: -1, name: 1 }).lean();
  const settingsSetting = await SiteSettings.findOne({ key: "mutton_districts" }).lean();

  const districtsStr = settingsSetting?.value || "Coimbatore, Tiruppur, Erode, Villupuram";

  // Serialize for client component
  const initialPacks = JSON.parse(JSON.stringify(dbPacks));

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-7 md:py-12 w-full flex flex-col gap-6 md:gap-10">
        {/* Page Header */}
        <div className="space-y-3 border-b border-brand-border pb-6 order-1">
          <span className="flex items-center justify-center gap-2 text-xs font-semibold text-mutton-text uppercase tracking-wider">
            <Beef size={14} className="text-mutton-primary" /> Premium Mutton Catalog
          </span>
          <h1 className="font-display text-2xl sm:text-5xl text-brand-black tracking-wide uppercase">
            Fresh Mutton Packs — Farm to Home Delivery
          </h1>
          <h2 className="font-display text-lg text-mutton-text uppercase tracking-wide">
            Bulk Naatu Aadu Mutton — 5kg, 10kg &amp; Custom Packs
          </h2>
          <p className="text-sm font-medium text-brand-gray hidden md:block">
            Order farm fresh bulk mutton packages, freshly cut and hygienically packed, and delivered to your doorstep across Villupuram, Tindivanam, and other major districts in Tamil Nadu. Perfect for weddings, functions, and regular orders.
          </p>
          <details className="md:hidden text-xs text-brand-gray border border-brand-border rounded-xl p-3 mt-2 bg-brand-light-gray/30">
            <summary className="font-semibold cursor-pointer outline-none select-none text-mutton-text uppercase tracking-wider">
              Show Farm &amp; Delivery Details
            </summary>
            <p className="mt-2 leading-relaxed">
              Order farm fresh bulk mutton packages, freshly cut and hygienically packed, and delivered to your doorstep across Villupuram, Tindivanam, and other major districts in Tamil Nadu. Perfect for weddings, functions, and regular orders.
            </p>
          </details>
        </div>

        {/* District service banner */}
        <div className="bg-mutton-tint/40 border border-mutton-primary/10 rounded-2xl p-3 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none order-3 md:order-2">
          <div className="flex gap-3 items-start">
            <MapPin size={22} className="text-mutton-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-brand-black">Fresh Mutton Delivery Districts</h3>
              <p className="text-xs text-mutton-text mt-0.5 font-medium">
                We deliver fresh bulk mutton to {districtsStr} districts.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-brand-gray bg-white border border-brand-border px-3 py-1.5 rounded-xl shadow-2xs shrink-0 self-start sm:self-auto">
            <Info size={14} className="text-neutral-400" />
            <span>Outside these districts? Contact us</span>
          </div>
        </div>

        {/* Client List with Filters */}
        <div className="order-2 md:order-3 space-y-6 md:space-y-10 w-full">
          <MuttonClientList initialPacks={initialPacks} />
        </div>

        {/* SEO Content Block */}
        <div className="bg-brand-light-gray/20 rounded-2xl p-3 lg:p-6 border border-brand-border mt-2 md:mt-12 text-left w-full mx-auto order-4">
          {/* Desktop View */}
          <section className="hidden lg:block space-y-4">
            <h3 className="font-display text-2xl text-brand-black uppercase tracking-wide">
              Bulk Farm Fresh Mutton Delivery
            </h3>
            <p className="text-brand-gray text-sm leading-relaxed text-justify">
              Elevate your culinary experience with premium, farm fresh mutton from Ragu Goat Farm. We supply hygienic, bulk mutton packs ideal for weddings, restaurants, family gatherings, and commercial orders. Sourced exclusively from healthy, young country goats (Naatu Aadu) raised on our farm, our meat guarantees tenderness and rich traditional flavor. Enjoy seamless booking and prompt cold chain delivery directly to your doorstep in Villupuram, Pondicherry, Tindivanam, Vanur and surrounding districts in Tamil Nadu.
            </p>
          </section>

          {/* Mobile & Tablet View */}
          <details className="lg:hidden group">
            <summary className="font-display text-lg sm:text-xl text-brand-black uppercase tracking-wide cursor-pointer flex justify-between items-center outline-none list-none [&::-webkit-details-marker]:hidden">
              <span className="pr-2 leading-tight">Bulk Farm Fresh Mutton Delivery</span>
              <ChevronDown className="w-5 h-5 text-brand-gray transition-transform duration-300 group-open:rotate-180 shrink-0" />
            </summary>
            <p className="text-brand-gray text-sm leading-relaxed text-justify mt-3 border-t border-brand-border pt-3">
              Elevate your culinary experience with premium, farm fresh mutton from Ragu Goat Farm. We supply hygienic, bulk mutton packs ideal for weddings, restaurants, family gatherings, and commercial orders. Sourced exclusively from healthy, young country goats (Naatu Aadu) raised on our farm, our meat guarantees tenderness and rich traditional flavor. Enjoy seamless booking and prompt cold chain delivery directly to your doorstep in Villupuram, Pondicherry, Tindivanam, Vanur and surrounding districts in Tamil Nadu.
            </p>
          </details>
        </div>
      </main>

      <Footer />
    </div>
  );
}
