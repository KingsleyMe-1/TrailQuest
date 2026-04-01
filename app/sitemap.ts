import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://trailquest.vercel.app";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/trails`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/events`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/community`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
