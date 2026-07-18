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

      {/* Decorative Animated Low-Poly Goat (Center Watermark Extended) */}
      <div className="absolute inset-0 m-auto flex items-center justify-center pointer-events-none opacity-[0.06] z-0 overflow-hidden">
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className="w-full h-full text-brand-black animate-wireframe-draw" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="bevel">
          <g>
            {/* Extended Left Wings */}
            <polygon points="140,10 50,50 120,75" />
            <polygon points="120,75 50,50 50,110" />
            <polygon points="120,75 50,110 155,95" />
            <polygon points="50,50 0,20 0,80" />
            <polygon points="50,50 0,80 50,110" />
            <polygon points="50,110 0,80 0,140" />

            {/* Central Goat Head */}
            <polygon points="170,45 230,45 200,90" />
            <polygon points="170,45 140,10 185,45" />
            <polygon points="230,45 260,10 215,45" />
            <polygon points="170,45 200,90 165,80" />
            <polygon points="230,45 200,90 235,80" />
            <polygon points="165,80 200,90 185,150" />
            <polygon points="235,80 200,90 215,150" />
            <polygon points="165,80 120,75 155,95" />
            <polygon points="235,80 280,75 245,95" />
            <polygon points="165,80 185,150 155,95" />
            <polygon points="235,80 215,150 245,95" />
            <polygon points="185,150 215,150 200,160" />
            <polygon points="185,150 200,160 200,175" />
            <polygon points="215,150 200,160 200,175" />

            {/* Extended Right Wings */}
            <polygon points="260,10 350,50 280,75" />
            <polygon points="280,75 350,50 350,110" />
            <polygon points="280,75 350,110 245,95" />
            <polygon points="350,50 400,20 400,80" />
            <polygon points="350,50 400,80 350,110" />
            <polygon points="350,110 400,80 400,140" />
          </g>
        </svg>
      </div>
      
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
            
            /* Back wave (lighter green) */
            .water-btn::after {
              top: 35px; /* Sits near the bottom */
              background: rgba(22, 163, 74, 0.4);
              animation: spinWave 6s linear infinite;
            }
            @keyframes spinWave {
              0% { transform: translateX(-50%) rotate(0deg); }
              100% { transform: translateX(-50%) rotate(360deg); }
            }
            .animate-wireframe-draw polygon {
              stroke-dasharray: 200;
              stroke-dashoffset: 200;
              animation: drawWireframe 4s ease-in-out infinite alternate;
            }
            .animate-wireframe-draw polygon:nth-child(even) {
              animation-delay: 0.5s;
            }
            @keyframes drawWireframe {
              0% { stroke-dashoffset: 200; fill: transparent; }
              40% { stroke-dashoffset: 0; fill: transparent; }
              100% { stroke-dashoffset: 0; fill: rgba(0, 0, 0, 0.05); }
            }
          `}</style>
          
          <Link
            href="/book"
            className="water-btn inline-flex items-center justify-center px-8 py-3.5 rounded-full shadow-lg group hover:-translate-y-1 transition-all duration-300 text-white text-base font-semibold"
          >
            Start Booking Now
          </Link>
        </div>
      </div>
    </section>
  );
}
