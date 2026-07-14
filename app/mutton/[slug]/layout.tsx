import type { Metadata } from "next";
import type { ReactNode } from "react";
import { connectToDatabase } from "@/lib/db";
import MuttonPack from "@/models/MuttonPack";
import { SITE_URL } from "@/lib/siteUrl";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

/**
 * Builds a valid schema.org offer from a free-text price string.
 * "₹800/kg" -> Offer price 800; a range -> AggregateOffer low/high.
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

export default async function MuttonDetailLayout({ children, params }: Props) {
  const { slug } = await params;
  let productLd: Record<string, unknown> | null = null;

  try {
    await connectToDatabase();
    const pack = await MuttonPack.findOne({ slug }).lean() as any;
    if (pack) {
      const url = `${SITE_URL}/mutton/${slug}`;
      productLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${url}#product`,
        name: pack.name,
        description: pack.description,
        image: pack.images?.length ? pack.images : [`${SITE_URL}/placeholder-mutton.jpg`],
        category: "Fresh Mutton / Meat",
        brand: { "@type": "Brand", name: "Ragu Goat Farm" },
        additionalProperty: (pack.weightOptions || []).map((w: string) => ({
          "@type": "PropertyValue",
          name: "Weight Option",
          value: w,
        })),
        offers: buildOffer(pack.price, url, pack.isActive !== false),
      };
    }
  } catch (error) {
    console.error("Error building mutton product schema:", error);
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
