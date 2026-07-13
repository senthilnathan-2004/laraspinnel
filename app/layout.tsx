import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

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

export async function generateMetadata(): Promise<Metadata> {
  let title = "Ragu Goat Farm | Premium Live Goats & Fresh Mutton in Tamil Nadu";
  let description = "Order premium breed live goats delivered across Tamil Nadu and farm-fresh bulk mutton in Coimbatore, Tiruppur, Erode, and Villupuram.";
  let favicon = "/favicon.ico";

  try {
    await connectToDatabase();
    const settings = await SiteSettings.find({
      key: { $in: ["seo_title", "seo_description", "favicon_url"] }
    });
    
    const getSetting = (k: string) => settings.find(s => s.key === k)?.value;
    
    title = getSetting("seo_title") || title;
    description = getSetting("seo_description") || description;
    favicon = getSetting("favicon_url") || favicon;
  } catch (error) {
    console.error("Error loading site settings for metadata:", error);
  }

  return {
    title,
    description,
    icons: {
      icon: favicon,
    },
  };
}

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-white text-brand-black">
        <div className="flex flex-col min-h-screen overflow-x-hidden w-full relative">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
