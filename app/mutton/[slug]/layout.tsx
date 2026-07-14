import type { Metadata } from "next";
import type { ReactNode } from "react";
import { connectToDatabase } from "@/lib/db";
import MuttonPack from "@/models/MuttonPack";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectToDatabase();
    const pack = await MuttonPack.findOne({ slug });
    if (pack) {
      const displayTitle = `${pack.name} | Fresh Mutton Pack — Ragu Farm`;
      const displayDesc = `${pack.description.substring(0, 150)}... Order fresh ${pack.name} online with same-day home delivery in Tamil Nadu.`;
      return {
        title: displayTitle,
        description: displayDesc,
        keywords: [
          pack.name,
          "fresh mutton pack",
          "bulk mutton delivery Tamil Nadu",
          "mutton delivery Villupuram",
          "Ragu Goat Farm",
        ],
        alternates: {
          canonical: `/mutton/${slug}`,
        },
        openGraph: {
          title: displayTitle,
          description: displayDesc,
          type: "website",
          locale: "en_IN",
          siteName: "Ragu Goat Farm",
          images: pack.images?.[0] ? [{ url: pack.images[0] }] : [],
        },
        twitter: {
          card: "summary_large_image",
          title: displayTitle,
          description: displayDesc,
        },
      };
    }
  } catch (error) {
    console.error("Error loading mutton metadata:", error);
  }
  return {
    title: "Fresh Mutton Pack Details | Bulk Mutton Order — Ragu Goat Farm",
    description:
      "View weight options, pricing, and delivery districts for our fresh mutton packs.",
  };
}

export default function MuttonDetailLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
