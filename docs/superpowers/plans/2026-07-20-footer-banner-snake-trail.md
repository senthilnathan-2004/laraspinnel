# Footer Banner Snake-Trail Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a premium, GSAP-driven, infinitely-looping "snake trail" animation to the mobile/tablet footer promo banner (`components/home/FooterBanner.tsx`) that dips outside the card and back in, appears to pass behind the card edge and two new small decorative accents, emits soft sparkle particles, and respects `prefers-reduced-motion`, without touching the existing banner image, `CardDecoration`, layout, or desktop code paths.

**Architecture:** A masked "triple path copy" SVG technique creates the depth illusion (outside-card / inside-card / above-accent), driven by one shared GSAP timeline that chains 8 eased arc tweens over a hand-authored closed bezier loop (built by a small pure Catmull-Rom-to-bezier helper, so consecutive arcs always meet with matching tangents). A synced comet-tail (`stroke-dashoffset`) and a small pooled sparkle-particle system read from the same shared progress value. `ScrollTrigger` handles the scroll-reveal and pauses/resumes the loop off-screen. Everything mounts under `components/home/snake-trail/`, wired into `FooterBanner.tsx` as additive sibling elements.

**Tech Stack:** Next.js 16 / React 19 / TypeScript (strict) / Tailwind v4 / `gsap` (new dependency, core timeline + `ScrollTrigger`) / Node's built-in `node:test` (via the existing `tsx` devDependency) for pure-logic unit tests.

## Global Constraints

- **No test framework exists in this repo** (no jest/vitest/RTL) — do not add one. Pure-logic modules (`lib/utils.ts` additions, `bezierLoop.ts`, `paths.ts`) get real unit tests using Node's built-in `node:test` + `node:assert/strict`, run via the already-installed `tsx` devDependency (`npx tsx some.test.ts`). React/GSAP/visual wiring has no automated test — each of those tasks ends with an explicit manual browser-verification checklist instead, per this project's own convention for UI changes.
- **New dependency allowed:** `gsap` (regular `dependencies`, not dev). No other new dependency without checking with the user first.
- **Scope:** `components/home/FooterBanner.tsx` and its mobile/tablet cards only (`lg:hidden`). Do not modify `components/home/PromoShowcase.tsx` or any desktop code path.
- **Do not modify** the uploaded banner image, `CardDecoration`, `CARD_CLASSES`, the two aspect ratios, or any existing visual output at rest — only add new sibling overlay layers.
- **Reduced motion:** when `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is true, `SnakeTrailLayer` renders `null` — no trail, no particles, no GSAP timeline, no ScrollTrigger created. `DecorativeAccents` (static, non-animated) still renders.
- **Animate only** `transform`, `opacity`, and SVG `stroke-dashoffset`/attribute values driven through those — no animated CSS `filter`, no properties that trigger layout.
- **Color:** every new visual element derives its color from the `colorHex` prop passed down from `FooterBanner`'s existing `decorationColor` (`getThemeAccentHex(settings.home_footer_banner_decoration_color || "brown")`) — never a hardcoded palette.
- This whole component subtree only ever renders client-side (`FooterBanner` is already loaded via `dynamic(() => import(...), { ssr: false })` in `components/home/BelowFoldSections.tsx`) — it is safe to call `window.matchMedia` synchronously during render in these new components; there is no SSR pass to mismatch against.
- **Final verification commands** (Task 9): `npm run lint`, `npx tsc --noEmit`, plus the `node:test` files from Tasks 1–3, plus a manual `npm run dev` pass.

---

## File Structure

```
lib/utils.ts                                — MODIFY: add hexToRgba (moved from FooterBanner) + getTrailGradientStops
lib/utils.test.ts                           — CREATE: node:test tests for the above
components/home/FooterBanner.tsx            — MODIFY: remove local hexToRgba, mount new layers, add scroll-reveal ref
components/home/snake-trail/bezierLoop.ts   — CREATE: pure Catmull-Rom → cubic bezier loop math
components/home/snake-trail/bezierLoop.test.ts — CREATE
components/home/snake-trail/paths.ts        — CREATE: hand-authored loop points, card rects, accent regions per variant
components/home/snake-trail/paths.test.ts   — CREATE
components/home/snake-trail/DecorativeAccents.tsx — CREATE: 2 small static SVG flourishes per variant
components/home/snake-trail/SnakeTrailLayer.tsx   — CREATE: the masked triple-path trail + head + tail + particles
components/home/snake-trail/gsapSetup.ts    — CREATE: ScrollTrigger registration (idempotent)
components/home/snake-trail/useScrollReveal.ts — CREATE: scroll-in fade/scale/translate hook
package.json                                 — MODIFY: add `gsap` dependency
```

---

### Task 1: Shared hex-color helpers (`lib/utils.ts`)

**Files:**
- Modify: `lib/utils.ts`
- Modify: `components/home/FooterBanner.tsx:1-17` (remove local `hexToRgba`, import the shared one)
- Test: `lib/utils.test.ts`

**Interfaces:**
- Produces: `hexToRgba(hex: string, alpha: number): string`, `getTrailGradientStops(hex: string): { light: string; base: string; dark: string }` — both consumed by every later task in `components/home/snake-trail/`.

- [ ] **Step 1: Write the failing tests**

Create `lib/utils.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { hexToRgba, getTrailGradientStops } from "./utils";

test("hexToRgba converts a hex color and alpha into an rgba string", () => {
  assert.equal(hexToRgba("#6B4A2E", 0.9), "rgba(107, 74, 46, 0.9)");
});

test("hexToRgba handles alpha 0 and 1", () => {
  assert.equal(hexToRgba("#000000", 0), "rgba(0, 0, 0, 0)");
  assert.equal(hexToRgba("#ffffff", 1), "rgba(255, 255, 255, 1)");
});

test("getTrailGradientStops returns a lighter, base, and darker hex triad", () => {
  const stops = getTrailGradientStops("#6B4A2E");
  assert.equal(stops.base, "#6b4a2e");
  assert.match(stops.light, /^#[0-9a-f]{6}$/);
  assert.match(stops.dark, /^#[0-9a-f]{6}$/);
  assert.notEqual(stops.light, stops.base);
  assert.notEqual(stops.dark, stops.base);
});

test("getTrailGradientStops light stop is closer to white than base", () => {
  const stops = getTrailGradientStops("#202020");
  const baseLuminance = parseInt(stops.base.slice(1, 3), 16);
  const lightLuminance = parseInt(stops.light.slice(1, 3), 16);
  assert.ok(lightLuminance > baseLuminance);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx tsx lib/utils.test.ts`
Expected: FAIL — `hexToRgba` / `getTrailGradientStops` are not exported yet.

- [ ] **Step 3: Implement the helpers**

Append to `lib/utils.ts`:

```ts
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export type TrailGradientStops = {
  light: string;
  base: string;
  dark: string;
};

function clamp255(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function mixWithWhite(channel: number, amount: number): number {
  return clamp255(channel + (255 - channel) * amount);
}

function mixWithBlack(channel: number, amount: number): number {
  return clamp255(channel * (1 - amount));
}

function toHex(value: number): string {
  return value.toString(16).padStart(2, "0");
}

/**
 * Derives a light/base/dark triad from a single theme hex color, so the
 * snake-trail's glow always matches whatever decoration color an admin has
 * configured for that banner, instead of a fixed palette.
 */
export function getTrailGradientStops(hex: string): TrailGradientStops {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const light = `#${toHex(mixWithWhite(r, 0.45))}${toHex(mixWithWhite(g, 0.45))}${toHex(mixWithWhite(b, 0.45))}`;
  const dark = `#${toHex(mixWithBlack(r, 0.3))}${toHex(mixWithBlack(g, 0.3))}${toHex(mixWithBlack(b, 0.3))}`;

  return { light, base: hex.toLowerCase(), dark };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx tsx lib/utils.test.ts`
Expected: PASS (all 4 tests green)

- [ ] **Step 5: Remove the now-duplicated helper from `FooterBanner.tsx` and import the shared one**

In `components/home/FooterBanner.tsx`, delete the local function (originally lines 12-17):

```ts
function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
```

Add to the top import block:

```ts
import { hexToRgba } from "@/lib/utils";
```

- [ ] **Step 6: Verify the app still type-checks and lints**

Run: `npx tsc --noEmit`
Expected: no errors related to `FooterBanner.tsx` or `lib/utils.ts`

- [ ] **Step 7: Commit**

```bash
git add lib/utils.ts lib/utils.test.ts components/home/FooterBanner.tsx
git commit -m "refactor: share hexToRgba via lib/utils, add trail gradient helper"
```

---

### Task 2: Pure bezier-loop math (`bezierLoop.ts`)

**Files:**
- Create: `components/home/snake-trail/bezierLoop.ts`
- Test: `components/home/snake-trail/bezierLoop.test.ts`

**Interfaces:**
- Produces: `type Point = readonly [number, number]`, `type CubicArc = { start: Point; cp1: Point; cp2: Point; end: Point }`, `catmullRomLoopToBezier(points: readonly Point[], tension?: number): CubicArc[]`, `arcsToPathD(arcs: readonly CubicArc[]): string` — consumed by Task 3's `paths.ts`.

- [ ] **Step 1: Write the failing tests**

Create `components/home/snake-trail/bezierLoop.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { catmullRomLoopToBezier, arcsToPathD, type Point } from "./bezierLoop";

const SQUARE: Point[] = [
  [0, 0],
  [100, 0],
  [100, 100],
  [0, 100],
];

test("catmullRomLoopToBezier produces one arc per input point", () => {
  const arcs = catmullRomLoopToBezier(SQUARE);
  assert.equal(arcs.length, SQUARE.length);
});

test("catmullRomLoopToBezier forms a closed loop: each arc's end matches the next arc's start", () => {
  const arcs = catmullRomLoopToBezier(SQUARE);
  for (let i = 0; i < arcs.length; i++) {
    const next = arcs[(i + 1) % arcs.length];
    assert.deepEqual(arcs[i].end, next.start);
  }
});

test("catmullRomLoopToBezier throws for fewer than 3 points", () => {
  assert.throws(() =>
    catmullRomLoopToBezier([
      [0, 0],
      [1, 1],
    ])
  );
});

test("arcsToPathD starts with M, includes one C per arc, and closes with Z", () => {
  const arcs = catmullRomLoopToBezier(SQUARE);
  const d = arcsToPathD(arcs);
  assert.ok(d.startsWith("M 0 0"));
  assert.equal((d.match(/C /g) ?? []).length, arcs.length);
  assert.ok(d.trim().endsWith("Z"));
});

test("arcsToPathD returns an empty string for no arcs", () => {
  assert.equal(arcsToPathD([]), "");
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx tsx components/home/snake-trail/bezierLoop.test.ts`
Expected: FAIL — module `./bezierLoop` does not exist yet.

- [ ] **Step 3: Implement `bezierLoop.ts`**

Create `components/home/snake-trail/bezierLoop.ts`:

```ts
export type Point = readonly [number, number];

export type CubicArc = {
  start: Point;
  cp1: Point;
  cp2: Point;
  end: Point;
};

/**
 * Converts a closed loop of points into smoothly-joined cubic bezier arcs
 * using a Catmull-Rom-derived control point formula. Each point's tangent is
 * shared by the arc before and after it, so consecutive arcs always meet
 * with matching direction — no hand-tuned control points, no sharp corners.
 */
export function catmullRomLoopToBezier(points: readonly Point[], tension = 0.2): CubicArc[] {
  const n = points.length;
  if (n < 3) {
    throw new Error("catmullRomLoopToBezier requires at least 3 points");
  }

  const arcs: CubicArc[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];

    const cp1: Point = [p1[0] + (p2[0] - p0[0]) * tension, p1[1] + (p2[1] - p0[1]) * tension];
    const cp2: Point = [p2[0] - (p3[0] - p1[0]) * tension, p2[1] - (p3[1] - p1[1]) * tension];

    arcs.push({ start: p1, cp1, cp2, end: p2 });
  }
  return arcs;
}

export function arcsToPathD(arcs: readonly CubicArc[]): string {
  if (arcs.length === 0) return "";
  const [first] = arcs;
  const move = `M ${first.start[0]} ${first.start[1]}`;
  const curves = arcs
    .map((arc) => `C ${arc.cp1[0]} ${arc.cp1[1]}, ${arc.cp2[0]} ${arc.cp2[1]}, ${arc.end[0]} ${arc.end[1]}`)
    .join(" ");
  return `${move} ${curves} Z`;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx tsx components/home/snake-trail/bezierLoop.test.ts`
Expected: PASS (all 5 tests green)

- [ ] **Step 5: Commit**

```bash
git add components/home/snake-trail/bezierLoop.ts components/home/snake-trail/bezierLoop.test.ts
git commit -m "feat: add pure Catmull-Rom to bezier loop helper for the snake trail"
```

---

### Task 3: Trail geometry data (`paths.ts`)

**Files:**
- Create: `components/home/snake-trail/paths.ts`
- Test: `components/home/snake-trail/paths.test.ts`

**Interfaces:**
- Consumes: `catmullRomLoopToBezier`, `arcsToPathD`, `type Point` from `./bezierLoop` (Task 2).
- Produces: `type TrailVariant = "mobile" | "tablet"`, `type CardRect`, `type AccentMaskRegion`, `type TrailGeometry`, `getTrailGeometry(variant: TrailVariant): TrailGeometry` — consumed by `DecorativeAccents.tsx` (Task 4) and `SnakeTrailLayer.tsx` (Tasks 5–8).

- [ ] **Step 1: Write the failing tests**

Create `components/home/snake-trail/paths.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { getTrailGeometry } from "./paths";

function assertRectWithinCanvas(
  rect: { x: number; y: number; width: number; height: number },
  width: number,
  height: number
) {
  assert.ok(rect.x >= 0 && rect.y >= 0);
  assert.ok(rect.x + rect.width <= width);
  assert.ok(rect.y + rect.height <= height);
}

for (const variant of ["mobile", "tablet"] as const) {
  test(`getTrailGeometry("${variant}") card rect fits within the canvas`, () => {
    const geometry = getTrailGeometry(variant);
    assertRectWithinCanvas(geometry.cardRect, geometry.width, geometry.height);
  });

  test(`getTrailGeometry("${variant}") accent regions fit within the canvas`, () => {
    const geometry = getTrailGeometry(variant);
    for (const region of geometry.accentMaskRegions) {
      assertRectWithinCanvas(region, geometry.width, geometry.height);
    }
  });

  test(`getTrailGeometry("${variant}") produces a closed SVG path`, () => {
    const geometry = getTrailGeometry(variant);
    assert.ok(geometry.pathD.startsWith("M "));
    assert.ok(geometry.pathD.trim().endsWith("Z"));
  });
}

test("mobile and tablet geometries use distinct aspect ratios", () => {
  const mobile = getTrailGeometry("mobile");
  const tablet = getTrailGeometry("tablet");
  assert.notEqual(mobile.width / mobile.height, tablet.width / tablet.height);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx tsx components/home/snake-trail/paths.test.ts`
Expected: FAIL — module `./paths` does not exist yet.

- [ ] **Step 3: Implement `paths.ts`**

Create `components/home/snake-trail/paths.ts`:

```ts
import { catmullRomLoopToBezier, arcsToPathD, type Point } from "./bezierLoop";

export type TrailVariant = "mobile" | "tablet";

export type CardRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
};

export type AccentMaskRegion = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
};

export type TrailGeometry = {
  viewBox: string;
  width: number;
  height: number;
  cardRect: CardRect;
  pathD: string;
  accentMaskRegions: AccentMaskRegion[];
};

// Loop points alternate between "inside the card" and "outside the card,
// out to the canvas edge" — the outside points (x=0 or x=width) are what the
// outside-card mask reveals as the trail dips out and back in.
const MOBILE_LOOP_POINTS: Point[] = [
  [178, 60],
  [300, 90],
  [356, 200],
  [300, 340],
  [178, 396],
  [56, 340],
  [0, 200],
  [56, 90],
];

const TABLET_LOOP_POINTS: Point[] = [
  [228, 56],
  [370, 84],
  [456, 178],
  [370, 272],
  [228, 300],
  [86, 272],
  [0, 178],
  [86, 84],
];

const MOBILE_CARD_RECT: CardRect = { x: 28, y: 28, width: 300, height: 400, rx: 24 };
const TABLET_CARD_RECT: CardRect = { x: 28, y: 28, width: 400, height: 300, rx: 24 };

// Positioned near loop points [1] and [5] of each variant so the trail
// visibly threads past where DecorativeAccents renders its flourishes.
const MOBILE_ACCENTS: AccentMaskRegion[] = [
  { id: "top-right-flourish", x: 272, y: 62, width: 56, height: 56, rx: 14 },
  { id: "bottom-left-flourish", x: 28, y: 312, width: 56, height: 56, rx: 14 },
];

const TABLET_ACCENTS: AccentMaskRegion[] = [
  { id: "top-right-flourish", x: 342, y: 56, width: 56, height: 56, rx: 14 },
  { id: "bottom-left-flourish", x: 58, y: 244, width: 56, height: 56, rx: 14 },
];

const TENSION = 0.2;

export function getTrailGeometry(variant: TrailVariant): TrailGeometry {
  const isMobile = variant === "mobile";
  const points = isMobile ? MOBILE_LOOP_POINTS : TABLET_LOOP_POINTS;
  const width = isMobile ? 356 : 456;
  const height = isMobile ? 456 : 356;

  return {
    viewBox: `0 0 ${width} ${height}`,
    width,
    height,
    cardRect: isMobile ? MOBILE_CARD_RECT : TABLET_CARD_RECT,
    pathD: arcsToPathD(catmullRomLoopToBezier(points, TENSION)),
    accentMaskRegions: isMobile ? MOBILE_ACCENTS : TABLET_ACCENTS,
  };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx tsx components/home/snake-trail/paths.test.ts`
Expected: PASS (all 8 tests green)

- [ ] **Step 5: Commit**

```bash
git add components/home/snake-trail/paths.ts components/home/snake-trail/paths.test.ts
git commit -m "feat: author snake-trail loop geometry for mobile and tablet banner cards"
```

---

### Task 4: Decorative accents + mount into the banner

**Files:**
- Create: `components/home/snake-trail/DecorativeAccents.tsx`
- Modify: `components/home/FooterBanner.tsx`

**Interfaces:**
- Consumes: `getTrailGeometry`, `type TrailVariant` from `./snake-trail/paths` (Task 3); `hexToRgba` from `@/lib/utils` (Task 1).
- Produces: `export default function DecorativeAccents({ variant, colorHex }: { variant: TrailVariant; colorHex: string })`.

- [ ] **Step 1: Create the component**

Create `components/home/snake-trail/DecorativeAccents.tsx`:

```tsx
"use client";

import { getTrailGeometry, type TrailVariant } from "./paths";
import { hexToRgba } from "@/lib/utils";

function Flourish({
  x,
  y,
  width,
  height,
  colorHex,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  colorHex: string;
}) {
  const cx = x + width / 2;
  const cy = y + height / 2;
  return (
    <g opacity={0.55}>
      <path
        d={`M ${cx - width * 0.3} ${cy + height * 0.25} Q ${cx} ${cy - height * 0.3}, ${cx + width * 0.3} ${
          cy - height * 0.15
        }`}
        fill="none"
        stroke={colorHex}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <ellipse
        cx={cx - width * 0.12}
        cy={cy - height * 0.05}
        rx={width * 0.14}
        ry={width * 0.08}
        fill={hexToRgba(colorHex, 0.35)}
        transform={`rotate(-25 ${cx - width * 0.12} ${cy - height * 0.05})`}
      />
      <ellipse
        cx={cx + width * 0.15}
        cy={cy - height * 0.2}
        rx={width * 0.12}
        ry={width * 0.07}
        fill={hexToRgba(colorHex, 0.3)}
        transform={`rotate(20 ${cx + width * 0.15} ${cy - height * 0.2})`}
      />
    </g>
  );
}

export default function DecorativeAccents({ variant, colorHex }: { variant: TrailVariant; colorHex: string }) {
  const geometry = getTrailGeometry(variant);

  return (
    <svg viewBox={geometry.viewBox} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      {geometry.accentMaskRegions.map((region) => (
        <Flourish
          key={region.id}
          x={region.x}
          y={region.y}
          width={region.width}
          height={region.height}
          colorHex={colorHex}
        />
      ))}
    </svg>
  );
}
```

- [ ] **Step 2: Mount it in `FooterBanner.tsx`**

Add to the import block:

```ts
import DecorativeAccents from "./snake-trail/DecorativeAccents";
```

In the mobile card block, after `<CardDecoration colorHex={decorationColor} />`, add:

```tsx
<DecorativeAccents variant="mobile" colorHex={decorationColor} />
```

In the tablet card block, after its `<CardDecoration colorHex={decorationColor} />`, add:

```tsx
<DecorativeAccents variant="tablet" colorHex={decorationColor} />
```

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev`, open the homepage, scroll to the footer promo banner.
Expected: two small, quiet leaf/flourish doodles appear near the top-right and bottom-left of the card, in the same color as the existing corner brackets/sparkles, at low opacity — the photo, `CardDecoration`, and layout are otherwise unchanged. Check both a narrow (mobile) and medium (tablet) viewport width.

- [ ] **Step 4: Commit**

```bash
git add components/home/snake-trail/DecorativeAccents.tsx components/home/FooterBanner.tsx
git commit -m "feat: add decorative flourish accents to the footer banner card"
```

---

### Task 5: Static masked trail structure (no motion yet)

**Files:**
- Create: `components/home/snake-trail/SnakeTrailLayer.tsx`
- Modify: `components/home/FooterBanner.tsx`

**Interfaces:**
- Consumes: `getTrailGeometry`, `type TrailVariant` from `./paths` (Task 3); `getTrailGradientStops` from `@/lib/utils` (Task 1).
- Produces: `export default function SnakeTrailLayer({ variant, colorHex }: { variant: TrailVariant; colorHex: string })`. This task's version has no motion — Task 6 replaces it with an animated version.

- [ ] **Step 1: Create the static version**

Create `components/home/snake-trail/SnakeTrailLayer.tsx`:

```tsx
"use client";

import { getTrailGeometry, type TrailVariant } from "./paths";
import { getTrailGradientStops } from "@/lib/utils";

export default function SnakeTrailLayer({ variant, colorHex }: { variant: TrailVariant; colorHex: string }) {
  const geometry = getTrailGeometry(variant);
  const gradient = getTrailGradientStops(colorHex);
  const maskIdPrefix = `snake-trail-${variant}`;
  const { cardRect, accentMaskRegions } = geometry;

  return (
    <svg
      viewBox={geometry.viewBox}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${maskIdPrefix}-gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradient.light} />
          <stop offset="50%" stopColor={gradient.base} />
          <stop offset="100%" stopColor={gradient.dark} />
        </linearGradient>

        <filter id={`${maskIdPrefix}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Outside-card: full canvas minus the card rounded-rect */}
        <mask id={`${maskIdPrefix}-outside`}>
          <rect x="0" y="0" width={geometry.width} height={geometry.height} fill="white" />
          <rect
            x={cardRect.x}
            y={cardRect.y}
            width={cardRect.width}
            height={cardRect.height}
            rx={cardRect.rx}
            fill="black"
          />
        </mask>

        {/* Inside-card, below the accents: the card rect minus the accent regions */}
        <mask id={`${maskIdPrefix}-inside`}>
          <rect x="0" y="0" width={geometry.width} height={geometry.height} fill="black" />
          <rect
            x={cardRect.x}
            y={cardRect.y}
            width={cardRect.width}
            height={cardRect.height}
            rx={cardRect.rx}
            fill="white"
          />
          {accentMaskRegions.map((region) => (
            <rect
              key={region.id}
              x={region.x}
              y={region.y}
              width={region.width}
              height={region.height}
              rx={region.rx}
              fill="black"
            />
          ))}
        </mask>

        {/* Above-accent: only the small accent regions */}
        <mask id={`${maskIdPrefix}-above-accent`}>
          <rect x="0" y="0" width={geometry.width} height={geometry.height} fill="black" />
          {accentMaskRegions.map((region) => (
            <rect
              key={region.id}
              x={region.x}
              y={region.y}
              width={region.width}
              height={region.height}
              rx={region.rx}
              fill="white"
            />
          ))}
        </mask>
      </defs>

      {(["outside", "inside", "above-accent"] as const).map((layer) => (
        <g key={layer} mask={`url(#${maskIdPrefix}-${layer})`}>
          <path
            d={geometry.pathD}
            fill="none"
            stroke={`url(#${maskIdPrefix}-gradient)`}
            strokeWidth={2}
            strokeLinecap="round"
            filter={`url(#${maskIdPrefix}-glow)`}
          />
        </g>
      ))}
    </svg>
  );
}
```

- [ ] **Step 2: Mount it in `FooterBanner.tsx`**

Add to the import block:

```ts
import SnakeTrailLayer from "./snake-trail/SnakeTrailLayer";
```

In the mobile card block, after `<DecorativeAccents variant="mobile" colorHex={decorationColor} />`, add:

```tsx
<SnakeTrailLayer variant="mobile" colorHex={decorationColor} />
```

In the tablet card block, after its `<DecorativeAccents variant="tablet" ... />`, add:

```tsx
<SnakeTrailLayer variant="tablet" colorHex={decorationColor} />
```

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev`, open the homepage, scroll to the banner.
Expected: a thin glowing loop outline is visible around the card — part of it sitting in the margin outside the card edge, part of it inside, and a couple of brief spots crossing directly over the two flourish accents. Nothing moves yet (motion is Task 6). Confirm the outside segments are actually clipped at the card's rounded corners (not just floating past a straight edge).

- [ ] **Step 4: Commit**

```bash
git add components/home/snake-trail/SnakeTrailLayer.tsx components/home/FooterBanner.tsx
git commit -m "feat: render static masked snake-trail structure on the footer banner"
```

---

### Task 6: Add `gsap` and animate the trail

**Files:**
- Modify: `package.json` (add `gsap` dependency)
- Modify: `components/home/snake-trail/SnakeTrailLayer.tsx` (full rewrite)

**Interfaces:**
- Consumes: `gsap` default export from the new `gsap` package.
- Produces: same `SnakeTrailLayer` component signature as Task 5, now animated. `prefersReducedMotion` early-return behavior is introduced here and must be preserved by every later task that touches this file.

- [ ] **Step 1: Install gsap**

Run: `npm install gsap`
Expected: `gsap` appears under `dependencies` in `package.json` and `package-lock.json` updates.

- [ ] **Step 2: Rewrite `SnakeTrailLayer.tsx` with motion**

Replace the entire contents of `components/home/snake-trail/SnakeTrailLayer.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { getTrailGeometry, type TrailVariant } from "./paths";
import { getTrailGradientStops } from "@/lib/utils";

const ARC_COUNT = 8;
const ARC_DURATION_SECONDS = 2.4;
const HEAD_RADIUS = 4;
const TAIL_FRACTION = 0.14; // portion of the loop rendered as the glowing comet tail

export default function SnakeTrailLayer({ variant, colorHex }: { variant: TrailVariant; colorHex: string }) {
  const geometry = getTrailGeometry(variant);
  const gradient = getTrailGradientStops(colorHex);
  const maskIdPrefix = `snake-trail-${variant}`;

  const pathRefs = useRef<(SVGPathElement | null)[]>([null, null, null]);
  const headRefs = useRef<(SVGCircleElement | null)[]>([null, null, null]);

  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const paths = pathRefs.current.filter((el): el is SVGPathElement => el !== null);
    const heads = headRefs.current.filter((el): el is SVGCircleElement => el !== null);
    if (paths.length !== 3 || heads.length !== 3) return;

    const totalLength = paths[0].getTotalLength();
    const tailLength = totalLength * TAIL_FRACTION;

    for (const path of paths) {
      path.style.strokeDasharray = `${tailLength} ${totalLength}`;
    }

    const progress = { distance: 0 };
    const timeline = gsap.timeline({ repeat: -1 });

    for (let i = 0; i < ARC_COUNT; i++) {
      const arcStart = (i / ARC_COUNT) * totalLength;
      const arcEnd = ((i + 1) / ARC_COUNT) * totalLength;
      // fromTo (not to): a plain-object tween needs an explicit "from" so
      // every timeline repeat restarts this arc from the right value,
      // instead of animating from wherever the previous repeat left off.
      timeline.fromTo(
        progress,
        { distance: arcStart },
        {
          distance: arcEnd,
          duration: ARC_DURATION_SECONDS,
          ease: "power1.inOut",
          onUpdate: () => {
            const point = paths[0].getPointAtLength(progress.distance);
            for (const head of heads) {
              head.setAttribute("cx", String(point.x));
              head.setAttribute("cy", String(point.y));
            }
            for (const path of paths) {
              path.style.strokeDashoffset = String(-progress.distance);
            }
          },
        }
      );
    }

    return () => {
      timeline.kill();
    };
  }, [prefersReducedMotion, geometry.pathD]);

  if (prefersReducedMotion) return null;

  const { cardRect, accentMaskRegions } = geometry;

  return (
    <svg
      viewBox={geometry.viewBox}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${maskIdPrefix}-gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradient.light} />
          <stop offset="50%" stopColor={gradient.base} />
          <stop offset="100%" stopColor={gradient.dark} />
        </linearGradient>

        <filter id={`${maskIdPrefix}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <mask id={`${maskIdPrefix}-outside`}>
          <rect x="0" y="0" width={geometry.width} height={geometry.height} fill="white" />
          <rect
            x={cardRect.x}
            y={cardRect.y}
            width={cardRect.width}
            height={cardRect.height}
            rx={cardRect.rx}
            fill="black"
          />
        </mask>

        <mask id={`${maskIdPrefix}-inside`}>
          <rect x="0" y="0" width={geometry.width} height={geometry.height} fill="black" />
          <rect
            x={cardRect.x}
            y={cardRect.y}
            width={cardRect.width}
            height={cardRect.height}
            rx={cardRect.rx}
            fill="white"
          />
          {accentMaskRegions.map((region) => (
            <rect
              key={region.id}
              x={region.x}
              y={region.y}
              width={region.width}
              height={region.height}
              rx={region.rx}
              fill="black"
            />
          ))}
        </mask>

        <mask id={`${maskIdPrefix}-above-accent`}>
          <rect x="0" y="0" width={geometry.width} height={geometry.height} fill="black" />
          {accentMaskRegions.map((region) => (
            <rect
              key={region.id}
              x={region.x}
              y={region.y}
              width={region.width}
              height={region.height}
              rx={region.rx}
              fill="white"
            />
          ))}
        </mask>
      </defs>

      {(["outside", "inside", "above-accent"] as const).map((layer, i) => (
        <g key={layer} mask={`url(#${maskIdPrefix}-${layer})`}>
          <path
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={geometry.pathD}
            fill="none"
            stroke={`url(#${maskIdPrefix}-gradient)`}
            strokeWidth={2}
            strokeLinecap="round"
            filter={`url(#${maskIdPrefix}-glow)`}
          />
          <circle
            ref={(el) => {
              headRefs.current[i] = el;
            }}
            r={HEAD_RADIUS}
            fill={gradient.light}
            filter={`url(#${maskIdPrefix}-glow)`}
          />
        </g>
      ))}
    </svg>
  );
}
```

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev`, open the homepage, scroll to the banner.
Expected: the glowing head + comet tail travel continuously around the loop, dipping outside the card margin on the left and right and gracefully curving back inside, slowing down near each direction change and speeding up along the longer stretches, with no visible jump, stutter, or restart pop across loop repeats (watch it loop at least 3 times). Confirm it disappears/reappears believably at the card edge.
Then, in Chrome DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce", reload, and confirm the entire trail (including the static structure from Task 5) is gone and the banner looks exactly like it did before Task 4.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json components/home/snake-trail/SnakeTrailLayer.tsx
git commit -m "feat: animate the snake trail with a synced GSAP arc timeline"
```

---

### Task 7: Sparkle particles

**Files:**
- Modify: `components/home/snake-trail/SnakeTrailLayer.tsx` (full rewrite, adds a particle pool on top of Task 6)

**Interfaces:**
- No new public interface — `SnakeTrailLayer`'s props are unchanged.

- [ ] **Step 1: Rewrite `SnakeTrailLayer.tsx` to add pooled particles**

Replace the entire contents of `components/home/snake-trail/SnakeTrailLayer.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { getTrailGeometry, type TrailVariant } from "./paths";
import { getTrailGradientStops } from "@/lib/utils";

const ARC_COUNT = 8;
const ARC_DURATION_SECONDS = 2.4;
const HEAD_RADIUS = 4;
const TAIL_FRACTION = 0.14;
const PARTICLE_COUNT = 7;
const PARTICLE_INTERVAL_SECONDS = 0.75;

export default function SnakeTrailLayer({ variant, colorHex }: { variant: TrailVariant; colorHex: string }) {
  const geometry = getTrailGeometry(variant);
  const gradient = getTrailGradientStops(colorHex);
  const maskIdPrefix = `snake-trail-${variant}`;

  const pathRefs = useRef<(SVGPathElement | null)[]>([null, null, null]);
  const headRefs = useRef<(SVGCircleElement | null)[]>([null, null, null]);
  const particleRefs = useRef<(SVGCircleElement | null)[]>(Array(PARTICLE_COUNT).fill(null));

  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const paths = pathRefs.current.filter((el): el is SVGPathElement => el !== null);
    const heads = headRefs.current.filter((el): el is SVGCircleElement => el !== null);
    const particles = particleRefs.current.filter((el): el is SVGCircleElement => el !== null);
    if (paths.length !== 3 || heads.length !== 3) return;

    const totalLength = paths[0].getTotalLength();
    const tailLength = totalLength * TAIL_FRACTION;

    for (const path of paths) {
      path.style.strokeDasharray = `${tailLength} ${totalLength}`;
    }

    const progress = { distance: 0 };
    const timeline = gsap.timeline({ repeat: -1 });

    for (let i = 0; i < ARC_COUNT; i++) {
      const arcStart = (i / ARC_COUNT) * totalLength;
      const arcEnd = ((i + 1) / ARC_COUNT) * totalLength;
      timeline.fromTo(
        progress,
        { distance: arcStart },
        {
          distance: arcEnd,
          duration: ARC_DURATION_SECONDS,
          ease: "power1.inOut",
          onUpdate: () => {
            const point = paths[0].getPointAtLength(progress.distance);
            for (const head of heads) {
              head.setAttribute("cx", String(point.x));
              head.setAttribute("cy", String(point.y));
            }
            for (const path of paths) {
              path.style.strokeDashoffset = String(-progress.distance);
            }
          },
        }
      );
    }

    let particleIndex = 0;
    let particleCall: gsap.core.Tween | null = null;

    function spawnParticle() {
      const el = particles[particleIndex];
      particleIndex = (particleIndex + 1) % particles.length;
      if (!el) return;

      const point = paths[0].getPointAtLength(progress.distance);
      const driftX = (Math.random() - 0.5) * 14;
      const driftY = (Math.random() - 0.5) * 14 - 6;

      gsap.killTweensOf(el);
      gsap.set(el, { attr: { cx: point.x, cy: point.y }, opacity: 0, scale: 0.4, transformOrigin: "center" });
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power1.out",
        onComplete: () => {
          gsap.to(el, {
            attr: { cx: point.x + driftX, cy: point.y + driftY },
            opacity: 0,
            scale: 0.6,
            duration: 1.1,
            ease: "power1.in",
          });
        },
      });
    }

    function scheduleNextParticle() {
      particleCall = gsap.delayedCall(PARTICLE_INTERVAL_SECONDS, () => {
        spawnParticle();
        scheduleNextParticle();
      });
    }

    if (particles.length > 0) {
      scheduleNextParticle();
    }

    return () => {
      timeline.kill();
      particleCall?.kill();
      for (const el of particles) {
        gsap.killTweensOf(el);
      }
    };
  }, [prefersReducedMotion, geometry.pathD]);

  if (prefersReducedMotion) return null;

  const { cardRect, accentMaskRegions } = geometry;

  return (
    <svg
      viewBox={geometry.viewBox}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${maskIdPrefix}-gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradient.light} />
          <stop offset="50%" stopColor={gradient.base} />
          <stop offset="100%" stopColor={gradient.dark} />
        </linearGradient>

        <filter id={`${maskIdPrefix}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <mask id={`${maskIdPrefix}-outside`}>
          <rect x="0" y="0" width={geometry.width} height={geometry.height} fill="white" />
          <rect
            x={cardRect.x}
            y={cardRect.y}
            width={cardRect.width}
            height={cardRect.height}
            rx={cardRect.rx}
            fill="black"
          />
        </mask>

        <mask id={`${maskIdPrefix}-inside`}>
          <rect x="0" y="0" width={geometry.width} height={geometry.height} fill="black" />
          <rect
            x={cardRect.x}
            y={cardRect.y}
            width={cardRect.width}
            height={cardRect.height}
            rx={cardRect.rx}
            fill="white"
          />
          {accentMaskRegions.map((region) => (
            <rect
              key={region.id}
              x={region.x}
              y={region.y}
              width={region.width}
              height={region.height}
              rx={region.rx}
              fill="black"
            />
          ))}
        </mask>

        <mask id={`${maskIdPrefix}-above-accent`}>
          <rect x="0" y="0" width={geometry.width} height={geometry.height} fill="black" />
          {accentMaskRegions.map((region) => (
            <rect
              key={region.id}
              x={region.x}
              y={region.y}
              width={region.width}
              height={region.height}
              rx={region.rx}
              fill="white"
            />
          ))}
        </mask>
      </defs>

      {(["outside", "inside", "above-accent"] as const).map((layer, i) => (
        <g key={layer} mask={`url(#${maskIdPrefix}-${layer})`}>
          <path
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={geometry.pathD}
            fill="none"
            stroke={`url(#${maskIdPrefix}-gradient)`}
            strokeWidth={2}
            strokeLinecap="round"
            filter={`url(#${maskIdPrefix}-glow)`}
          />
          <circle
            ref={(el) => {
              headRefs.current[i] = el;
            }}
            r={HEAD_RADIUS}
            fill={gradient.light}
            filter={`url(#${maskIdPrefix}-glow)`}
          />
        </g>
      ))}

      <g>
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <circle
            key={i}
            ref={(el) => {
              particleRefs.current[i] = el;
            }}
            r={1.6}
            fill={gradient.light}
            opacity={0}
            filter={`url(#${maskIdPrefix}-glow)`}
          />
        ))}
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Manually verify in the browser**

Run: `npm run dev`, open the homepage, scroll to the banner.
Expected: small sparkles occasionally appear near the traveling head, drift slightly, and fade out smoothly — no more than one or two visible at once, never cluttering the card. Confirm the main trail motion from Task 6 is unaffected.

- [ ] **Step 3: Commit**

```bash
git add components/home/snake-trail/SnakeTrailLayer.tsx
git commit -m "feat: emit pooled sparkle particles from the traveling snake-trail head"
```

---

### Task 8: Scroll reveal + pause/resume off-screen

**Files:**
- Create: `components/home/snake-trail/gsapSetup.ts`
- Create: `components/home/snake-trail/useScrollReveal.ts`
- Modify: `components/home/snake-trail/SnakeTrailLayer.tsx` (add ScrollTrigger play/pause)
- Modify: `components/home/FooterBanner.tsx` (apply the scroll-reveal hook to the card wrapper)

**Interfaces:**
- Produces: `ensureScrollTriggerRegistered(): void`, `ScrollTrigger` (re-exported) from `./gsapSetup`; `useScrollReveal<T extends HTMLElement>(): RefObject<T | null>` from `./useScrollReveal`.

- [ ] **Step 1: Create the idempotent plugin registration helper**

Create `components/home/snake-trail/gsapSetup.ts`:

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function ensureScrollTriggerRegistered(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { ScrollTrigger };
```

- [ ] **Step 2: Create the scroll-reveal hook**

Create `components/home/snake-trail/useScrollReveal.ts`:

```ts
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
```

- [ ] **Step 3: Add play/pause-off-screen to `SnakeTrailLayer.tsx`**

In `components/home/snake-trail/SnakeTrailLayer.tsx`, update the import line:

```ts
import gsap from "gsap";
import { ScrollTrigger, ensureScrollTriggerRegistered } from "./gsapSetup";
```

Add a ref alongside the existing ones:

```ts
const svgRootRef = useRef<SVGSVGElement | null>(null);
```

Inside the `useEffect`, immediately after the `timeline` is created (right after the `for (let i = 0; i < ARC_COUNT; i++) { ... }` loop and before the particle pool code), add:

```ts
ensureScrollTriggerRegistered();
const svgEl = svgRootRef.current;
const scrollTrigger = svgEl
  ? ScrollTrigger.create({
      trigger: svgEl,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => timeline.play(),
      onLeave: () => timeline.pause(),
      onEnterBack: () => timeline.play(),
      onLeaveBack: () => timeline.pause(),
    })
  : null;
```

Update the effect's cleanup function to also kill it:

```ts
return () => {
  timeline.kill();
  scrollTrigger?.kill();
  particleCall?.kill();
  for (const el of particles) {
    gsap.killTweensOf(el);
  }
};
```

Attach the ref to the root `<svg>` element:

```tsx
<svg
  ref={svgRootRef}
  viewBox={geometry.viewBox}
  className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
  aria-hidden="true"
>
```

- [ ] **Step 4: Apply the scroll-reveal to the banner's card wrapper**

In `components/home/FooterBanner.tsx`, add to the import block:

```ts
import { useScrollReveal } from "./snake-trail/useScrollReveal";
```

Inside `export default function FooterBanner()`, add near the top of the function body (alongside the existing `useSettings()` call):

```ts
const revealRef = useScrollReveal<HTMLDivElement>();
```

Change the `content` wrapper's opening tag from:

```tsx
<div className="transition-transform duration-300 group-hover:scale-[1.01] space-y-0">
```

to:

```tsx
<div ref={revealRef} className="transition-transform duration-300 group-hover:scale-[1.01] space-y-0">
```

- [ ] **Step 5: Manually verify in the browser**

Run: `npm run dev`, open the homepage at a viewport height that puts the banner below the fold.
Expected: scrolling down, the whole banner fades in with a slight upward move and scale-up as it enters the viewport (once, not on every re-entry). Then, scroll the banner fully out of view (both above and below) and use DevTools' Performance panel (or the "Rendering" → "Frame Rendering Stats" overlay) to confirm no animation frames are firing for the trail while it's off-screen; scroll it back into view and confirm the trail resumes smoothly from wherever it left off (no restart pop).

- [ ] **Step 6: Commit**

```bash
git add components/home/snake-trail/gsapSetup.ts components/home/snake-trail/useScrollReveal.ts components/home/snake-trail/SnakeTrailLayer.tsx components/home/FooterBanner.tsx
git commit -m "feat: add scroll-in reveal and off-screen pause/resume to the snake trail"
```

---

### Task 9: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run all pure-logic unit tests**

Run:

```bash
npx tsx lib/utils.test.ts
npx tsx components/home/snake-trail/bezierLoop.test.ts
npx tsx components/home/snake-trail/paths.test.ts
```

Expected: all PASS.

- [ ] **Step 2: Run lint and type-check**

Run: `npm run lint`
Expected: no errors.

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Full manual browser pass**

Run: `npm run dev` and check, at both a mobile-width and tablet-width viewport:
- The banner image, `CardDecoration`, link behavior, and hover scale are pixel-identical to how they behaved before this feature.
- The trail loops continuously and smoothly, dips outside the card and back in on both sides, and visibly passes behind the card edge and in front of/behind the two flourish accents.
- Particles emit sparingly and fade cleanly.
- Scroll reveal fires once on first entering the viewport; the loop pauses off-screen and resumes on return.
- With `prefers-reduced-motion: reduce` emulated in DevTools, the trail, particles, and scroll-reveal are entirely absent and the banner matches its pre-feature appearance exactly.
- No console errors or warnings appear.
- The section is confirmed absent from the `lg:` (desktop) breakpoint, same as before this feature (unchanged `lg:hidden` on the outer `<section>`).

- [ ] **Step 4: Commit** (only if Step 3 required fixes; otherwise this task produces no diff)

```bash
git add -A
git commit -m "fix: address issues found in final snake-trail verification pass"
```
