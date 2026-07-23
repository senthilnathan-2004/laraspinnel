"use client";
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, Award, Shield, Compass, BookOpen } from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/hooks/useSettings";
import Image from "next/image";

export default function AboutPage() {
  const { settings } = useSettings();

  const values = [
    {
      title: settings.about_why_1_title || "Handmade with Love",
      description: settings.about_why_1_desc || "Every piece is hand-knitted in our Villupuram studio using premium milk cotton yarn, with careful attention to every stitch and finish.",
      icon: <Shield size={24} className="text-goat-primary shrink-0" />,
    },
    {
      title: settings.about_why_2_title || "Fully Customizable Gifts",
      description: settings.about_why_2_desc || "From crochet flower bouquets to amigurumi plush and photo frames, we personalize colours, styles, and details to match your occasion.",
      icon: <Award size={24} className="text-goat-primary shrink-0" />,
    },
    {
      title: settings.about_why_3_title || "Safe Pan-India Delivery",
      description: settings.about_why_3_desc || "We carefully pack and ship each handcrafted gift across India, so your keepsakes arrive perfect and ready to gift.",
      icon: <Compass size={24} className="text-goat-primary shrink-0" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-6 py-7 md:py-12 w-full space-y-16 animate-in fade-in">
        {/* Page Header */}
        <div className="space-y-3 pb-6 text-center mx-auto w-full">
          <span className="flex items-center justify-center gap-2 text-xs font-semibold text-goat-text uppercase tracking-wider">
            <BookOpen size={14} className="text-goat-primary" /> Our Story
          </span>
          <h1 className="font-display text-3xl sm:text-5xl text-brand-black tracking-wide uppercase">
            {settings.about_intro_title || "About Lara's Pinnal"}
          </h1>
          <p className="text-sm font-medium text-brand-gray">
            {settings.about_intro_subtitle || "Handcrafting crochet gifts and flowers with love in Villupuram, Tamil Nadu."}
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-10 items-start">
          <div className="order-1 md:col-span-1 lg:col-span-1 relative aspect-4/3 rounded-2xl overflow-hidden bg-brand-light-gray border border-brand-border select-none shadow-sm">
            <Image
              src={settings.about_intro_image || "/placeholder-goat.jpg"}
              alt="Lara's Pinnal Handmade Crochet Gifts"
              fill
              className="object-cover"
              sizes="(max-w-768px) 100vw, 500px"
            />
          </div>
          <div className="order-2 md:col-span-2 lg:col-span-1 space-y-4">
            <h2 className="font-display text-2xl sm:text-2xl md:text-3xl text-brand-black uppercase">
              Our Crochet Craft Philosophy in Villupuram
            </h2>
            <p className="text-sm text-brand-gray leading-relaxed text-justify">
              {settings.about_intro_p1 || "At Lara's Pinnal, we believe that a beautiful gift begins with heartfelt craftsmanship. Based in Villupuram, we hand-knit every crochet flower, plush toy, and keepsake using premium milk cotton yarn, so each piece is soft, durable, and made to last."}
            </p>
            <p className="text-sm text-brand-gray leading-relaxed text-justify">
              {settings.about_intro_p2 || "We started with a simple vision — to bring handmade, personalized crochet gifts to celebrations across India. By blending traditional crochet techniques with modern designs and direct-to-customer delivery, we make sure every keepsake reaches your doorstep exactly as you imagined."}
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8 bg-brand-light-gray/40 border border-brand-border rounded-3xl p-3 md:p-8">
          <div className="text-center space-y-2 max-w-md mx-auto">
            <h2 className="font-display text-2xl sm:text-2xl md:text-3xl text-brand-black uppercase">
              {settings.about_why_title || "Why Choose Lara's Pinnal?"}
            </h2>
            <p className="text-xs text-brand-gray font-medium">
              {settings.about_why_subtitle || "We stand by thoughtful details and quality craftsmanship that make our handmade crochet gifts special."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, idx) => (
              <div key={idx} className="bg-white p-3 md:p-5 rounded-2xl border border-brand-border space-y-3 shadow-3xs flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-goat-tint border border-goat-primary/10 flex items-center justify-center shadow-3xs">
                  {v.icon}
                </div>
                <h4 className="font-semibold text-brand-black text-sm">{v.title}</h4>
                <p className="text-xs text-brand-gray leading-relaxed text-justify">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 select-none py-8 text-center bg-white">
          <div className="space-y-1">
            <span className="font-display text-2xl sm:text-3xl md:text-4xl text-goat-primary block tracking-wide">{settings.about_stat_1_val || "500+"}</span>
            <span className="text-[10px] text-brand-gray uppercase font-bold tracking-wider block">{settings.about_stat_1_label || "Gifts Handmade"}</span>
          </div>
          <div className="space-y-1 border-l border-brand-border">
            <span className="font-display text-2xl sm:text-3xl md:text-4xl text-goat-primary block tracking-wide">{settings.about_stat_2_val || "100%"}</span>
            <span className="text-[10px] text-brand-gray uppercase font-bold tracking-wider block">{settings.about_stat_2_label || "Handcrafted"}</span>
          </div>
          <div className="space-y-1 border-l border-brand-border">
            <span className="font-display text-2xl sm:text-3xl md:text-4xl text-goat-primary block tracking-wide">{settings.about_stat_3_val || "4.9★"}</span>
            <span className="text-[10px] text-brand-gray uppercase font-bold tracking-wider block">{settings.about_stat_3_label || "Happy Customers"}</span>
          </div>
          <div className="space-y-1 border-l border-brand-border">
            <span className="font-display text-2xl sm:text-3xl md:text-4xl text-goat-primary block tracking-wide">{settings.about_stat_4_val || "Pan-India"}</span>
            <span className="text-[10px] text-brand-gray uppercase font-bold tracking-wider block">{settings.about_stat_4_label || "Delivery"}</span>
          </div>
        </div>

        {/* Closes CTA */}
        <div className="text-center space-y-4">
          <h3 className="font-display text-2xl text-brand-black uppercase">
            Explore Our Handmade Crochet Gifts &amp; Gallery
          </h3>
          <div className="flex justify-center gap-4">
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center border border-brand-black hover:bg-brand-black hover:text-white text-brand-black font-semibold text-sm h-11 px-4 md:px-6 rounded-full transition-all"
            >
              Explore Our Gallery
            </Link>
            <Link
              href="/goats"
              className="inline-flex items-center justify-center bg-brand-black hover:bg-goat-primary text-white font-semibold text-sm h-11 px-4 md:px-6 rounded-full transition-colors"
            >
              Browse Gifts
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
