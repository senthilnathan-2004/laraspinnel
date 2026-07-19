"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative py-24 bg-brand-light-gray text-center border-t border-brand-border overflow-hidden">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10 z-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_50%)] [-webkit-mask-image:-webkit-radial-gradient(ellipse_at_center,transparent_20%,black_50%)]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40V0h40' fill='none' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E")`,
        }}
      ></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 space-y-6 flex flex-col items-center">
        {/* Decorative Top Icon */}
        <div className="w-16 h-16 rounded-full bg-goat-tint border border-goat-primary/10 flex items-center justify-center shadow-xs">
          <ShoppingBag size={30} className="text-goat-primary" />
        </div>

        {/* Text */}
        <div className="space-y-2 max-w-xl">
          <h2 className="font-display text-2xl sm:text-5xl text-brand-black tracking-wide uppercase leading-tight">
            Ready to Shop Handmade Gifts?
          </h2>
          <p className="text-sm font-medium text-brand-gray">
            Explore our handcrafted catalog of crochet flowers, personalized frames, keychains, and accessories. Custom orders are made with love.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <style>{`
            .water-btn {
              position: relative;
              overflow: hidden;
              z-index: 1;
              background: #111; /* brand-black */
              border: 1px solid rgba(255,255,255,0.1);
            }
            .water-btn::before, .water-btn::after {
              content: '';
              position: absolute;
              left: 50%;
              width: 600px;
              height: 600px;
              transform: translateX(-50%);
              border-radius: 40%;
              z-index: -1;
              transition: top 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            /* Back wave */
            .water-btn::after {
              top: 35px; /* Sits near the bottom */
              background: rgba(143, 168, 138, 0.4);
              animation: spinWave 6s linear infinite;
            }
            /* Front wave */
            .water-btn::before {
              top: 42px; /* Sits lower */
              background: rgba(143, 168, 138, 1); /* primary */
              animation: spinWave 8s linear infinite;
            }
            @keyframes spinWave {
              0% { transform: translateX(-50%) rotate(0deg); }
              100% { transform: translateX(-50%) rotate(360deg); }
            }
          `}</style>
          
          <Link
            href="/shop"
            className="water-btn inline-flex items-center justify-center px-8 py-3.5 rounded-full shadow-lg group hover:-translate-y-1 transition-all duration-300 text-white text-base font-semibold"
          >
            Start Shopping Now
          </Link>
        </div>
      </div>
    </section>
  );
}
