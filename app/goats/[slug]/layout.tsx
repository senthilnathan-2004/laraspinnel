import type { Metadata } from "next";
import type { ReactNode } from "react";
import { connectToDatabase } from "@/lib/db";
import GoatVariety from "@/models/GoatVariety";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectToDatabase();
    const goat = await GoatVariety.findOne({ slug });
    if (goat) {
      const displayTitle = `${goat.name} | Live Goat for Sale — Ragu Farm`;
      const displayDesc = `${goat.description.substring(0, 150)}... Buy healthy ${goat.name} in Villupuram, Tamil Nadu.`;
      return {
        title: displayTitle,
        description: displayDesc,
        keywords: [
          goat.name,
          goat.breed,
          "live goat for sale Tamil Nadu",
          "goat farm Villupuram",
          "Ragu Goat Farm",
        ],
        alternates: {
          canonical: `/goats/${slug}`,
        },
        openGraph: {
          title: displayTitle,
          description: displayDesc,
          type: "website",
          locale: "en_IN",
          siteName: "Ragu Goat Farm",
          images: goat.images?.[0] ? [{ url: goat.images[0] }] : [],
        },
        twitter: {
          card: "summary_large_image",
          title: displayTitle,
          description: displayDesc,
        },
      };
    }
  } catch (error) {
    console.error("Error loading goat metadata:", error);
  }
  return {
    title: "Live Goat Details | Breed Specifications & Booking — Ragu Goat Farm",
    description:
      "View detailed breed specifications, weight ranges, and price estimates for our live goats.",
  };
}

export default function GoatDetailLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
