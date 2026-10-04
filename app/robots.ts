import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/properties", "/properties/*", "/about", "/contact"],
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
    ],
  };
}
