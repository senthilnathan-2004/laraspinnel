import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Fresh Mutton Pack Details | Bulk Mutton Order — Ragu Goat Farm",
  description:
    "View weight options, pricing, and delivery districts for our fresh mutton packs. Book bulk naatu aadu mutton online — same-day cut and delivered across Tamil Nadu.",
  keywords: [
    "fresh mutton pack price Tamil Nadu",
    "bulk mutton order Villupuram",
    "naatu aadu mutton pack",
    "mutton home delivery Tamil Nadu",
    "fresh mutton bulk order",
    "mutton price per kg today",
    "mutton delivery districts Tamil Nadu",
  ],
  alternates: {
    canonical: "/mutton",
  },
  openGraph: {
    title: "Fresh Mutton Pack | Ragu Goat Farm — Villupuram",
    description:
      "Farm-fresh bulk mutton packs — customizable weight options, fresh cut, delivered fresh across Tamil Nadu.",
    type: "website",
    locale: "en_IN",
    siteName: "Ragu Goat Farm",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mutton Pack Details | Ragu Goat Farm",
    description:
      "Bulk naatu aadu mutton — customizable kg options, quality-inspected fresh home delivery across Tamil Nadu.",
  },
};

export default function MuttonLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
