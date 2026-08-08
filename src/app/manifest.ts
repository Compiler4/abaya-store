import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rify Luxe Abaya",
    short_name: "Rify Luxe",
    description: "Rify Luxe Abaya store and administration application.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f6fa",
    theme_color: "#0d302c",
    icons: [
      {
        src: "/rify-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
