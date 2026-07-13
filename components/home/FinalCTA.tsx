"use client";

import React from "react";
import Link from "next/link";
import { CalendarCheck } from "@phosphor-icons/react";

export default function FinalCTA() {
  return (
    <section className="py-24 bg-white text-center border-t border-brand-border">
      <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-6 flex flex-col items-center">
        {/* Decorative Top Icon */}
        <div className="w-16 h-16 rounded-full bg-goat-tint border border-goat-primary/10 flex items-center justify-center shadow-xs">
          <CalendarCheck size={36} weight="duotone" className="text-goat-primary" />
        </div>

        {/* Text */}
        <div className="space-y-2 max-w-xl">
          <h2 className="font-display text-4xl sm:text-5xl text-brand-black tracking-wide uppercase leading-tight">
            Ready to Order Fresh Quality Livestock?
          </h2>
          <p className="text-sm font-medium text-brand-gray">
            Book your live goats or fresh mutton packages online. Our team will contact you to verify details and arrange scheduling.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link
            href="/book"
            className="inline-flex items-center justify-center bg-brand-black hover:bg-goat-primary text-white text-base font-semibold h-13 px-10 rounded-full transition-all duration-300 shadow hover:shadow-lg hover:scale-102 cursor-pointer"
          >
            Start Booking Now
          </Link>
        </div>
      </div>
    </section>
  );
}
