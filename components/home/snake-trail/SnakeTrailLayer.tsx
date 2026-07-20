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
