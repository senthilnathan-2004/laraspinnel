import type { Metadata } from "next";
import type { ReactNode } from "react";
import { connectToDatabase } from "@/lib/db";
import GoatVariety from "@/models/GoatVariety";
import { SITE_URL } from "@/lib/siteUrl";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

/**
 * Builds a valid schema.org offer from a free-text price string.
 * Ranges (e.g. "₹8,000 – ₹35,000") become an AggregateOffer with low/high;
 * a single value becomes a plain Offer. Avoids the old bug where
 * range digits were concatenated into one giant number.
 */
function buildOffer(priceStr: string, url: string, inStock: boolean) {
  const availability = inStock
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
  const nums = (priceStr || "")
    .replace(/,/g, "")
    .match(/\d+(\.\d+)?/g)
    ?.map(Number) || [];
  const low = nums.length ? Math.min(...nums) : null;
  const high = nums.length ? Math.max(...nums) : null;
  if (low !== null && high !== null && low !== high) {
    return {
      "@type": "AggregateOffer",
      lowPrice: low,
      highPrice: high,
      priceCurrency: "INR",
      availability,
      url,
    };
  }
  if (low !== null) {
    return {
      "@type": "Offer",
      price: low,
      priceCurrency: "INR",
      availability,
      url,
    };
  }
  return { "@type": "Offer", priceCurrency: "INR", availability, url };
}

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

export default async function GoatDetailLayout({ children, params }: Props) {
  const { slug } = await params;
  let productLd: Record<string, unknown> | null = null;

  try {
    await connectToDatabase();
    const goat = await GoatVariety.findOne({ slug }).lean() as any;
    if (goat) {
      const url = `${SITE_URL}/goats/${slug}`;
      productLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${url}#product`,
        name: goat.name,
        description: goat.description,
        image: goat.images?.length ? goat.images : [`${SITE_URL}/placeholder-goat.jpg`],
        category: "Live Goat / Livestock",
        brand: { "@type": "Brand", name: "Ragu Goat Farm" },
        additionalProperty: [
          goat.breed && { "@type": "PropertyValue", name: "Breed", value: goat.breed },
          goat.weightRange && { "@type": "PropertyValue", name: "Weight Range", value: goat.weightRange },
          goat.ageRange && { "@type": "PropertyValue", name: "Age", value: goat.ageRange },
        ].filter(Boolean),
        offers: buildOffer(goat.priceEstimate, url, goat.isActive !== false),
      };
    }
  } catch (error) {
    console.error("Error building goat product schema:", error);
  }

  return (
    <>
      {productLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
        />
      )}
      {children}
    </>
  );
}
