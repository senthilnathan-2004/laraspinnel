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
