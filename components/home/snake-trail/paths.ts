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

// Loop points alternate between "inside the card" and "outside the card, out
// toward the canvas edge" — the outside points (x near 0 or near width) are
// what the outside-card mask reveals as the trail dips out and back in.
//
// Each outside excursion is 3 points (in / apex / out), not a single spike:
// going from an inside point straight to one outside point and back is a
// near-180° reversal that no bezier tension can round into a real curve —
// it always reads as a zigzag point, not a snake-body sweep. Spreading that
// reversal's direction change across 3 points turns it into a gentle bulge
// that the same Catmull-Rom smoothing renders as an actual rounded arc.
const MOBILE_LOOP_POINTS: Point[] = [
  [178, 60], // 0: top center (fixed anchor — never jittered, shared lap start)
  [300, 90], // 1: upper right, inside
  [340, 145], // 2: right bulge, entering outside
  [356, 200], // 3: right apex, outside
  [340, 255], // 4: right bulge, returning inside
  [300, 340], // 5: lower right, inside
  [178, 396], // 6: bottom center, inside
  [56, 340], // 7: lower left, inside
  [16, 255], // 8: left bulge, entering outside
  [0, 200], // 9: left apex, outside
  [16, 145], // 10: left bulge, returning inside
  [56, 90], // 11: upper left, inside
];

const TABLET_LOOP_POINTS: Point[] = [
  [228, 56], // 0: top center (fixed anchor — never jittered, shared lap start)
  [370, 84], // 1: upper right, inside
  [440, 130], // 2: right bulge, entering outside
  [456, 178], // 3: right apex, outside
  [440, 226], // 4: right bulge, returning inside
  [370, 272], // 5: lower right, inside
  [228, 300], // 6: bottom center, inside
  [86, 272], // 7: lower left, inside
  [16, 226], // 8: left bulge, entering outside
  [0, 178], // 9: left apex, outside
  [16, 130], // 10: left bulge, returning inside
  [86, 84], // 11: upper left, inside
];

const MOBILE_CARD_RECT: CardRect = { x: 28, y: 28, width: 300, height: 400, rx: 24 };
const TABLET_CARD_RECT: CardRect = { x: 28, y: 28, width: 400, height: 300, rx: 24 };

// Positioned near loop points [1] and [7] of each variant so the trail
// visibly threads past where DecorativeAccents renders its flourishes.
const MOBILE_ACCENTS: AccentMaskRegion[] = [
  { id: "top-right-flourish", x: 272, y: 62, width: 56, height: 56, rx: 14 },
  { id: "bottom-left-flourish", x: 28, y: 312, width: 56, height: 56, rx: 14 },
];

const TABLET_ACCENTS: AccentMaskRegion[] = [
  { id: "top-right-flourish", x: 342, y: 56, width: 56, height: 56, rx: 14 },
  { id: "bottom-left-flourish", x: 58, y: 244, width: 56, height: 56, rx: 14 },
];

// Combined with the bulge points above (rather than relying on tension
// alone to fake roundness), 0.32 renders every direction change — including
// the outside excursions — as a genuine rounded sweep with no self-crossing.
const TENSION = 0.32;

// Per-lap jitter so the trail doesn't retrace an identical route every
// cycle — including the outside excursions, not just the inside portion.
// Point [0] (the loop's start/end) is never jittered, so every lap still
// hands off from the exact same pixel. The canvas-edge clamp in jitterPoint
// keeps a jittered point from ever rendering off-canvas; occasionally
// nudging a bulge point a few units across the card's edge is fine — it
// just makes that lap's outside dip a little smaller or bigger, which reads
// as more organic, not broken.
const JITTER_RADIUS = 16;

function jitterPoint([x, y]: Point, radius: number, width: number, height: number): Point {
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * radius;
  const jitteredX = x + Math.cos(angle) * distance;
  const jitteredY = y + Math.sin(angle) * distance;
  return [Math.max(2, Math.min(width - 2, jitteredX)), Math.max(2, Math.min(height - 2, jitteredY))];
}

function dimensionsFor(variant: TrailVariant): { width: number; height: number } {
  return variant === "mobile" ? { width: 356, height: 456 } : { width: 456, height: 356 };
}

function basePointsFor(variant: TrailVariant): Point[] {
  return variant === "mobile" ? MOBILE_LOOP_POINTS : TABLET_LOOP_POINTS;
}

export function getTrailGeometry(variant: TrailVariant): TrailGeometry {
  const isMobile = variant === "mobile";
  const { width, height } = dimensionsFor(variant);

  return {
    viewBox: `0 0 ${width} ${height}`,
    width,
    height,
    cardRect: isMobile ? MOBILE_CARD_RECT : TABLET_CARD_RECT,
    pathD: arcsToPathD(catmullRomLoopToBezier(basePointsFor(variant), TENSION)),
    accentMaskRegions: isMobile ? MOBILE_ACCENTS : TABLET_ACCENTS,
  };
}

/** The fixed anchor points for a variant, before any per-lap jitter. */
export function getBaseLoopPoints(variant: TrailVariant): Point[] {
  return basePointsFor(variant).map((p): Point => [p[0], p[1]]);
}

/**
 * A fresh set of loop points for one lap, jittered from the same anchor
 * points used by getTrailGeometry (point [0] excepted) so the trail travels
 * a different, still-smooth route each cycle instead of repeating an
 * identical loop. Call once per lap; feed the result through
 * loopPointsToPathD (directly, or via lerpLoopPoints for a smooth morph).
 */
export function getRandomizedLoopPoints(variant: TrailVariant): Point[] {
  const { width, height } = dimensionsFor(variant);
  return basePointsFor(variant).map((point, i) => (i === 0 ? point : jitterPoint(point, JITTER_RADIUS, width, height)));
}

export function loopPointsToPathD(points: readonly Point[]): string {
  return arcsToPathD(catmullRomLoopToBezier(points, TENSION));
}

/** Linearly interpolates every point of two same-length loops, for morphing one lap's shape into the next's. */
export function lerpLoopPoints(from: readonly Point[], to: readonly Point[], t: number): Point[] {
  return from.map(([fx, fy], i) => {
    const [tx, ty] = to[i];
    return [fx + (tx - fx) * t, fy + (ty - fy) * t] as Point;
  });
}

/**
 * A fresh closed path for one lap in a single call — convenience wrapper
 * over getRandomizedLoopPoints + loopPointsToPathD for callers that don't
 * need to morph between lap shapes.
 */
export function getRandomizedPathD(variant: TrailVariant): string {
  return loopPointsToPathD(getRandomizedLoopPoints(variant));
}
