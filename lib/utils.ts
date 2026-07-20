import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export function generateRefId(): string {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000); // 4 digit random number
  return `LPO-${year}${month}${day}-${rand}`;
}

/**
 * Push out-of-stock items (stock <= 0) to the end of the list while keeping
 * everything else in its existing order. Uses a stable sort, so in-stock
 * items stay in whatever order the caller already applied (latest/price/etc.),
 * and items regain their normal position the moment stock is restored.
 */
export function sortInStockFirst<T extends { stock?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aOut = typeof a.stock === "number" && a.stock <= 0 ? 1 : 0;
    const bOut = typeof b.stock === "number" && b.stock <= 0 ? 1 : 0;
    return aOut - bOut;
  });
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

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
