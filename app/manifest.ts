import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lara's Pinnal",
    short_name: "Lara's Pinnal",
    description:
      "Shop handmade crochet gifts and flowers from Lara's Pinnal, Tamil Nadu. Crochet bouquets, amigurumi plushies, custom frames, keychains, and gift hampers shipped across India.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a1a1a",
    lang: "en-IN",
    categories: ["shopping", "lifestyle", "business"],
    icons: [
      {
        src: "/logo.png",
        sizes: "453x358",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
