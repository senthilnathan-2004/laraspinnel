import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Lara's Pinnal | Crochet Gifts Phone Number & WhatsApp — Villupuram",
  description:
    "Contact Lara's Pinnal in Villupuram, Tamil Nadu. Call or WhatsApp for custom crochet orders, gift enquiries, bouquet bookings, and bulk gift hampers. We respond within hours.",
  keywords: [
    "Lara's Pinnal contact number",
    "crochet gifts phone number Villupuram",
    "contact crochet studio Tamil Nadu",
    "WhatsApp crochet order Villupuram",
    "crochet gifts address Villupuram",
    "custom crochet enquiry Tamil Nadu",
    "crochet studio business hours",
    "bulk crochet gift hampers Villupuram",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Lara's Pinnal | Phone & WhatsApp — Villupuram",
    description:
      "Reach Lara's Pinnal for custom crochet orders, flower bouquets, and gift hamper enquiries. Call, WhatsApp, or fill the form.",
    type: "website",
    locale: "en_IN",
    siteName: "Lara's Pinnal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Lara's Pinnal | Villupuram",
    description:
      "Get in touch for custom crochet orders, flower bouquets, or gift hamper enquiries — Lara's Pinnal, Villupuram, Tamil Nadu.",
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
