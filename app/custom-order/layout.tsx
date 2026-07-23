import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Crochet Orders | Made by Hand, Made for You — Lara's Pinnal",
  description:
    "Design your own custom crochet creation from Lara's Pinnal — pick colors, size, and personalization for forever bouquets, amigurumi plushies, frames, and gift hampers, handmade in Tamil Nadu.",
  keywords: [
    "custom crochet order online",
    "personalized crochet gifts Tamil Nadu",
    "custom crochet bouquet India",
    "made to order amigurumi",
    "customized handmade gifts Villupuram",
  ],
  alternates: {
    canonical: "/custom-order",
  },
  openGraph: {
    title: "Custom Crochet Orders | Lara's Pinnal",
    description:
      "Tell us your idea — colors, occasion, and details — and we'll handcraft something uniquely yours. Custom bouquets, plushies, frames, and hampers.",
    type: "website",
    locale: "en_IN",
    siteName: "Lara's Pinnal",
    url: "/custom-order",
  },
};

export default function CustomOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
