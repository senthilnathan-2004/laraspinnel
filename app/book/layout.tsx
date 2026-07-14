import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Book a Goat or Mutton Pack Online | Advance Booking — Ragu Goat Farm",
  description:
    "Book your live goat or fresh mutton pack online at Ragu Goat Farm, Villupuram. Easy 3-step booking form. Cash on delivery available. Advance Bakrid goat bookings accepted. WhatsApp booking also open.",
  keywords: [
    "book a goat online Tamil Nadu",
    "goat booking form Villupuram",
    "advance booking goat farm Tamil Nadu",
    "mutton pack online order",
    "Bakrid goat advance booking 2026",
    "cash on delivery goat booking",
    "order live goat online Tamil Nadu",
    "goat online order Villupuram",
    "WhatsApp goat booking",
    "bulk mutton booking online",
  ],
  alternates: {
    canonical: "/book",
  },
  openGraph: {
    title: "Book Live Goat or Mutton Pack Online | Ragu Goat Farm",
    description:
      "Easy online goat and mutton booking from Ragu Farm, Villupuram. 3-step form, cash on delivery, Bakrid advance booking open.",
    type: "website",
    locale: "en_IN",
    siteName: "Ragu Goat Farm",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Goat or Mutton Online | Ragu Goat Farm, Villupuram",
    description:
      "Book live goats and fresh mutton packs online. 3-step form, cash on delivery — Ragu Goat Farm, Tamil Nadu.",
  },
};

export default function BookLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
