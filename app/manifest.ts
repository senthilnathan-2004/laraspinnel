import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ragu Goat Farm",
    short_name: "Ragu Farm",
    description:
      "Buy healthy live goats and fresh bulk mutton from Ragu Goat Farm, Villupuram, Tamil Nadu. Delivery across Tamil Nadu.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a1a1a",
    lang: "en-IN",
    categories: ["shopping", "food", "business"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
