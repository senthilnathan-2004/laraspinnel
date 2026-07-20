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
