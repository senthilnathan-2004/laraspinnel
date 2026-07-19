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
