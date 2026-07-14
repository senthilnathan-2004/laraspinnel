import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/dashboard/", "/api/private/", "/login/", "/auth/"],
      },
      // Ensure AI Crawlers have explicit, individual rules for strict parsers
      ...[
        "GPTBot",
        "ChatGPT-User",
        "ClaudeBot",
        "Claude-Web",
        "Google-Extended",
        "Applebot-Extended",
        "PerplexityBot",
        "cohere-ai",
        "facebookexternalhit",
        "Bingbot",
        "Googlebot",
      ].map((bot) => ({
        userAgent: bot,
        allow: "/",
        disallow: ["/admin/", "/dashboard/", "/api/private/", "/login/", "/auth/"],
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
