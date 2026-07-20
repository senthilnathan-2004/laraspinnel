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
