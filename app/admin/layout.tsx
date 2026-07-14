import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "../globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

import { connectToDatabase } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://ragugoatfarm.com";

export async function generateMetadata(): Promise<Metadata> {
  let title = "Ragu Goat Farm | Live Goats & Mutton Villupuram";
  let description =
    "Buy healthy live goats & fresh mutton online from Ragu Goat Farm, Villupuram. Farm-fresh breeds with delivery across Tamil Nadu. Book now!";
  let favicon = "/favicon.ico";

  try {
    await connectToDatabase();
    const settings = await SiteSettings.find({
      key: { $in: ["seo_title", "seo_description", "favicon_url"] },
    });

    const getSetting = (k: string) => settings.find((s) => s.key === k)?.value;

    title = getSetting("seo_title") || title;
    description = getSetting("seo_description") || description;
    favicon = getSetting("favicon_url") || favicon;
  } catch (error) {
    console.error("Error loading site settings for metadata:", error);
  }

  return {
    title,
    description,
    keywords: [
      "live goat for sale Tamil Nadu",
      "goat farm Villupuram",
      "naatu aadu vitpanai",
      "Bakrid goat booking",
      "fresh mutton delivery Villupuram",
      "Tellicherry goat",
      "Boer goat Tamil Nadu",
      "mutton home delivery",
      "bulk mutton order",
      "goat farm near Villupuram",
      "Ragu Goat Farm",
    ],
    authors: [{ name: "Ragu Goat Farm", url: BASE_URL }],
    creator: "Ragu Goat Farm",
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
      openGraph: {
        type: "website",
        locale: "en_IN",
        url: BASE_URL,
        siteName: "Ragu Goat Farm",
        title,
        description,
        images: [
          {
            url: "/placeholder-goat.jpg",
            width: 1200,
            height: 630,
            alt: "Ragu Goat Farm Boer Goat",
          },
        ],
      },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: {
      icon: favicon,
    },
    other: {
      "geo.region": "IN-TN",
      "geo.placename": "Villupuram",
      "geo.position": "11.9401;79.4861",
      ICBM: "11.9401, 79.4861",
    },
  };
}

import { Providers } from "@/components/Providers";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-brand-light-gray/20 w-full relative">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto w-full relative flex flex-col">
        <Providers>{children}</Providers>
      </div>
    </div>
  );
}
