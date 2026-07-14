import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Festival & Bakrid Goat Booking | Custom Goat Order — Ragu Goat Farm",
  description:
    "Book a custom goat for Bakrid, house warming, village festival, or wedding function. Specify your preferred color, weight, and age. Ragu Goat Farm, Villupuram — Tamil Nadu-wide delivery.",
  keywords: [
    "Bakrid goat booking 2026 Tamil Nadu",
    "festival goat booking Villupuram",
    "Bakrid qurbani goat Tamil Nadu",
    "custom goat order for function",
    "goat for sacrifice Tamil Nadu",
    "temple festival goat booking",
    "house warming function goat order",
    "wedding function goat booking",
    "village festival goat order",
    "paku kurban adu booking Tamil Nadu",
    "advance goat booking Bakrid",
  ],
  alternates: {
    canonical: "/festival-booking",
  },
  openGraph: {
    title: "Bakrid & Festival Goat Booking | Custom Order — Ragu Goat Farm",
    description:
      "Order a custom goat for Bakrid, house warming, or village festival. Choose color, weight, and age. Delivery across Tamil Nadu from Ragu Goat Farm, Villupuram.",
    type: "website",
    locale: "en_IN",
    siteName: "Ragu Goat Farm",
  },
  twitter: {
    card: "summary_large_image",
    title: "Festival Goat Booking | Ragu Goat Farm, Villupuram",
    description:
      "Custom Bakrid & festival goat orders — specify color, weight & age. Tamil Nadu-wide delivery from Ragu Goat Farm.",
  },
};

export default function FestivalBookingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
