import { yayindakiIller } from "@/lib/il-icerik";

const SITE = "https://www.tevkilgo.org";

export default function sitemap() {
  return [
    { url: SITE, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/illere-gore-tevkil`, changeFrequency: "monthly", priority: 0.9 },
    ...yayindakiIller().map((il) => ({
      url: `${SITE}${il.yol}`,
      lastModified: il.guncelleme,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
    { url: `${SITE}/hakkimizda`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/iletisim`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/gizlilik`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/kvkk`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/kullanim-kosullari`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/hesap-silme`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
