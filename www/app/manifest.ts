import type { MetadataRoute } from "next";
import { siteConfig } from "~/src/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#000",
    theme_color: "#000",
    icons: [
      {
        src: "/img/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/img/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
