import React from "react";

interface TextMarqueeProps {
  items: string[];
  bgColor?: string;
  textColor?: string;
  dividerColor?: string;
}

export default function TextMarquee({ 
  items, 
  bgColor = "bg-brand-black", 
  textColor = "text-white",
  dividerColor = "text-white/30"
}: TextMarqueeProps) {
  return (
    <div className={`overflow-hidden py-5 flex items-center border-y border-brand-border/10 ${bgColor}`}>
      <style>{`
        @keyframes marquee-text {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-text {
          animation: marquee-text 25s linear infinite;
        }
        .animate-marquee-text:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="flex animate-marquee-text whitespace-nowrap w-max items-center">
        {[1, 2].map((setIndex) => (
          <div key={setIndex} className="flex items-center">
            {items.map((item, idx) => (
              <div key={`${setIndex}-${idx}`} className="flex items-center">
                <span className={`font-display text-2xl sm:text-3xl tracking-widest uppercase mx-8 ${textColor}`}>
                  {item}
                </span>
                <span className={`text-2xl ${dividerColor}`}>✦</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
