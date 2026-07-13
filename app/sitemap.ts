import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.khmerbamboosakyant.com";

const routes = [
  "",
  "/about",
  "/artists",
  "/gallery",
  "/services",
  "/booking",
  "/contact",
  "/aftercare",
  "/reviews",
  "/promotions",
  "/store",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/gallery" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/booking" || route === "/contact" ? 0.9 : 0.8,
  }));
}
