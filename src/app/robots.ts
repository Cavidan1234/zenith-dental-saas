import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/b/"],
        disallow: ["/dashboard", "/login", "/explorer", "/api/"],
      },
    ],
    sitemap: "https://zenith-dental-studio-sage.vercel.app/sitemap.xml",
  };
}
