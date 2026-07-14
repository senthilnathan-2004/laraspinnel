import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
};

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

import { SITE_URL } from "@/lib/siteUrl";
const BASE_URL = SITE_URL;

export async function generateMetadata(): Promise<Metadata> {
  let title = "Ragu Goat Farm | Live Goats & Mutton in Tamil Nadu";
  let description =
    "Buy healthy live goats & fresh mutton from Ragu Goat Farm, Villupuram. Naatu aadu, Boer & Tellicherry breeds delivered across Tamil Nadu.";
  let favicon = "/icon.svg";

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
      languages: {
        "en-IN": "/",
      },
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
      apple: favicon,
      shortcut: favicon,
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
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let farmName = "Ragu Goat Farm";
  let phone = "+91 9442379832";
  let email = "senthilraguanthan2004@gmail.com";
  let address = "2/90 MettuStreet, Therkunam, Villupuram, Tamil Nadu - 604102";
  let socialLinks: string[] = [];

  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

  try {
    await connectToDatabase();
    const settings = await SiteSettings.find({
      key: { $in: ["farm_name", "contact_phone", "contact_email", "contact_address", "social_facebook", "social_instagram", "social_youtube"] }
    });
    const getSetting = (k: string) => settings.find(s => s.key === k)?.value;
    farmName = getSetting("farm_name") || farmName;
    phone = getSetting("contact_phone") || phone;
    email = getSetting("contact_email") || email;
    address = getSetting("contact_address") || address;
    socialLinks = [
      getSetting("social_facebook"),
      getSetting("social_instagram"),
      getSetting("social_youtube"),
    ].filter((v): v is string => Boolean(v));
  } catch (error) {
    console.error("Error loading settings for RootLayout schema:", error);
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/#localbusiness`,
      "name": farmName,
      "image": `${BASE_URL}/placeholder-goat.jpg`,
      "url": BASE_URL,
      "telephone": phone,
      "email": email,
      "priceRange": "$$",
      "sameAs": socialLinks,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": address.split(",")[0]?.trim() || "2/90 MettuStreet",
        "addressLocality": "Villupuram",
        "addressRegion": "Tamil Nadu",
        "postalCode": "604102",
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
      "@context": "https://schema.org",
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
      },
      "sameAs": socialLinks
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "url": BASE_URL,
      "name": farmName,
      "publisher": {
        "@id": `${BASE_URL}/#organization`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": BASE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Goats",
          "item": `${BASE_URL}/goats`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Mutton",
          "item": `${BASE_URL}/mutton`
        }
      ]
    },
    {
      "@context": "https://schema.org",
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
  ];

  return (
    <html
      lang="en-IN"
      className={`${anton.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="alternate" type="text/plain" href="/llms.txt" />
      </head>
      <body className="min-h-full flex flex-col font-body bg-white text-brand-black">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:z-9999 focus:p-4 focus:bg-brand-black focus:text-white"
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
        {/* Facebook Pixel — only rendered when NEXT_PUBLIC_FB_PIXEL_ID is set */}
        {FB_PIXEL_ID && (
          <>
            <Script
              id="fb-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${FB_PIXEL_ID}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
                alt="Facebook Pixel"
              />
            </noscript>
          </>
        )}
        {/* Google Analytics — only rendered when NEXT_PUBLIC_GA_ID is set */}
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
