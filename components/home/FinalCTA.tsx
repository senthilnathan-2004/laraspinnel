"use client";

import React from "react";
import Link from "next/link";
import { CalendarCheck } from "@phosphor-icons/react";

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
          <CalendarCheck size={36} weight="duotone" className="text-goat-primary" />
        </div>

        {/* Text */}
        <div className="space-y-2 max-w-xl">
          <h2 className="font-display text-2xl sm:text-5xl text-brand-black tracking-wide uppercase leading-tight">
            Ready to Order Fresh Quality Livestock?
          </h2>
          <p className="text-sm font-medium text-brand-gray">
            Book your live goats or fresh mutton packages online. Our team will contact you to verify details and arrange scheduling.
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
            /* Back wave (lighter green) */
            .water-btn::after {
              top: 35px; /* Sits near the bottom */
              background: rgba(22, 163, 74, 0.4);
              animation: spinWave 6s linear infinite;
            }
            /* Front wave (solid green) */
            .water-btn::before {
              top: 42px; /* Sits lower */
              background: rgba(22, 163, 74, 1); /* goat-primary */
              animation: spinWave 8s linear infinite;
            }
            
            /* Fill up on hover */
            .water-btn:hover::after {
              top: -200px;
            }
            .water-btn:hover::before {
              top: -180px;
            }

            @keyframes spinWave {
              0% { transform: translateX(-50%) rotate(0deg); }
              100% { transform: translateX(-50%) rotate(360deg); }
            }
          `}</style>
          
          <Link
            href="/book"
            className="water-btn inline-flex items-center justify-center text-white text-base font-semibold h-13 px-10 rounded-full transition-all duration-300 shadow hover:shadow-lg hover:scale-102 cursor-pointer"
          >
            Start Booking Now
          </Link>
        </div>
      </div>
    </section>
  );
}
