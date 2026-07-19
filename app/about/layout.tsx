import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About Lara's Pinnal | Handmade Crochet Gifts, Villupuram, Tamil Nadu",
  description:
    "Lara's Pinnal is a family-run handmade crochet gifts studio in Villupuram, Tamil Nadu. Crochet flower bouquets, amigurumi plush, photo frames, and gift hampers made with premium milk cotton yarn. Shipping across India.",
  keywords: [
    "about Lara's Pinnal",
    "handmade crochet gifts Villupuram Tamil Nadu",
    "crochet flower bouquets Tamil Nadu",
    "amigurumi plush toys India",
    "custom crochet photo frames",
    "milk cotton yarn crochet gifts",
    "handcrafted crochet keychains",
    "crochet gift hampers Tamil Nadu",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Lara's Pinnal | Handmade Crochet Gifts & Flowers, Villupuram",
    description:
      "Learn about Lara's Pinnal — handcrafted crochet flowers, amigurumi, and gift hampers made with love in Villupuram, Tamil Nadu. Shipping across India, 3500+ happy gifts delivered.",
    type: "website",
    locale: "en_IN",
    siteName: "Lara's Pinnal",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Lara's Pinnal | Handmade Crochet Gifts, Villupuram",
    description:
      "Handcrafted crochet flowers, amigurumi, and gift hampers made with premium milk cotton yarn — Lara's Pinnal, Villupuram, Tamil Nadu.",
  },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
