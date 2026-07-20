# Promo Showcase Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an infinite, auto-scrolling, 3D "coverflow" carousel of admin-editable promo cards (image + title + Buy Now button) directly below the Testimonials section on the homepage.

**Architecture:** Reuse the existing `SiteSettings` key/value content system (same mechanism already powering the Marquee/Why-Choose-Us/Footer lists on the "Website Content" admin page) — no new DB model or API routes. A new settings key `home_promo_cards` stores a JSON array of card objects. The public carousel is built on the project's existing `embla-carousel-react` + `embla-carousel-autoplay` dependencies, with a scroll-progress-driven tween applied per slide to produce the tilt/scale "coverflow" effect.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, `embla-carousel-react` / `embla-carousel-autoplay` (already installed), Mongoose `SiteSettings` model (already existing), SWR (`useSettings` hook, already existing).

## Global Constraints

- Full spec: `docs/superpowers/specs/2026-07-20-promo-showcase-design.md` — every task below implements a section of it.
- No new database collection, model, or API route — everything rides on the existing `SiteSettings` key/value store and its existing `/api/settings` (public GET) and `/api/admin/settings` (admin GET/PUT) routes.
- This repo has **no automated test framework** (no jest/vitest/playwright config or test directories anywhere in the project) — do not introduce one for this feature. Verification is `npm run lint`, a manual `npm run dev` browser walkthrough, and an admin content round-trip check, matching how every other feature in this codebase is verified (there are no `*.test.*` files to model against).
- Follow existing code conventions exactly: Tailwind utility classes and brand color tokens already defined in `app/globals.css` (`goat`, `mutton`, `gold`, `rose`, `brown` — each with `-primary`/`-tint`/`-hover`/`-text` variants), the `brand-black`/`brand-gray`/`brand-border`/`brand-light-gray` neutrals, and the `font-display` heading font.
- Respect `prefers-reduced-motion`: no autoplay and no 3D tilt for users who have it enabled.
- Card images upload through the existing `ImageUploader` component (`components/admin/ImageUploader.tsx`) which already posts to `/api/admin/upload` (ImageKit) — do not build a new upload path.

---

### Task 1: Promo card data types, defaults, and color palette

**Files:**
- Modify: `lib/siteContent.ts`

**Interfaces:**
- Produces: `export interface PromoCard { imageUrl: string; title: string; buttonText: string; buttonLink: string; bgColor: string }`, `export interface PromoCardColorOption { key: string; label: string; className: string }`, `export const PROMO_CARD_COLORS: PromoCardColorOption[]`, `export const DEFAULT_PROMO_CARDS: PromoCard[]`, `export function getPromoCardColorClass(key: string): string`.
- Consumes: nothing new (uses existing `parseList` already in this file).

- [ ] **Step 1: Add the `PromoCard` interface next to the other content interfaces**

In `lib/siteContent.ts`, find:

```ts
export interface WhyStep {
  title: string;
  desc: string;
}
```

Replace with:

```ts
export interface WhyStep {
  title: string;
  desc: string;
}
export interface PromoCard {
  imageUrl: string;
  title: string;
  buttonText: string;
  buttonLink: string;
  bgColor: string;
}
export interface PromoCardColorOption {
  key: string;
  label: string;
  className: string;
}
```

- [ ] **Step 2: Add the color palette, default cards, and lookup helper**

In `lib/siteContent.ts`, find:

```ts
/* ---- Home: below-fold marquee items ---- */
export const DEFAULT_MARQUEE_ITEMS: string[] = [
  "Crochet Bouquets",
  "Custom Frames",
  "Baby Plushies",
  "Desk Decor",
  "Keychains",
  "Festive Rakhis",
  "Gifts Under ₹999",
];

/* ---- Footer link columns ---- */
```

Replace with:

```ts
/* ---- Home: below-fold marquee items ---- */
export const DEFAULT_MARQUEE_ITEMS: string[] = [
  "Crochet Bouquets",
  "Custom Frames",
  "Baby Plushies",
  "Desk Decor",
  "Keychains",
  "Festive Rakhis",
  "Gifts Under ₹999",
];

/* ---- Home: Promo Showcase rotating cards (below Testimonials) ---- */
export const PROMO_CARD_COLORS: PromoCardColorOption[] = [
  { key: "goat", label: "Sage Green", className: "bg-goat-primary" },
  { key: "gold", label: "Golden Cream", className: "bg-gold-primary" },
  { key: "mutton", label: "Terracotta", className: "bg-mutton-primary" },
  { key: "rose", label: "Blush Rose", className: "bg-rose-primary" },
  { key: "brown", label: "Cocoa Brown", className: "bg-brown-primary" },
];

export function getPromoCardColorClass(key: string): string {
  return (
    PROMO_CARD_COLORS.find((c) => c.key === key)?.className ??
    PROMO_CARD_COLORS[0].className
  );
}

export const DEFAULT_PROMO_CARDS: PromoCard[] = [
  {
    imageUrl: "/placeholder-goat.jpg",
    title: "Crochet Flower Bouquets",
    buttonText: "Buy Now",
    buttonLink: "/shop?category=bouquets",
    bgColor: "goat",
  },
  {
    imageUrl: "/placeholder-mutton.jpg",
    title: "Custom Crochet Frames",
    buttonText: "Buy Now",
    buttonLink: "/shop?category=customized-frames",
    bgColor: "gold",
  },
  {
    imageUrl: "/placeholder-goat.jpg",
    title: "Amigurumi Gift Hampers",
    buttonText: "Buy Now",
    buttonLink: "/shop?category=hampers",
    bgColor: "rose",
  },
];

/* ---- Footer link columns ---- */
```

- [ ] **Step 3: Verify the file still type-checks and lints**

Run: `npm run lint -- lib/siteContent.ts`
Expected: No errors (warnings, if any, must not reference `lib/siteContent.ts`).

- [ ] **Step 4: Commit**

```bash
git add lib/siteContent.ts
git commit -m "feat: add PromoCard type, defaults, and color palette to site content"
```

---

### Task 2: Admin list editor for promo cards

**Files:**
- Modify: `components/admin/ContentEditors.tsx`

**Interfaces:**
- Consumes: `PromoCard`, `PROMO_CARD_COLORS` from `lib/siteContent.ts` (Task 1). `ImageUploader` default export from `components/admin/ImageUploader.tsx` (props: `images: string[]`, `onChange: (images: string[]) => void`, `multiple?: boolean`, `label?: string` — already existing, used elsewhere in this same file via `ImageField`).
- Produces: `export function PromoCardListEditor({ items, onChange }: { items: PromoCard[]; onChange: (items: PromoCard[]) => void })`.

- [ ] **Step 1: Import the new types**

In `components/admin/ContentEditors.tsx`, find:

```tsx
"use client";

import React from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
```

Replace with:

```tsx
"use client";

import React from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { PromoCard, PROMO_CARD_COLORS } from "@/lib/siteContent";
```

- [ ] **Step 2: Append the `PromoCardListEditor` component at the end of the file**

In `components/admin/ContentEditors.tsx`, the file currently ends with the closing brace of `ListEditor` (the last line is `}` closing that function, right after its final `</div>` return). Append this new component after that closing brace:

```tsx

/* ---------------- Promo Showcase card list editor ---------------- */

export function PromoCardListEditor({
  items,
  onChange,
}: {
  items: PromoCard[];
  onChange: (items: PromoCard[]) => void;
}) {
  const blankItem = (): PromoCard => ({
    imageUrl: "",
    title: "",
    buttonText: "Buy Now",
    buttonLink: "",
    bgColor: PROMO_CARD_COLORS[0].key,
  });

  const update = (index: number, next: PromoCard) => {
    const copy = [...items];
    copy[index] = next;
    onChange(copy);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  };

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, blankItem()]);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-brand-black uppercase tracking-wider block">
          Promo Cards
        </label>
        <span className="text-[10px] font-semibold text-brand-gray">
          {items.length} {items.length === 1 ? "card" : "cards"}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2 p-3 bg-brand-light-gray/30 border border-brand-border rounded-xl"
          >
            <div className="flex flex-col gap-1 pt-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="p-1 text-brand-gray hover:text-brand-black disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowUp size={13} />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Move down"
                className="p-1 text-brand-gray hover:text-brand-black disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowDown size={13} />
              </button>
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              <ImageUploader
                images={item.imageUrl ? [item.imageUrl] : []}
                onChange={(imgs) => update(index, { ...item, imageUrl: imgs[0] || "" })}
                multiple={false}
                label="Card Image"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => update(index, { ...item, title: e.target.value })}
                  placeholder="Card title, e.g. Crochet Flower Bouquets"
                  className="w-full h-10 px-3 bg-white border border-brand-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-goat-primary transition-all"
                />
                <input
                  type="text"
                  value={item.buttonText}
                  onChange={(e) => update(index, { ...item, buttonText: e.target.value })}
                  placeholder="Button text, e.g. Buy Now"
                  className="w-full h-10 px-3 bg-white border border-brand-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-goat-primary transition-all"
                />
                <input
                  type="text"
                  value={item.buttonLink}
                  onChange={(e) => update(index, { ...item, buttonLink: e.target.value })}
                  placeholder="Button link, e.g. /shop?category=bouquets"
                  className="sm:col-span-2 w-full h-10 px-3 bg-white border border-brand-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-goat-primary transition-all"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-brand-gray uppercase tracking-wider">
                  Background
                </span>
                {PROMO_CARD_COLORS.map((color) => (
                  <button
                    key={color.key}
                    type="button"
                    onClick={() => update(index, { ...item, bgColor: color.key })}
                    aria-label={color.label}
                    title={color.label}
                    className={`w-7 h-7 rounded-full ${color.className} border-2 transition-all ${
                      item.bgColor === color.key ? "border-brand-black scale-110" : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              aria-label="Remove card"
              className="shrink-0 p-1.5 mt-0.5 text-brand-gray hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-xs text-brand-gray italic px-1 py-2">No promo cards yet — add one below.</p>
        )}
      </div>

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-goat-primary hover:text-goat-hover border border-dashed border-goat-primary/40 hover:border-goat-primary rounded-lg px-3 py-2 transition-colors"
      >
        <Plus size={14} /> Add promo card
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Verify it lints clean**

Run: `npm run lint -- components/admin/ContentEditors.tsx`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add components/admin/ContentEditors.tsx
git commit -m "feat: add PromoCardListEditor for admin promo card management"
```

---

### Task 3: Wire the Promo Showcase section into the Website Content admin page

**Files:**
- Modify: `app/admin/content/page.tsx`

**Interfaces:**
- Consumes: `PromoCardListEditor` from `components/admin/ContentEditors.tsx` (Task 2), `PromoCard` and `DEFAULT_PROMO_CARDS` from `lib/siteContent.ts` (Task 1), and this page's existing `listVal<T>(key, fallback)` / `setListVal<T>(key, arr)` helpers (already defined in this file, unchanged).
- Produces: nothing new for other tasks — this is a leaf UI wiring task.

- [ ] **Step 1: Import the new pieces**

In `app/admin/content/page.tsx`, find:

```tsx
import {
  TextField,
  TextAreaField,
  ImageField,
  ListEditor,
  ListFieldDef,
} from "@/components/admin/ContentEditors";
import {
  CONTENT_DEFAULTS,
  CONTENT_PLACEHOLDERS,
  DEFAULT_WHY_STEPS,
  DEFAULT_MARQUEE_ITEMS,
  DEFAULT_FOOTER_QUICKLINKS,
  DEFAULT_FOOTER_CATEGORIES,
  DEFAULT_FOOTER_BADGES,
  parseList,
  WhyStep,
  LinkItem,
} from "@/lib/siteContent";
```

Replace with:

```tsx
import {
  TextField,
  TextAreaField,
  ImageField,
  ListEditor,
  ListFieldDef,
  PromoCardListEditor,
} from "@/components/admin/ContentEditors";
import {
  CONTENT_DEFAULTS,
  CONTENT_PLACEHOLDERS,
  DEFAULT_WHY_STEPS,
  DEFAULT_MARQUEE_ITEMS,
  DEFAULT_FOOTER_QUICKLINKS,
  DEFAULT_FOOTER_CATEGORIES,
  DEFAULT_FOOTER_BADGES,
  DEFAULT_PROMO_CARDS,
  parseList,
  WhyStep,
  LinkItem,
  PromoCard,
} from "@/lib/siteContent";
```

- [ ] **Step 2: Add the "Promo Showcase" section between Testimonials and Scrolling Marquee**

In `app/admin/content/page.tsx`, find:

```tsx
                <p className="text-[10px] text-brand-gray">The reviews themselves are managed under Testimonials in the sidebar.</p>
              </Section>

              <Section title="Scrolling Marquee">
```

Replace with:

```tsx
                <p className="text-[10px] text-brand-gray">The reviews themselves are managed under Testimonials in the sidebar.</p>
              </Section>

              <Section title="Promo Showcase — rotating cards below reviews">
                <PromoCardListEditor
                  items={listVal<PromoCard>("home_promo_cards", DEFAULT_PROMO_CARDS)}
                  onChange={(arr) => setListVal("home_promo_cards", arr)}
                />
                <p className="text-[10px] text-brand-gray">
                  These cards auto-scroll in a 3D rotating carousel on the homepage, directly below the
                  customer reviews section.
                </p>
              </Section>

              <Section title="Scrolling Marquee">
```

- [ ] **Step 3: Verify it lints clean**

Run: `npm run lint -- app/admin/content/page.tsx`
Expected: No errors.

- [ ] **Step 4: Manual check — admin UI renders and saves**

Run: `npm run dev`, then in a browser go to `/admin/content`, open the "Home" tab.
Expected: A "Promo Showcase — rotating cards below reviews" section appears between "Testimonials — heading & stats" and "Scrolling Marquee", pre-filled with the 3 default cards (image thumbnail, title, "Buy Now" text, a link, and a highlighted color swatch). Click "Add promo card", fill in a title, and click "Save Changes" at the top — expect the success toast "Content saved. Your public site is updated." and no console errors.

- [ ] **Step 5: Commit**

```bash
git add app/admin/content/page.tsx
git commit -m "feat: wire Promo Showcase editor into Website Content admin page"
```

---

### Task 4: Public Promo Showcase carousel component

**Files:**
- Create: `components/home/PromoShowcase.tsx`

**Interfaces:**
- Consumes: `useSettings()` from `hooks/useSettings.ts` (returns `{ settings: Record<string, string>, error, isLoading }`, already existing). `PromoCard`, `DEFAULT_PROMO_CARDS`, `getPromoCardColorClass`, `parseList` from `lib/siteContent.ts` (Task 1). `useEmblaCarousel` from `embla-carousel-react` and `Autoplay` from `embla-carousel-autoplay` (already project dependencies, already used identically in `components/home/HeroSlider.tsx`).
- Produces: `export default function PromoShowcase(): JSX.Element | null` — a self-contained section with no props, consumed by Task 5.

- [ ] **Step 1: Create the component file**

Create `components/home/PromoShowcase.tsx`:

```tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
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

  const setTweenNodes = useCallback((api: any) => {
    tweenNodes.current = api.slideNodes().map((slideNode: HTMLElement) =>
      slideNode.querySelector(".promo-tween-target")
    );
  }, []);

  const setTweenFactor = useCallback((api: any) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback((api: any, eventName?: string) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const slidesInView = api.slidesInView();
    const isScrollEvent = eventName === "scroll";

    api.scrollSnapList().forEach((scrollSnap: number, snapIndex: number) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry?.[snapIndex] ?? [];

      slidesInSnap.forEach((slideIndex: number) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper?.loopPoints?.forEach((loopItem: any) => {
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
    <section className="py-16 md:py-20 bg-brand-light-gray/40 overflow-hidden">
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
                    )} p-6 h-72 sm:h-80 overflow-visible flex flex-col`}
                  >
                    <div className="relative z-10 space-y-4 max-w-[60%]">
                      <h3 className="text-white font-display text-lg sm:text-xl leading-snug drop-shadow-sm">
                        {card.title}
                      </h3>
                      {card.buttonText && card.buttonLink && (
                        <PromoCardButton text={card.buttonText} href={card.buttonLink} />
                      )}
                    </div>

                    {card.imageUrl && (
                      <div className="absolute bottom-0 right-1 w-[65%] h-[75%] translate-y-3">
                        <Image
                          src={card.imageUrl}
                          alt={card.title}
                          fill
                          className="object-contain object-bottom drop-shadow-2xl"
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
```

- [ ] **Step 2: Verify it lints clean**

Run: `npm run lint -- components/home/PromoShowcase.tsx`
Expected: No errors. (`any` usage here mirrors the existing pattern already accepted in `components/home/HeroSlider.tsx`'s embla callbacks, so it must not introduce a new failure.)

- [ ] **Step 3: Commit**

```bash
git add components/home/PromoShowcase.tsx
git commit -m "feat: add PromoShowcase 3D coverflow auto-scroll carousel"
```

---

### Task 5: Render Promo Showcase on the homepage, below Testimonials

**Files:**
- Modify: `components/home/BelowFoldSections.tsx`

**Interfaces:**
- Consumes: `PromoShowcase` default export from `components/home/PromoShowcase.tsx` (Task 4).
- Produces: nothing new — this is the final integration point.

- [ ] **Step 1: Add the dynamic import**

In `components/home/BelowFoldSections.tsx`, find:

```tsx
const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
  ssr: false,
  loading: () => <div className="min-h-[300px]" />,
});

const TextMarquee = dynamic(() => import("@/components/home/TextMarquee"), {
  ssr: false,
  loading: () => <div className="min-h-[48px]" />,
});
```

Replace with:

```tsx
const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
  ssr: false,
  loading: () => <div className="min-h-[300px]" />,
});

const PromoShowcase = dynamic(() => import("@/components/home/PromoShowcase"), {
  ssr: false,
  loading: () => <div className="min-h-[320px]" />,
});

const TextMarquee = dynamic(() => import("@/components/home/TextMarquee"), {
  ssr: false,
  loading: () => <div className="min-h-[48px]" />,
});
```

- [ ] **Step 2: Render it between Testimonials and the marquee**

In `components/home/BelowFoldSections.tsx`, find:

```tsx
      {/* Customer Testimonials */}
      <Testimonials />

      {/* Gift Categories / Marketing Marquee */}
      <TextMarquee
```

Replace with:

```tsx
      {/* Customer Testimonials */}
      <Testimonials />

      {/* Promo Showcase — rotating auto-scroll cards */}
      <PromoShowcase />

      {/* Gift Categories / Marketing Marquee */}
      <TextMarquee
```

- [ ] **Step 3: Verify it lints clean**

Run: `npm run lint -- components/home/BelowFoldSections.tsx`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add components/home/BelowFoldSections.tsx
git commit -m "feat: render PromoShowcase on homepage below Testimonials"
```

---

### Task 6: End-to-end verification

**Files:** none (verification only).

**Interfaces:** none.

- [ ] **Step 1: Full lint pass**

Run: `npm run lint`
Expected: No errors anywhere in the repo (pre-existing warnings unrelated to these 5 files are acceptable; nothing new from the files touched in Tasks 1–5).

- [ ] **Step 2: Homepage visual check**

Run: `npm run dev`, open `http://localhost:3000/` in a browser, scroll to just below the customer reviews section.
Expected: The Promo Showcase carousel is visible, auto-scrolling continuously and looping without a visible jump; the centered card is flat/full-size while cards to either side are visibly tilted (`rotateY`) and slightly scaled down, matching the reference "coverflow" look. Each card shows its image, title, and a "Buy Now" pill button.

- [ ] **Step 3: Responsive check**

In the browser dev tools, switch to a mobile viewport (e.g. 375px wide) and a tablet viewport (e.g. 768px wide).
Expected: On mobile, one card is centered with the neighboring cards peeking at the edges; on tablet/desktop, more cards are visible per the `sm:`/`md:`/`lg:` breakpoints in `PromoShowcase.tsx`. No horizontal page overflow/scrollbar is introduced at any width.

- [ ] **Step 4: Interaction check**

Manually drag/swipe the carousel left and right.
Expected: It responds to the drag immediately, then resumes auto-scrolling a couple of seconds after you release (from the `stopOnInteraction: false` Autoplay option).

- [ ] **Step 5: Admin content round-trip**

Go to `/admin/content` → Home tab → "Promo Showcase" section. Add a new card (upload an image, set title "Test Card", button text "Buy Now", button link `/shop`, pick a color swatch), click "Save Changes", then open the homepage in a new tab.
Expected: The new "Test Card" appears live in the carousel. Reorder two cards using the up/down arrows and save — expect the homepage order to change to match. Delete the test card and save — expect it to disappear from the homepage.

- [ ] **Step 6: Empty-state check**

In `/admin/content` → Home tab → "Promo Showcase", remove every card so the list is empty, then click "Save Changes". Reload the homepage.
Expected: The Promo Showcase section is entirely absent from the homepage (no empty carousel shell, no layout gap beyond normal section spacing) — confirming the `if (cards.length === 0) return null;` guard in `PromoShowcase.tsx` works. Afterwards, re-add at least one card (or leave the settings key cleared so `DEFAULT_PROMO_CARDS` applies) so the homepage isn't left empty.

- [ ] **Step 7: Reduced-motion check**

In the browser dev tools, enable "Emulate CSS media feature prefers-reduced-motion: reduce" (Chrome: Rendering tab), then reload the homepage.
Expected: The carousel no longer auto-scrolls and cards no longer tilt in 3D (all render flat/full-scale); manual swipe/drag still works.

No commit for this task — it is verification only. If any expectation fails, fix the relevant task's file, re-run that task's own lint step, then re-run this task's steps from the top.
