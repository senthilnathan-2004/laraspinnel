import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ragugoatfarm.com";

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
