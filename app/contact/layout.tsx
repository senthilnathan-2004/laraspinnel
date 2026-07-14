import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Ragu Goat Farm | Goat Farm Phone Number & WhatsApp — Villupuram",
  description:
    "Contact Ragu Goat Farm in Villupuram, Tamil Nadu. Call or WhatsApp for live goat booking, mutton delivery enquiries, wholesale pricing, and bulk orders. We respond within hours.",
  keywords: [
    "Ragu Goat Farm contact number",
    "goat farm phone number Villupuram",
    "contact goat farm Tamil Nadu",
    "WhatsApp goat order Villupuram",
    "goat farm address Villupuram",
    "mutton delivery enquiry Tamil Nadu",
    "goat farm business hours",
    "bulk mutton enquiry Villupuram",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Ragu Goat Farm | Phone & WhatsApp — Villupuram",
    description:
      "Reach Ragu Goat Farm for live goat bookings, fresh mutton delivery, and wholesale enquiries. Call, WhatsApp, or fill the form.",
    type: "website",
    locale: "en_IN",
    siteName: "Ragu Goat Farm",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Ragu Goat Farm | Villupuram",
    description:
      "Get in touch for live goat booking, mutton delivery, or wholesale enquiries — Ragu Goat Farm, Villupuram, Tamil Nadu.",
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
