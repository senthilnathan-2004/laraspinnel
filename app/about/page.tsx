"use client";
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, Award, Shield, Compass } from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/hooks/useSettings";
import Image from "next/image";

export default function AboutPage() {
  const { settings } = useSettings();

  const values = [
    {
      title: settings.about_why_1_title || "Hygienic Care Standards",
      description: settings.about_why_1_desc || "Our Villupuram farm employs advanced veterinary inspection, regular vaccination cycles, and clean organic grazing feeding practices.",
      icon: <Shield size={24} className="text-goat-primary shrink-0" />,
    },
    {
      title: settings.about_why_2_title || "Traceable Quality Breeds",
      description: settings.about_why_2_desc || "We focus on premium breeds like Boer, Tellicherry, and native livestock with fully traceable lineage and health reports.",
      icon: <Award size={24} className="text-goat-primary shrink-0" />,
    },
    {
      title: settings.about_why_3_title || "Safe specialized transit",
      description: settings.about_why_3_desc || "We own customized animal transport fleets equipped to keep livestock stress-free and hydrated during shipment.",
      icon: <Compass size={24} className="text-goat-primary shrink-0" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-6 py-12 w-full space-y-16 animate-in fade-in">
        {/* Page Header */}
        <div className="space-y-3 border-b border-brand-border pb-6 text-center mx-auto w-full">
          <span className="text-xs font-semibold text-goat-text uppercase tracking-wider block">🌾 Our Story</span>
          <h1 className="font-display text-4xl sm:text-5xl text-brand-black tracking-wide uppercase">
            {settings.about_intro_title || "About Ragu Goat Farm"}
          </h1>
          <p className="text-sm font-medium text-brand-gray">
            {settings.about_intro_subtitle || "Pioneering organic, pasture-raised livestock farming in Villupuram, Tamil Nadu."}
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-light-gray border border-brand-border select-none shadow-sm">
            <Image
              src={settings.about_intro_image || "/placeholder-goat.jpg"}
              alt="Ragu Farm Pastures"
              fill
              className="object-cover"
              sizes="(max-w-768px) 100vw, 500px"
            />
          </div>
          <div className="space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl text-brand-black uppercase">
              Our Goat Farming Philosophy in Villupuram
            </h2>
            <p className="text-sm text-brand-gray leading-relaxed">
              {settings.about_intro_p1 || "At Ragu Goat Farm, we believe that premium quality begins with wholesome care. Located in the lush pastures of Villupuram, our farm spans acres of open grazing fields. Our animals are pasture-raised, allowing them natural forage access alongside nutrient-rich feed."}
            </p>
            <p className="text-sm text-brand-gray leading-relaxed">
              {settings.about_intro_p2 || "We started with a vision to streamline livestock ordering in Tamil Nadu, eliminating middle-agency price hikes. By combining modern veterinary management with direct-to-customer deliveries, we ensure healthy animals reach your doorstep at transparent farm rates."}
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8 bg-brand-light-gray/40 border border-brand-border rounded-3xl p-3 md:p-4 md:p-8">
          <div className="text-center space-y-2 max-w-md mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl text-brand-black uppercase">
              {settings.about_why_title || "Why Choose Ragu Goat Farm?"}
            </h2>
            <p className="text-xs text-brand-gray font-medium">
              {settings.about_why_subtitle || "We stand by rigorous quality markers that differentiate our livestock and meat."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, idx) => (
              <div key={idx} className="bg-white p-3 md:p-5 rounded-2xl border border-brand-border space-y-3 shadow-3xs flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-goat-tint border border-goat-primary/10 flex items-center justify-center shadow-3xs">
                  {v.icon}
                </div>
                <h4 className="font-semibold text-brand-black text-sm">{v.title}</h4>
                <p className="text-xs text-brand-gray leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 select-none border-y border-brand-border py-8 text-center bg-white">
          <div className="space-y-1">
            <span className="font-display text-3xl sm:text-4xl text-goat-primary block tracking-wide">{settings.about_stat_1_val || "50+ ACRES"}</span>
            <span className="text-[10px] text-brand-gray uppercase font-bold tracking-wider block">{settings.about_stat_1_label || "Pasture Grazing"}</span>
          </div>
          <div className="space-y-1 border-l border-brand-border">
            <span className="font-display text-3xl sm:text-4xl text-goat-primary block tracking-wide">{settings.about_stat_2_val || "1,200+"}</span>
            <span className="text-[10px] text-brand-gray uppercase font-bold tracking-wider block">{settings.about_stat_2_label || "Goats Reared"}</span>
          </div>
          <div className="space-y-1 border-l border-brand-border">
            <span className="font-display text-3xl sm:text-4xl text-goat-primary block tracking-wide">{settings.about_stat_3_val || "99.8%"}</span>
            <span className="text-[10px] text-brand-gray uppercase font-bold tracking-wider block">{settings.about_stat_3_label || "Health Clearance"}</span>
          </div>
          <div className="space-y-1 border-l border-brand-border">
            <span className="font-display text-3xl sm:text-4xl text-goat-primary block tracking-wide">{settings.about_stat_4_val || "3,500+"}</span>
            <span className="text-[10px] text-brand-gray uppercase font-bold tracking-wider block">{settings.about_stat_4_label || "Deliveries Completed"}</span>
          </div>
        </div>

        {/* Closes CTA */}
        <div className="text-center space-y-4">
          <h3 className="font-display text-2xl text-brand-black uppercase">
            Explore Our Live Goats &amp; Farm Gallery
          </h3>
          <div className="flex justify-center gap-4">
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center border border-brand-black hover:bg-brand-black hover:text-white text-brand-black font-semibold text-sm h-11 px-4 md:px-6 rounded-full transition-all"
            >
              Explore Farm Photos
            </Link>
            <Link
              href="/goats"
              className="inline-flex items-center justify-center bg-brand-black hover:bg-goat-primary text-white font-semibold text-sm h-11 px-4 md:px-6 rounded-full transition-colors"
            >
              Browse Goats
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
