"use client";

import React from "react";
import { MagnifyingGlass, ClipboardText, Phone, Truck } from "@phosphor-icons/react";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Step 1: Browse Varieties",
      description: "Explore premium goats or bulk mutton packs.",
      icon: <MagnifyingGlass size={30} weight="duotone" className="text-goat-primary" />,
    },
    {
      number: "2",
      title: "Step 2: Select & Book",
      description: "Fill a quick, easy booking form in minutes.",
      icon: <ClipboardText size={30} weight="duotone" className="text-goat-primary" />,
    },
    {
      number: "3",
      title: "Step 3: We Call to Confirm",
      description: "Our farm team calls you to verify your order.",
      icon: <Phone size={30} weight="duotone" className="text-goat-primary" />,
    },
    {
      number: "4",
      title: "Step 4: Delivered Fresh",
      description: "Receive your order fresh, right on schedule.",
      icon: <Truck size={30} weight="duotone" className="text-goat-primary" />,
    },
  ];

  return (
    <section className="py-20 bg-brand-light-gray">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-display text-2xl md:text-4xl text-brand-black tracking-wide uppercase">
            How Booking Works
          </h2>
          <p className="text-sm font-medium text-brand-gray">
            Order premium livestock or farm fresh meat in four simple steps.
          </p>
        </div>

        <style>{`
          @keyframes marquee-steps {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-steps {
            animation: marquee-steps 20s linear infinite;
          }
          @keyframes dotMove {
            0% { left: 0%; opacity: 0; }
            5% { opacity: 1; }
            70% { opacity: 1; }
            75% { left: 100%; opacity: 0; }
            100% { left: 100%; opacity: 0; }
          }
          @keyframes iconZoom {
            0%, 20%, 100% { transform: scale(1); border-color: rgba(22, 163, 74, 0.1); box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
            5% { transform: scale(1.15); border-color: rgba(22, 163, 74, 1); box-shadow: 0 4px 15px rgba(22, 163, 74, 0.4); }
          }
          .animate-dot-move {
            animation: dotMove 12s linear infinite;
          }
          .animate-icon-zoom {
            animation: iconZoom 12s infinite;
          }
          
          /* Mobile specific animations (synced with 20s marquee) */
          .animate-dot-move-mobile {
            animation: dotMove 20s linear infinite;
          }
          .animate-icon-zoom-mobile {
            animation: iconZoom 20s infinite;
          }
        `}</style>

        {/* Desktop & Tab View */}
        <div className="hidden md:grid grid-cols-4 gap-10 relative">
          {/* Connector Line with Moving Dot */}
          <div className="absolute top-8 left-[12.5%] right-[12.5%] h-0.5 border-t-2 border-dashed border-goat-primary/25 z-0">
            <div className="absolute top-[-5px] w-2 h-2 rounded-full bg-goat-primary animate-dot-move shadow-[0_0_8px_rgba(22,163,74,0.8)]"></div>
          </div>

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center space-y-4 relative z-10 group"
            >
              <div
                className="w-16 h-16 rounded-full bg-goat-tint border border-goat-primary/10 flex items-center justify-center relative shadow-sm transition-transform duration-200 animate-icon-zoom"
                style={{ animationDelay: `${idx * 3}s` }}
              >
                {step.icon}
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-black text-white text-[10px] font-bold flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="font-semibold text-brand-black text-base">
                  {step.title}
                </h3>
                <p className="text-xs text-brand-gray leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View - Marquee */}
        <div className="flex md:hidden overflow-hidden -mx-4 px-4 pt-4 pb-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex animate-marquee-steps w-max" style={{ willChange: 'transform' }}>
            {[1, 2].map((setIndex) => (
              <div key={setIndex} className="flex gap-12 relative shrink-0 pr-12">
                {/* Connector Line with Moving Dot for Mobile */}
                <div className="absolute top-8 left-[110px] right-[158px] h-0.5 border-t-2 border-dashed border-goat-primary/25 z-0">
                  <div className="absolute top-[-5px] w-2 h-2 rounded-full bg-goat-primary animate-dot-move-mobile shadow-[0_0_8px_rgba(22,163,74,0.8)]" style={{ animationDelay: '-1.6s' }}></div>
                </div>

                {steps.map((step, idx) => (
                  <div
                    key={`${setIndex}-${idx}`}
                    className="flex flex-col items-center text-center space-y-4 relative z-10 group shrink-0 w-[220px]"
                  >
                    <div
                      className="w-16 h-16 rounded-full bg-goat-tint border border-goat-primary/10 flex items-center justify-center relative shadow-sm transition-transform duration-200 animate-icon-zoom-mobile"
                      style={{ animationDelay: `${(idx * 5) - 1.6}s` }}
                    >
                      {step.icon}
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-black text-white text-[10px] font-bold flex items-center justify-center">
                        {step.number}
                      </span>
                    </div>
                    <div className="space-y-1 max-w-xs whitespace-normal">
                      <h3 className="font-semibold text-brand-black text-base">
                        {step.title}
                      </h3>
                      <p className="text-xs text-brand-gray leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
