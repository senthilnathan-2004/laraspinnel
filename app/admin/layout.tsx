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
  let title = "Ragu Goat Farm | Live Goat & Fresh Mutton Delivery — Villupuram, Tamil Nadu";
  let description =
    "Buy healthy live goats online from Ragu Goat Farm, Villupuram. Farm-fresh naatu aadu, Tellicherry & Boer breeds. Bulk mutton home delivery across Tamil Nadu. Bakrid bookings open.";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let farmName = "Ragu Goat Farm";
  let phone = "+91 9442379832";
  let email = "senthilraguanthan2004@gmail.com";
  let address = "2/90 MettuStreet, Therkunam, Villupuram, Tamil Nadu - 604102";

  try {
    await connectToDatabase();
    const settings = await SiteSettings.find({
      key: { $in: ["farm_name", "contact_phone", "contact_email", "contact_address"] }
    });
    const getSetting = (k: string) => settings.find(s => s.key === k)?.value;
    farmName = getSetting("farm_name") || farmName;
    phone = getSetting("contact_phone") || phone;
    email = getSetting("contact_email") || email;
    address = getSetting("contact_address") || address;
  } catch (error) {
    console.error("Error loading settings for RootLayout schema:", error);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${BASE_URL}/#localbusiness`,
        "name": farmName,
        "image": `${BASE_URL}/placeholder-goat.jpg`,
        "url": BASE_URL,
        "telephone": phone,
        "email": email,
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": address.split(",")[0]?.trim() || "2/90 MettuStreet",
          "addressLocality": "Villupuram",
          "addressRegion": "Tamil Nadu",
          "postalCode": "642001",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 11.9401,
          "longitude": 79.4861
        },
        "areaServed": ["Villupuram", "Chennai", "Pondicherry", "Tamil Nadu"],
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "06:00",
          "closes": "20:00"
        }
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        "name": farmName,
        "url": BASE_URL,
        "logo": `${BASE_URL}/placeholder-goat.jpg`,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": phone,
          "contactType": "customer service",
          "areaServed": "IN",
          "availableLanguage": ["English", "Tamil"]
        }
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        "url": BASE_URL,
        "name": farmName,
        "publisher": {
          "@id": `${BASE_URL}/#organization`
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Do you deliver mutton to Chennai from Villupuram?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we provide bulk fresh mutton delivery to Chennai, Villupuram, and surrounding areas in Tamil Nadu."
            }
          },
          {
            "@type": "Question",
            "name": "What breeds of live goats do you sell?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We specialize in healthy Tellicherry, Boer, and local Naatu Aadu goat breeds."
            }
          }
        ]
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-white text-brand-black">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:p-4 focus:bg-brand-black focus:text-white"
        >
          Skip to main content
        </a>
        <div className="flex flex-col min-h-screen overflow-x-hidden w-full relative" id="main-content">
          <Providers>{children}</Providers>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
