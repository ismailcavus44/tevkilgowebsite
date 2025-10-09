import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.tevkilgo.com";
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/kvkk`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/gizlilik-politikasi`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/sorumluluk-reddi`, changeFrequency: "yearly", priority: 0.5 },
  ];
}



