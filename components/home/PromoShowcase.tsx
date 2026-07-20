"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaCarouselType } from "embla-carousel";
import { useSettings } from "@/hooks/useSettings";
import { PromoCard, DEFAULT_PROMO_CARDS, getPromoCardColorClass, parseList } from "@/lib/siteContent";

const TWEEN_FACTOR_BASE = 0.84;

function numberWithinRange(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function PromoCardButton({ text, href }: { text: string; href: string }) {
  const className =
    "inline-flex items-center px-5 py-2.5 rounded-full bg-white text-brand-black text-xs font-bold uppercase tracking-wide shadow-sm hover:scale-105 active:scale-95 transition-transform";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {text}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {text}
    </a>
  );
}

export default function PromoShowcase() {
  const { settings } = useSettings();
  const cards = parseList<PromoCard>(settings.home_promo_cards, DEFAULT_PROMO_CARDS);

  const [prefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    prefersReducedMotion ? [] : [Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const tweenNodes = useRef<(HTMLElement | null)[]>([]);
  const tweenFactor = useRef(0);

  const setTweenNodes = useCallback((api: EmblaCarouselType) => {
    tweenNodes.current = api
      .slideNodes()
      .map((slideNode) => slideNode.querySelector<HTMLElement>(".promo-tween-target"));
  }, []);

  const setTweenFactor = useCallback((api: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback((api: EmblaCarouselType, eventName?: string) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const slidesInView = api.slidesInView();
    const isScrollEvent = eventName === "scroll";

    api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex] ?? [];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();
            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);
              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
            }
          });
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
        const scale = numberWithinRange(tweenValue, 0.72, 1);
        const rotateY = numberWithinRange(diffToTarget * 40, -40, 40);
        const opacity = numberWithinRange(tweenValue, 0.4, 1);
        const tweenNode = tweenNodes.current[slideIndex];
        if (tweenNode) {
          tweenNode.style.transform = `scale(${scale}) rotateY(${rotateY}deg)`;
          tweenNode.style.opacity = String(opacity);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!emblaApi || prefersReducedMotion) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenScale)
      .on("scroll", tweenScale)
      .on("slideFocus", tweenScale);
  }, [emblaApi, prefersReducedMotion, setTweenNodes, setTweenFactor, tweenScale]);

  if (cards.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div
          className="overflow-hidden"
          style={{ perspective: prefersReducedMotion ? undefined : "1400px" }}
          ref={emblaRef}
        >
          <div className="flex -mx-3">
            {cards.map((card, index) => (
              <div
                key={index}
                className="flex-[0_0_82%] sm:flex-[0_0_58%] md:flex-[0_0_42%] lg:flex-[0_0_32%] min-w-0 px-3"
              >
                <div className="promo-tween-target will-change-transform">
                  <div
                    className={`relative rounded-[28px] ${getPromoCardColorClass(
                      card.bgColor
                    )} p-6 h-96 sm:h-[28rem] lg:h-[32rem] overflow-hidden flex flex-col`}
                  >
                    <div className="relative z-10 space-y-4 w-full pr-2">
                      <h3 className="text-white font-display text-lg sm:text-xl leading-snug drop-shadow-sm truncate">
                        {card.title}
                      </h3>
                      {card.buttonText && card.buttonLink && (
                        <PromoCardButton text={card.buttonText} href={card.buttonLink} />
                      )}
                    </div>

                    {card.imageUrl && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[76%] aspect-square rounded-2xl overflow-hidden shadow-lg">
                        <Image
                          src={card.imageUrl}
                          alt={card.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 60vw, 320px"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
