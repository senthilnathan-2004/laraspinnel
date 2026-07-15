"use client";

import React from "react";
import { MagnifyingGlass, ClipboardText, Phone, Truck } from "@phosphor-icons/react";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Step 1: Browse Varieties",
      description: "Explore premium goats or custom bulk mutton packs.",
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
          <h2 className="font-display text-4xl text-brand-black tracking-wide uppercase">
            How Booking Works
          </h2>
          <p className="text-sm font-medium text-brand-gray">
            Order premium livestock or farm-fresh meat in four simple steps.
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
        `}</style>
        
        {/* Desktop & Tab View */}
        <div className="hidden md:grid grid-cols-4 gap-10 relative">
          {/* Connector Line (Desktop/Tab Only) */}
          <div className="absolute top-8 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-goat-primary/25 z-0"></div>

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center space-y-4 relative z-10 group"
            >
              <div className="w-16 h-16 rounded-full bg-goat-tint border border-goat-primary/10 flex items-center justify-center relative shadow-sm group-hover:scale-105 transition-transform duration-200">
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
        <div className="flex md:hidden overflow-hidden -mx-4 px-4 pt-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex animate-marquee-steps gap-12 w-max">
            {[1, 2].map((setIndex) => (
              <React.Fragment key={setIndex}>
                {steps.map((step, idx) => (
                  <div
                    key={`${setIndex}-${idx}`}
                    className="flex flex-col items-center text-center space-y-4 relative z-10 group shrink-0 w-[220px]"
                  >
                    <div className="w-16 h-16 rounded-full bg-goat-tint border border-goat-primary/10 flex items-center justify-center relative shadow-sm group-hover:scale-105 transition-transform duration-200">
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
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
