"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { hexToRgba } from "@/lib/utils";

const SPRINKLE_COUNT = 20;

export default function Sprinkles({ colorHex }: { colorHex: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem] z-10">
      {[...Array(SPRINKLE_COUNT)].map((_, i) => {
        const randomX = Math.random() * 100;
        const randomDelay = Math.random() * 5;
        const randomDuration = 4 + Math.random() * 4; // 4 to 8 seconds fall
        const size = Math.random() > 0.5 ? 4 : 6;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: colorHex,
              boxShadow: `0 0 10px ${hexToRgba(colorHex, 0.8)}, 0 0 20px ${hexToRgba(colorHex, 0.4)}`,
              left: `${randomX}%`,
            }}
            initial={{ top: "-10%", opacity: 0 }}
            animate={{
              top: ["-10%", "110%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: randomDuration,
              repeat: Infinity,
              delay: randomDelay,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
}
