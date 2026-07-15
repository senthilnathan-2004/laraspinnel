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
import PhilosophyContent from "@/components/home/PhilosophyContent";
import { connectToDatabase } from "@/lib/db";
import Banner from "@/models/Banner";
import SiteSettings from "@/models/SiteSettings";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Ragu Goat Farm | Live Goats & Mutton in Tamil Nadu",
  description:
    "Buy healthy live goats & fresh mutton from Ragu Goat Farm, Villupuram. Naatu aadu, Boer & Tellicherry breeds delivered across Tamil Nadu.",
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



const DEFAULT_PHILOSOPHY = `
<p class="text-brand-gray leading-relaxed text-sm md:text-base mb-6">At Ragu Estate, we take immense pride in raising healthy, pasture-fed animals across Villupuram and surrounding districts. Whether you are looking for premium Boer, Tellicherry, or native Naatu breeds for agriculture or festivals like Bakrid, we guarantee the highest standard of livestock. Our bulk delivery service ensures that you receive hygienic, freshly prepared cuts tailored for your special events and commercial needs, delivered promptly to your location. Through generations of dedicated animal husbandry, we have perfected the art of sustainable rearing. Our expansive grassy meadows offer the perfect environment for our herds to thrive naturally, ensuring optimal health and vitality. By fostering an ecosystem that prioritizes animal well-being, we consistently deliver unmatched excellence in every single order.</p>

<h3 class="text-xl font-bold text-brand-black pt-4 mb-2">Sustainable Agriculture & Rearing Practices</h3>
<p class="text-brand-gray leading-relaxed text-sm md:text-base mb-6">With years of expertise in animal husbandry, we prioritize animal welfare, organic feeding practices, and regular veterinary checkups. Buy directly from our pastures to enjoy unmatched excellence, transparent pricing, and reliable delivery across Tamil Nadu. Experience the difference of true source-to-table superiority today. Our flocks are allowed to roam freely on extensive green lands, consuming a natural diet that significantly enhances their health and vitality. We never use artificial growth promoters or harmful chemicals. Instead, we rely on the bountiful resources of nature to cultivate strong, resilient livestock. Our commitment to sustainability means that we employ rotational grazing techniques, which not only nourish our animals but also revitalize the soil, contributing to a healthier environment for future generations.</p>

<h3 class="text-xl font-bold text-brand-black pt-4 mb-2">Hygienic Processing & Superior Standard</h3>
<p class="text-brand-gray leading-relaxed text-sm md:text-base mb-6">When it comes to our premium protein offerings, hygiene is our utmost priority. Our processing facilities adhere strictly to modern cleanliness protocols, ensuring every batch of meat is safely handled, carefully inspected, and cleanly packaged. We avoid any artificial preservatives or hormones. This rigorous dedication guarantees that our clients always receive the freshest, most tender cuts available on the market, perfect for home cooking, large family gatherings, or catering services. Every step of our supply chain is meticulously monitored, from the pastures to your doorstep, maintaining an unbroken cold chain that preserves the natural flavor, texture, and nutritional value of the meat.</p>

<h3 class="text-xl font-bold text-brand-black pt-4 mb-2">Committed to Community & Tradition</h3>
<p class="text-brand-gray leading-relaxed text-sm md:text-base mb-6">We believe in upholding the agricultural traditions of Tamil Nadu while employing modern techniques to improve yield and animal health. Our estate works closely with local communities, providing employment and supporting sustainable local ecosystems. Every purchase directly supports these rural economies and helps preserve traditional rearing methods that have been passed down for generations. By choosing our services, you are investing in a system that values human connection, respects the environment, and honors the timeless practices of ethical animal stewardship.</p>

<h4 class="text-lg font-bold text-brand-black pt-4 mb-2">A Sustainable Future for All</h4>
<p class="text-brand-gray leading-relaxed text-sm md:text-base mb-6">Our vision is to continue expanding our green pastures while reducing our carbon footprint. We are constantly researching innovative methods to integrate renewable energy into our daily operations, minimizing waste, and maximizing resource efficiency. Our dedication to a greener tomorrow ensures that our agricultural practices remain viable and beneficial for decades to come.</p>

<h5 class="text-base font-bold text-brand-black pt-2 mb-2">Strong Local Partnerships</h5>
<p class="text-brand-gray leading-relaxed text-sm md:text-base mb-6">We partner with regional agriculturists to share our veterinary insights and best practices. Through educational workshops and collaborative initiatives, we strive to elevate the standard of animal care across the entire region, creating a network of professionals who share our passion for excellence and sustainability.</p>

<h6 class="text-sm font-bold text-brand-black pt-2 mb-2">Join Our Mission</h6>
<p class="text-brand-gray leading-relaxed text-sm mb-6">Support sustainable agriculture by choosing our enterprise for your next purchase. Whether you require premium livestock for breeding, specific breeds for traditional ceremonies, or high-quality fresh cuts for culinary excellence, we are your trusted partner in delivering exceptional value and uncompromising quality.</p>
`;

export default async function HomePage() {
  const qualityItems = [
    "Premium Standards",
    "Ranch Fresh",
    "100% Organic",
    "Veterinary Inspected",
    "Traceable Lineage",
    "Hygienic Packaging"
  ];

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
  try {
    const philosophySetting = await SiteSettings.findOne({ key: "philosophy_content" }).lean();
    if (philosophySetting && philosophySetting.value && philosophySetting.value.trim() !== "") {
      philosophyContent = philosophySetting.value;
    }
  } catch (err) {
    console.error("Failed to load philosophy content", err);
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

          {/* Comprehensive SEO & Philosophy Text Block (Boosts Text-to-HTML ratio) */}
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
