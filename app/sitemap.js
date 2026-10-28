import { yazilar } from "@/lib/blog";
import { yayindakiIller } from "@/lib/il-icerik";

const SITE = "https://www.tevkilgo.org";

export default async function sitemap() {
  const bloglar = await yazilar();
  const sonIl = yayindakiIller().map((il) => il.guncelleme).filter(Boolean).sort().at(-1);
  const sonYazi = bloglar.map((y) => y.guncelleme_tarihi).sort().at(-1);

  return [
    { url: SITE, lastModified: sonIl, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/illere-gore-tevkil`, lastModified: sonIl, changeFrequency: "monthly", priority: 0.9 },
    ...yayindakiIller().map((il) => ({
      url: `${SITE}${il.yol}`,
      lastModified: il.guncelleme,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
    ...(bloglar.length ? [{ url: `${SITE}/blog`, lastModified: sonYazi, changeFrequency: "weekly", priority: 0.8 }] : []),
    ...bloglar.map((y) => ({
      url: `${SITE}/${y.slug}`,
      lastModified: y.guncelleme_tarihi,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
    { url: `${SITE}/hakkimizda`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/iletisim`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/gizlilik`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/kvkk`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/kullanim-kosullari`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/hesap-silme`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
