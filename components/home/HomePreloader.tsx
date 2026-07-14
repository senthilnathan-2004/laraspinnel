"use client";
import React, { useState, useEffect } from "react";

export default function HomePreloader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setLoading(false);

    window.addEventListener("banner-loaded", handleLoad);

    // Fallback just in case some resources hang
    const timeout = setTimeout(() => setLoading(false), 3000);

    return () => {
      window.removeEventListener("banner-loaded", handleLoad);
      clearTimeout(timeout);
    };
  }, []);

  const farmName = "RAGU FARM";

  return (
    <>
      <div 
        className={`fixed inset-0 bg-white flex flex-col items-center justify-center min-h-screen transition-opacity duration-700 ease-in-out ${
          loading ? "opacity-100 z-[9999]" : "opacity-0 -z-10 pointer-events-none"
        }`}
      >
          <div className="relative flex flex-col items-center justify-center">
            {/* Outer Pulsing Effect */}
            <div className="absolute w-32 h-32 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] bg-goat-primary/20" />
            
            {/* Spinning Elegant Ring */}
            <div className="absolute w-36 h-36 border-4 border-transparent border-t-goat-primary border-r-goat-primary rounded-full animate-spin" />
            <div className="absolute w-36 h-36 border-4 border-brand-light-gray/30 rounded-full" />
            
            {/* Logo Container */}
            <div className="relative z-10 w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden p-4">
                 <span className="font-display text-2xl tracking-wider text-brand-black uppercase text-center leading-none">
                   {farmName}
                 </span>
            </div>
          </div>
          
          <div className="mt-14 flex flex-col items-center gap-2">
            <p className="text-sm font-bold text-goat-primary tracking-[0.3em] uppercase">
              Loading
            </p>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-goat-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-goat-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-goat-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      <div className={`transition-opacity duration-700 ${loading ? "opacity-0 h-screen overflow-hidden" : "opacity-100 h-auto"}`}>
        {children}
      </div>
    </>
  );
}
