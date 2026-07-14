import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Goat Farm Blog | Mutton Recipes, Breed Tips & Farm Updates — Ragu Farm",
  description:
    "Read expert articles on goat breeds, naatu aadu mutton recipes, Bakrid goat selection tips, mutton health benefits, and farm updates from Ragu Goat Farm, Villupuram, Tamil Nadu.",
  keywords: [
    "goat farm blog Tamil Nadu",
    "naatu aadu kulambu recipe",
    "mutton recipe Tamil style",
    "best goat breed for Bakrid",
    "how to choose a healthy goat",
    "mutton benefits for health",
    "naatu aadu vs farm goat difference",
    "how many kg mutton for 10 people",
    "goat farming tips Tamil Nadu",
    "Bakrid goat selection guide 2026",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Goat Farm Blog | Ragu Goat Farm — Villupuram, Tamil Nadu",
    description:
      "Goat farming tips, naatu aadu mutton recipes, Bakrid goat guides, and farm news from Ragu Goat Farm, Villupuram.",
    type: "website",
    locale: "en_IN",
    siteName: "Ragu Goat Farm",
  },
  twitter: {
    card: "summary_large_image",
    title: "Goat Farm Blog | Mutton Recipes & Breed Tips — Ragu Farm",
    description:
      "Expert articles on goat breeds, mutton recipes, and Bakrid guides from Ragu Goat Farm, Tamil Nadu.",
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
