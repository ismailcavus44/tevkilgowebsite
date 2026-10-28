import { HomeFooter } from "@/components/HomeFooter";
import { SayfaHero } from "@/components/SayfaHero";
import { YaziKarti } from "@/components/blog/YaziKarti";
import { SITE, yazilar } from "@/lib/blog";

const BASLIK = "Blog: Tevkil, Yetki Belgesi ve Avukatlık Pratiği | TevkilGO";
const ACIKLAMA =
  "Tevkil ücreti, yetki belgesi, mazeret, UYAP ve adliye rehberleri. Avukatların duruşma ve adliye işlerinde ihtiyaç duyduğu pratik yazılar.";

export async function generateMetadata() {
  const liste = await yazilar();
  return {
    title: { absolute: BASLIK },
    description: ACIKLAMA,
    alternates: { canonical: "/blog" },
    // Yazı yokken boş liste dizine girmesin
    robots: liste.length ? undefined : { index: false, follow: true },
    openGraph: { type: "website", siteName: "TevkilGO", locale: "tr_TR", url: "/blog", title: BASLIK, description: ACIKLAMA },
    twitter: { card: "summary_large_image", title: BASLIK, description: ACIKLAMA },
  };
}

function sema(liste) {
  const url = `${SITE}/blog`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: "TevkilGO",
        url: SITE,
        logo: `${SITE}/icon.png`,
        email: "destek@tevkilgo.org",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        name: "TevkilGO",
        url: SITE,
        inLanguage: "tr-TR",
        publisher: { "@id": `${SITE}/#organization` },
      },
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: "TevkilGO Blog",
        description: ACIKLAMA,
        inLanguage: "tr-TR",
        isPartOf: { "@id": `${SITE}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: { "@id": `${url}#blog` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "TevkilGO", item: SITE },
          { "@type": "ListItem", position: 2, name: "Blog", item: url },
        ],
      },
      {
        "@type": "Blog",
        "@id": `${url}#blog`,
        name: "TevkilGO Blog",
        url,
        inLanguage: "tr-TR",
        publisher: { "@id": `${SITE}/#organization` },
        blogPost: liste.map((y) => ({
          "@type": "BlogPosting",
          "@id": `${SITE}/${y.slug}#yazi`,
          headline: y.baslik.slice(0, 110),
          url: `${SITE}/${y.slug}`,
          datePublished: y.yayin_tarihi,
          dateModified: y.guncelleme_tarihi,
          ...(y.kapak_url ? { image: y.kapak_url } : {}),
        })),
      },
    ],
  };
}

export default async function BlogSayfasi() {
  const liste = await yazilar();

  return (
    <main id="icerik" className="overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sema(liste)).replace(/</g, "\\u003c") }}
      />

      <SayfaHero
        ust="Blog"
        baslik="Tevkil ve avukatlık pratiği üzerine yazılar"
        metin="Tevkil ücreti, yetki belgesi, mazeret, UYAP ve adliyeler. Duruşma ve adliye işlerinde işine yarayacak pratik bilgiler."
      />

      <section className="px-5 py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          {liste.length ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {liste.map((y, i) => (
                <li key={y.slug}>
                  <YaziKarti yazi={y} oncelikli={i < 3} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-dashed border-line px-6 py-16 text-center text-[15px] text-muted">
              İlk yazılar çok yakında burada.
            </p>
          )}
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
