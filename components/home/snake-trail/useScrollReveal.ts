"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger, ensureScrollTriggerRegistered } from "./gsapSetup";

export function useScrollReveal<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    ensureScrollTriggerRegistered();

    gsap.set(el, { opacity: 0, y: 16, scale: 0.98 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return ref;
}
