import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Goat Farm Gallery | Live Goats, Mutton Packs & Farm Photos — Ragu Farm",
  description:
    "Browse photos of healthy pasture-raised live goats, fresh mutton packs, farm facilities, and delivery events at Ragu Goat Farm, Villupuram, Tamil Nadu.",
  keywords: [
    "Ragu Goat Farm photos",
    "live goat farm gallery Tamil Nadu",
    "goat farm pictures Villupuram",
    "naatu aadu farm photos",
    "fresh mutton packaging photos",
    "goat farm Villupuram gallery",
    "healthy live goat images",
  ],
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Goat Farm Gallery | Ragu Goat Farm — Villupuram, Tamil Nadu",
    description:
      "See our healthy live goats, farm pastures, mutton packs, and delivery operations at Ragu Goat Farm, Villupuram.",
    type: "website",
    locale: "en_IN",
    siteName: "Ragu Goat Farm",
  },
  twitter: {
    card: "summary_large_image",
    title: "Farm Gallery | Ragu Goat Farm, Villupuram",
    description:
      "Photos of our healthy live goats, farm pastures, and fresh mutton packs — Ragu Goat Farm, Tamil Nadu.",
  },
};

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
