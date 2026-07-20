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
// cycle. Point [0] (the loop's start/end) is never jittered, so consecutive
// laps still hand off from the exact same pixel — no seam. The bulge points
// (e.g. mobile [340,145]) sit only ~12 units from the card edge, the
// tightest clearance in either point table, so the radius stays under that
// to keep "outside" bulge points from jittering across the card boundary.
const JITTER_RADIUS = 10;

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
