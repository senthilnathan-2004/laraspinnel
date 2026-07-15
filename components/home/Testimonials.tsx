"use client";

import React from "react";
import { Quote, Users, MapPin, ShieldCheck } from "lucide-react";
import { Star } from "@phosphor-icons/react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Testimonials() {
  const { data: settings = {} } = useSWR("/api/settings", fetcher);
  const { data: testimonials = [] } = useSWR("/api/admin/testimonials?activeOnly=true", fetcher);
  
  // Use either the dynamic testimonials or fallback to empty array
  const reviews = testimonials.length > 0 ? testimonials : [
    {
      name: "Ramesh Kumar",
      location: "Coimbatore, TN",
      review: "<strong>Goal:</strong> Sourcing 15 healthy live goats for a large family celebration.<br/><br/><strong>Outcome:</strong> Exceptional breed quality delivered right on time in excellent health. Ragu Goat Farm provided the most reliable farm-to-door service we've experienced in Tamil Nadu.",
      initial: "R",
    },
    {
      name: "Revathi S.",
      location: "Villupuram, TN",
      review: "<strong>Goal:</strong> Finding a consistent, hygienic source for weekly bulk mutton family packs.<br/><br/><strong>Outcome:</strong> Fresh, clean cuts delivered regularly in hygienic food-grade packaging. Ragu Goat Farm is now our default source for all mutton needs.",
      initial: "R",
    },
    {
      name: "Mohamed Asif",
      location: "Tiruppur, TN",
      review: "<strong>Goal:</strong> Purchasing premium Boer goats for festival breeding and rearing.<br/><br/><strong>Outcome:</strong> The farm team helped select the optimal weight classes and provided expert care guidance. Very professional service with honest, transparent farm pricing.",
      initial: "M",
    },
  ];

  return (
    <section className="py-20 bg-brand-light-gray">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-display text-4xl text-brand-black tracking-wide uppercase">
            {settings.home_testimonials_title || "What Our Customers Say"}
          </h2>
          <p className="text-sm font-medium text-brand-gray">
            {settings.home_testimonials_subtitle || "Stories of satisfaction from farmers, families, and commercial buyers."}
          </p>
        </div>

        {/* 3 Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev: any, idx: number) => (
            <div
              key={idx}
              className={`bg-white p-3 md:p-6 rounded-2xl border border-brand-border shadow-card flex-col justify-between relative group hover:-translate-y-0.5 transition-transform duration-200 ${idx >= 2 ? "hidden md:flex" : "flex"}`}
            >
              <Quote className="text-goat-primary/10 absolute top-5 right-5 group-hover:scale-105 transition-transform" size={36} />

              {/* Review Text */}
              <div className="space-y-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} weight="fill" size={16} className="text-[#F59E0B]" />
                  ))}
                </div>
                <div 
                  className="text-xs text-brand-gray leading-relaxed relative z-10 text-justify"
                  dangerouslySetInnerHTML={{ __html: rev.review }}
                />
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-3 pt-6 border-t border-brand-border mt-6">
                <div className="w-10 h-10 rounded-full bg-goat-tint text-goat-text font-bold text-sm flex items-center justify-center border border-goat-primary/10">
                  {rev.initial}
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black text-sm">{rev.name}</h3>
                  <p className="text-[10px] text-brand-gray mt-0.5 font-medium">{rev.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Strip */}
        <div className="pt-4">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 12s linear infinite;
            }
          `}</style>
          
          {/* Desktop View */}
          <div className="hidden sm:flex flex-wrap items-center justify-center gap-6">
            <span className="inline-flex shrink-0 items-center gap-2 bg-white px-4 py-2 rounded-full border border-brand-border text-brand-black font-semibold text-xs shadow-xs transition-colors hover:bg-neutral-50 cursor-default">
              <Users size={15} className="text-goat-primary shrink-0" />
              <span className="whitespace-nowrap">{settings.home_stat_1 || "500+ Happy Customers"}</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 bg-white px-4 py-2 rounded-full border border-brand-border text-brand-black font-semibold text-xs shadow-xs transition-colors hover:bg-neutral-50 cursor-default">
              <MapPin size={15} className="text-goat-primary shrink-0" />
              <span className="whitespace-nowrap">{settings.home_stat_2 || "Tamil Nadu Wide Goats"}</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 bg-white px-4 py-2 rounded-full border border-brand-border text-brand-black font-semibold text-xs shadow-xs transition-colors hover:bg-neutral-50 cursor-default">
              <ShieldCheck size={15} className="text-goat-primary shrink-0" />
              <span className="whitespace-nowrap">{settings.home_stat_3 || "Fresh Quality Guaranteed"}</span>
            </span>
          </div>

          {/* Mobile View - Marquee */}
          <div className="flex sm:hidden overflow-hidden whitespace-nowrap -mx-6 px-4 md:px-6 mask-image-gradient">
            <div className="flex animate-marquee gap-3 w-max">
              {[1, 2].map((i) => (
                <React.Fragment key={i}>
                  <span className="inline-flex shrink-0 items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-brand-border text-brand-black font-semibold text-[11px] shadow-xs cursor-default">
                    <Users size={15} className="text-goat-primary shrink-0" />
                    <span className="whitespace-nowrap">{settings.home_stat_1 || "500+ Happy Customers"}</span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-brand-border text-brand-black font-semibold text-[11px] shadow-xs cursor-default">
                    <MapPin size={15} className="text-goat-primary shrink-0" />
                    <span className="whitespace-nowrap">{settings.home_stat_2 || "Tamil Nadu Wide Goats"}</span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-brand-border text-brand-black font-semibold text-[11px] shadow-xs cursor-default">
                    <ShieldCheck size={15} className="text-goat-primary shrink-0" />
                    <span className="whitespace-nowrap">{settings.home_stat_3 || "Fresh Quality Guaranteed"}</span>
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
