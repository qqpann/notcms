import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    // TODO: sitemap
    // sitemap: "https://acme.com/sitemap.xml",
  };
}
