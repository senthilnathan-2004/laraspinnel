"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function PhilosophyContent({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if content overflows the container's max-height
    if (contentRef.current) {
      if (contentRef.current.scrollHeight > contentRef.current.clientHeight) {
        setShowToggle(true);
      }
    }
  }, [content]);

  return (
    <div className="flex flex-col">
      <div className="relative">
        <div 
          ref={contentRef}
          className={`space-y-6 relative z-10 max-w-none prose prose-sm md:prose-base prose-p:text-brand-gray prose-a:text-goat-primary [&_:is(h1,h2,h3,h4,h5,h6)]:!text-xl md:[&_:is(h1,h2,h3,h4,h5,h6)]:!text-2xl [&_:is(h1,h2,h3,h4,h5,h6)]:!font-bold [&_:is(h1,h2,h3,h4,h5,h6)]:!text-brand-black [&_:is(h1,h2,h3,h4,h5,h6)]:!mt-8 [&_:is(h1,h2,h3,h4,h5,h6)]:!mb-4 transition-all duration-500 overflow-hidden ${
            !isExpanded ? "max-h-[300px] lg:max-h-[400px]" : "max-h-[5000px]"
          }`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        
        {/* Sleek Apple-style Frosted Glass Fade */}
        {!isExpanded && showToggle && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent backdrop-blur-[2px] z-20 pointer-events-none [mask-image:linear-gradient(to_top,black_50%,transparent)]" />
        )}
      </div>

      {/* Toggle Button (Hidden if content fits entirely) */}
      {showToggle && (
        <div className={`flex justify-center relative z-30 transition-all duration-500 ${!isExpanded ? '-mt-6' : 'mt-8'}`}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="group flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200/50 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.12)] text-brand-black text-sm font-semibold tracking-wide hover:bg-white hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.18)] active:scale-95 transition-all duration-300 ease-out"
          >
            {isExpanded ? "Show Less" : "Read Full Story"}
            <span className={`w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center transition-all duration-300 ${isExpanded ? 'rotate-180' : 'group-hover:bg-brand-black group-hover:text-white group-hover:translate-y-0.5'}`}>
              <ChevronDown size={14} className={isExpanded ? "text-brand-black" : "text-brand-black group-hover:text-white transition-colors duration-300"} />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
