import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About Ragu Goat Farm | Trusted Goat Supplier, Villupuram, Tamil Nadu",
  description:
    "Ragu Goat Farm is a family-run, pasture-raised goat farm in Villupuram, Tamil Nadu. 50+ acres of organic grazing land, 1200+ goats reared annually. Trusted naatu aadu supplier.",
  keywords: [
    "about Ragu Goat Farm",
    "goat farm Villupuram Tamil Nadu",
    "trusted goat supplier Tamil Nadu",
    "organic pasture-raised goat farm",
    "naatu aadu panni Villupuram",
    "genuine goat farm Tamil Nadu",
    "pasture-raised goat farm",
    "healthy goat farm Tamil Nadu",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Ragu Goat Farm | Organic Pasture-Raised Goat Farm, Villupuram",
    description:
      "Learn about Ragu Goat Farm — trusted naatu aadu and live goat supplier in Villupuram, Tamil Nadu. 50+ acres pasture, 3500+ successful deliveries.",
    type: "website",
    locale: "en_IN",
    siteName: "Ragu Goat Farm",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Ragu Goat Farm | Villupuram Goat Farm",
    description:
      "50+ acres of organic pasture, 1200+ goats reared, 3500+ deliveries — Ragu Goat Farm, Villupuram, Tamil Nadu.",
  },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
