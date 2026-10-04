import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://daboul-realestate.sy";

  // Base static public pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const supabase = await createClient();
    // Only query properties where status = 'available' (publicly visible)
    const { data: properties, error } = await supabase
      .from("properties")
      .select("id, updated_at")
      .eq("status", "available")
      .order("updated_at", { ascending: false });

    if (error || !properties) {
      return staticRoutes;
    }

    const propertyRoutes: MetadataRoute.Sitemap = properties.map((prop) => ({
      url: `${siteUrl}/properties/${prop.id}`,
      lastModified: new Date(prop.updated_at),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...propertyRoutes];
  } catch (err) {
    console.error("Error generating sitemap:", err);
    return staticRoutes;
  }
}
