import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Buy Live Goats Online | Tellicherry, Boer & Naatu Aadu for Sale — Tamil Nadu",
  description:
    "Browse premium live goat breeds at Ragu Goat Farm — Tellicherry, Boer cross, Kanni Aadu, Sirohi & more. Order healthy live goats online with safe delivery across Tamil Nadu. Bakrid advance booking open.",
  keywords: [
    "live goat for sale Tamil Nadu",
    "Tellicherry goat for sale",
    "Boer goat Tamil Nadu",
    "Kanni aadu for sale",
    "naatu aadu vitpanai Villupuram",
    "goat online booking Tamil Nadu",
    "Bakrid goat booking 2026",
    "goat delivery Tamil Nadu",
    "pure breed goat farm Tamil Nadu",
    "Salem black goat price",
    "goat weight price Tamil Nadu",
    "healthy goat farm Villupuram",
  ],
  alternates: {
    canonical: "/goats",
  },
  openGraph: {
    title: "Buy Live Goats Online | Tellicherry, Boer & Naatu Aadu — Ragu Farm",
    description:
      "Order healthy Tellicherry, Boer cross, Kanni Aadu and naatu aadu breeds from Ragu Goat Farm, Villupuram. Safe delivery across all Tamil Nadu districts.",
    type: "website",
    locale: "en_IN",
    siteName: "Ragu Goat Farm",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Goats for Sale | Ragu Goat Farm, Villupuram",
    description:
      "Premium Tellicherry, Boer, Kanni Aadu & naatu aadu breeds. Book live goats online — delivery across Tamil Nadu.",
  },
};

export default function GoatsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
