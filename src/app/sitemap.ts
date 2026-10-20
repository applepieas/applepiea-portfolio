import type { MetadataRoute } from "next";

const BASE = "https://pavelrosenberg.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/case-study/voice-agent`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE}/case-study/backend-integration`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE}/case-study/landing-pages`, changeFrequency: "yearly", priority: 0.5 },
  ];
}
