import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Above-fold: static imports — rendered immediately, no deferred bundle
import HeroSlider from "@/components/home/HeroSlider";
import ShopByCategory from "@/components/home/ShopByCategory";

// Near-fold text marquee with SSR for no layout shift
import dynamic from "next/dynamic";
const TextMarquee = dynamic(() => import("@/components/home/TextMarquee"), { ssr: true });

import BestSellers from "@/components/home/BestSellers";
import BelowFoldSections from "@/components/home/BelowFoldSections";

import { connectToDatabase } from "@/lib/db";
import Banner from "@/models/Banner";
import SiteSettings from "@/models/SiteSettings";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Lara's Pinnal | Handcrafted Crochet Gifts & Flowers in Tamil Nadu",
  description:
    "Buy beautiful handcrafted crochet flower bouquets, custom frames, baby amigurumi plushies, keychains, and gift hampers from Lara's Pinnal, Tamil Nadu.",
  keywords: [
    "crochet bouquet online India",
    "handmade gifts Chennai",
    "crochet flowers Tamil Nadu",
    "customized frames gifts",
    "personalized amigurumi plushies",
    "crochet keychain online buy",
    "handmade hampers birthday",
    "crochet Rakhi online",
    "gifts under 999 online",
    "crochet corner Tamil Nadu",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lara's Pinnal | Handcrafted Crochet Gifts & Flowers",
    description:
      "Order pasture-raised wool and milk cotton crochet gifts. Unique flower bouquets, plushies, keychains, and custom hampers. Delivery across Tamil Nadu.",
    type: "website",
    locale: "en_IN",
    siteName: "Lara's Pinnal",
    url: "/",
    images: [
      {
        url: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Lara's Pinnal Crochet Bouquet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lara's Pinnal | Handcrafted Crochet Gifts & Flowers",
    description:
      "Buy original handmade crochet items and customized gifts from Lara's Pinnal, Tamil Nadu.",
  },
};

const DEFAULT_PHILOSOPHY = `
<p class="text-brand-gray leading-relaxed text-sm md:text-base mb-6">At Lara's Pinnal, we take immense pride in crafting beautiful, hand-knitted creations using premium milk cotton yarn. Whether you are looking for forever crochet bouquets, personalized frames, custom amigurumi plush toys, or gift hampers, we ensure the highest standard of durability and aesthetics. Every single order is hand-knitted with endless love and detail, making sure your special occasion is celebrated with a unique, long-lasting gift.</p>

<h3 class="text-xl font-bold text-brand-black pt-4 mb-2">Passion for Yarn & Sustainable Craftsmanship</h3>
<p class="text-brand-gray leading-relaxed text-sm md:text-base mb-6">Our studio uses only premium, hypoallergenic milk cotton yarn that is soft, vibrant, and safe for infants. By sourcing high-quality materials and utilizing intricate knitting methods, we ensure each item lasts a lifetime. Handcrafted items reduce machine production footprints, making our products highly sustainable and eco-friendly.</p>

<h3 class="text-xl font-bold text-brand-black pt-4 mb-2">Detailed Customization & Quick Delivery</h3>
<p class="text-brand-gray leading-relaxed text-sm md:text-base mb-6">When it comes to customized frames and orders, detail is our priority. We match color codes, names, photos, and personal notes to create a bespoke gifting experience. Once complete, each order is carefully bubble-wrapped and shipped in secure packaging to ensure it reaches your doorstep in pristine condition.</p>
`;

export default async function HomePage() {
  await connectToDatabase();

  let initialBanners: any[] = [];
  try {
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

  let philosophyContent = DEFAULT_PHILOSOPHY;
  let allSettings: Record<string, string> = {};
  try {
    const settingsList = await SiteSettings.find({}).lean();
    settingsList.forEach((s: any) => {
      allSettings[s.key] = s.value;
    });
    
    if (allSettings["philosophy_content"] && allSettings["philosophy_content"].trim() !== "") {
      philosophyContent = allSettings["philosophy_content"];
    }
  } catch (err) {
    console.error("Failed to load settings", err);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Scroll-aware sticky Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Visually hidden H1 for SEO */}
        <h1 className="sr-only">Lara's Pinnal - Handcrafted Crochet Gifts & Flowers</h1>
        
        {/* Visually hidden data table for AI Citability & SEO structured extraction */}
        <table className="sr-only">
          <caption>Lara's Pinnal Services & Offerings</caption>
          <thead>
            <tr>
              <th scope="col">Product / Category</th>
              <th scope="col">Key Highlights</th>
              <th scope="col">Availability</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Crochet Flower Bouquets</td>
              <td>Lavender, Rose, Lily, Sunflower forever bouquets</td>
              <td>All Districts in Tamil Nadu</td>
            </tr>
            <tr>
              <td>Personalized Frames & Hampers</td>
              <td>Photo + crochet combination, baby shower boxes</td>
              <td>Pan-India Shipping Available</td>
            </tr>
            <tr>
              <td>Cute Keychains & Accessories</td>
              <td>Avocados, bees, totes, clips under ₹999</td>
              <td>Ready to Ship in 2-4 days</td>
            </tr>
          </tbody>
        </table>

        {/* Hero Banner Slider */}
        <HeroSlider initialBanners={initialBanners} />

        {/* Desktop-only Marquee */}
        <div className="hidden lg:block">
          <TextMarquee
            items={["100% Handcrafted", "Custom Colors Available", "Safe Baby Toys", "Premium Milk Cotton Yarn", "Secure Shipping"]}
            bgColor="bg-brand-light-gray"
            textColor="text-brand-black"
            dividerColor="text-brand-black/20"
          />
        </div>

        {/* Shop by Category cards */}
        <ShopByCategory settings={allSettings} />

        {/* Popular Best Sellers Section */}
        <BestSellers />

        {/* Below-fold sections */}
        <BelowFoldSections philosophyContent={philosophyContent} />
      </main>

      {/* Footer block */}
      <Footer />
    </div>
  );
}
