"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { hexToRgba } from "@/lib/utils";

const PAPER_COUNT = 30;

export default function FloatingPaper({ colorHex }: { colorHex: string }) {
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem] z-10 perspective-1000">
      {isInView && [...Array(PAPER_COUNT)].map((_, i) => {
        // Randomize burst initial properties
        const randomX = Math.random() * 100; // Final horizontal position
        const startX = 50 + (Math.random() * 20 - 10); // Start near center horizontal
        const startY = 110; // Start below the container
        const finalY = -10 - Math.random() * 40; // Fly upwards then fall? Or crash downwards?
        // Let's do a burst from the center "crashing" outwards
        
        const randomScale = 0.3 + Math.random() * 0.9;
        const randomRotation = Math.random() * 720; // Multiple spins
        const delay = Math.random() * 0.4; // Quick burst
        
        const isSmall = Math.random() > 0.5;

        return (
          <motion.div
            key={i}
            initial={{
              left: `${startX}%`,
              top: `${100 + Math.random() * 20}%`, // Start slightly off bottom
              scale: 0,
              rotate: 0,
              opacity: 0,
            }}
            animate={{
              top: [`${100}%`, `${-20 + Math.random() * 80}%`, `${120}%`], // Burst up then fall down
              left: [`${startX}%`, `${randomX}%`, `${randomX + (Math.random() * 40 - 20)}%`], 
              rotate: [0, randomRotation, randomRotation + 720 * (Math.random() > 0.5 ? 1 : -1)], // Spin wildly
              scale: [0, randomScale, randomScale],
              opacity: [0, 1, 0.8, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              ease: [0.2, 0.8, 0.2, 1], // Spring-like burst out
              times: [0, 0.2, 1], // Peak height quickly, fall slowly
              repeat: Infinity,
              repeatDelay: 1 + Math.random() * 3, // Repeat bursts occasionally
              delay: delay,
            }}
            className={`absolute ${isSmall ? 'w-3 h-4' : 'w-5 h-7'} rounded-[2px] shadow-sm backdrop-blur-md`}
            style={{
              backgroundColor: hexToRgba(colorHex, 0.25),
              border: `1px solid ${hexToRgba(colorHex, 0.4)}`,
              boxShadow: `0 10px 30px ${hexToRgba(colorHex, 0.2)}, inset 0 0 10px rgba(255,255,255,0.6)`,
            }}
          />
        );
      })}
    </div>
  );
}
