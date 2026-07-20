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

// Raised from 0.2: at that tension the sharp inside-to-outside reversals
// (e.g. mobile points [1]->[2]->[3]) read as an angular "zigzag" instead of
// a rounded snake-body curve. 0.32 keeps the loop from self-crossing while
// giving those direction changes a visibly rounded sweep.
const TENSION = 0.32;

// Per-lap jitter so the trail doesn't retrace an identical route every
// cycle. Point [0] (the loop's start/end) is never jittered, so consecutive
// laps still hand off from the exact same pixel — no seam. The radius stays
// comfortably inside the smallest card-edge/canvas-edge margin in the point
// tables above (28 units), so a jittered point can't flip from "outside the
// card" to "inside" or vice versa.
const JITTER_RADIUS = 18;

function jitterPoint([x, y]: Point, radius: number, width: number, height: number): Point {
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * radius;
  const jitteredX = x + Math.cos(angle) * distance;
  const jitteredY = y + Math.sin(angle) * distance;
  return [Math.max(2, Math.min(width - 2, jitteredX)), Math.max(2, Math.min(height - 2, jitteredY))];
}

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

/**
 * A fresh closed path for one lap, jittered from the same anchor points used
 * by getTrailGeometry so the trail travels a different, still-smooth route
 * each cycle instead of repeating an identical loop. Call once per lap.
 */
export function getRandomizedPathD(variant: TrailVariant): string {
  const isMobile = variant === "mobile";
  const points = isMobile ? MOBILE_LOOP_POINTS : TABLET_LOOP_POINTS;
  const width = isMobile ? 356 : 456;
  const height = isMobile ? 456 : 356;

  const jittered: Point[] = points.map((point, i) =>
    i === 0 ? point : jitterPoint(point, JITTER_RADIUS, width, height)
  );

  return arcsToPathD(catmullRomLoopToBezier(jittered, TENSION));
}
