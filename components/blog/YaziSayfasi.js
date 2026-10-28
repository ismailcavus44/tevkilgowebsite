import Image from "next/image";
import Link from "next/link";
import { CaretRight, Lightning, Plus } from "@phosphor-icons/react/ssr";
import { Bolum, kart } from "@/components/Bolum";
import { HomeFooter } from "@/components/HomeFooter";
import { HomeHeader } from "@/components/HomeHeader";
import { WebUyeOl } from "@/components/HomeHero";
import { YaziKarti } from "@/components/blog/YaziKarti";
import { guncellendiMi, KATEGORILER, SITE, tarihYaz } from "@/lib/blog";

function sema({ yazi, govde, url }) {
  const kategori = KATEGORILER[yazi.kategori] || "Rehber";
  const gorsel = yazi.kapak_url || `${SITE}/gorsel/${yazi.slug}`;
  const aciklama = yazi.meta_aciklama || yazi.ozet;

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
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: yazi.baslik,
        description: aciklama,
        inLanguage: "tr-TR",
        isPartOf: { "@id": `${SITE}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        primaryImageOfPage: { "@type": "ImageObject", url: gorsel },
        datePublished: yazi.yayin_tarihi,
        dateModified: yazi.guncelleme_tarihi,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "TevkilGO", item: SITE },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
          { "@type": "ListItem", position: 3, name: yazi.baslik, item: url },
        ],
      },
      {
        "@type": "BlogPosting",
        "@id": `${url}#yazi`,
        headline: yazi.baslik.slice(0, 110),
        description: aciklama,
        image: { "@type": "ImageObject", url: gorsel, width: 1200, height: 630 },
        datePublished: yazi.yayin_tarihi,
        dateModified: yazi.guncelleme_tarihi,
        author: { "@id": `${SITE}/#organization` },
        publisher: { "@id": `${SITE}/#organization` },
        mainEntityOfPage: { "@id": `${url}#webpage` },
        isPartOf: { "@type": "Blog", "@id": `${SITE}/blog#blog`, name: "TevkilGO Blog", url: `${SITE}/blog` },
        articleSection: kategori,
        inLanguage: "tr-TR",
        wordCount: govde.kelime,
        timeRequired: `PT${govde.dakika}M`,
        audience: { "@type": "Audience", audienceType: "Avukatlar" },
        ...(yazi.bir_bakista?.length
          ? { abstract: yazi.bir_bakista.map((m) => (m.etiket ? `${m.etiket}: ${m.deger}` : m.deger)).join(" ") }
          : {}),
        ...(govde.kaynaklar.length ? { citation: govde.kaynaklar } : {}),
      },
      ...(yazi.sss?.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${url}#sss`,
              isPartOf: { "@id": `${url}#webpage` },
              mainEntity: yazi.sss.map((s) => ({
                "@type": "Question",
                name: s.soru,
                acceptedAnswer: { "@type": "Answer", text: s.cevap },
              })),
            },
          ]
        : []),
    ],
  };
}

// H2'ler 1, 2, 3; altlarındaki H3'ler 1.1, 1.2 diye numaralanır
function numarala(basliklar) {
  let ana = 0;
  let alt = 0;
  return basliklar.map((b) => {
    if (b.seviye === 2) {
      ana += 1;
      alt = 0;
      return { ...b, no: `${ana}.` };
    }
    alt += 1;
    return { ...b, no: ana ? `${ana}.${alt}.` : null };
  });
}

function Icindekiler({ basliklar }) {
  return (
    <ol className="space-y-2 text-[14px] leading-snug">
      {numarala(basliklar).map((b) => (
        <li key={b.id} className={`flex gap-2 ${b.seviye === 3 ? "pl-4" : ""}`}>
          {b.no ? <span className="shrink-0 pt-px text-[11px] tabular-nums text-ink/40">{b.no}</span> : null}
          <a href={`#${b.id}`} className="text-muted underline-offset-4 hover:text-ink hover:underline">
            {b.ad}
          </a>
        </li>
      ))}
    </ol>
  );
}

// Yazının ana bilgileri tek blokta: okuyucu hızlıca tarar, yapay zekâ ve arama motorları
// cevap olarak alıntılar. Etiket–değer çiftleri <dl> ile işaretlenir.
function BirBakista({ baslik, maddeler }) {
  return (
    <section
      aria-label={baslik || "Bir bakışta"}
      className="mb-10 max-w-[44rem] rounded-[16px] border border-line bg-surface p-1.5 shadow-[0_1px_2px_rgb(18_38_63/0.05)]"
    >
      <p className="flex items-center gap-2 px-3.5 pb-2 pt-2.5 text-[13px] font-bold text-ink">
        <span className="grid size-5 shrink-0 place-items-center rounded bg-ink text-gold" aria-hidden="true">
          <Lightning size={12} weight="fill" />
        </span>
        {baslik || "Bir bakışta"}
      </p>
      <dl className="grid gap-1.5 sm:grid-cols-2">
        {maddeler.map((m, i) => (
          <div key={i} className="rounded-[10px] bg-canvas px-3.5 py-2.5">
            {m.etiket ? <dt className="text-[12px] font-semibold text-ink/60">{m.etiket}</dt> : null}
            <dd className={`text-[14px] font-semibold leading-snug text-ink ${m.etiket ? "mt-0.5" : ""}`}>{m.deger}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function YaziSayfasi({ yazi, govde, ilgili }) {
  const url = `${SITE}/${yazi.slug}`;
  const kategori = KATEGORILER[yazi.kategori] || "Rehber";
  const toc = govde.icindekiler.filter((b) => b.seviye === 2).length >= 2 ? govde.icindekiler : [];

  return (
    <main id="icerik" className="overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sema({ yazi, govde, url })).replace(/</g, "\\u003c") }}
      />

      <div className="p-2 md:p-4">
        <section className="relative overflow-hidden rounded-[32px] bg-ink">
          <HomeHeader />
          <div className="mx-auto max-w-5xl px-6 pb-14 pt-8 lg:px-5 lg:pb-16 lg:pt-10">
            <nav aria-label="Konum">
              <ol className="flex flex-wrap items-center gap-1.5 text-[14px] font-semibold text-white/60">
                <li>
                  <Link href="/" className="hover:text-white">TevkilGO</Link>
                </li>
                <li aria-hidden="true"><CaretRight size={12} weight="bold" /></li>
                <li>
                  <Link href="/blog" className="hover:text-white">Blog</Link>
                </li>
                <li aria-hidden="true"><CaretRight size={12} weight="bold" /></li>
                <li className="text-white/80">{kategori}</li>
              </ol>
            </nav>
            <h1 className="mt-6 max-w-[24ch] text-[32px] font-extrabold leading-[1.1] tracking-[-0.025em] text-white lg:text-[48px]">
              {yazi.baslik}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] text-white/70">
              <span className="flex items-center gap-3">
                <Image src="/icon.png" alt="" width={32} height={32} className="size-8 rounded-lg" />
                <span className="font-semibold text-white">TevkilGO</span>
              </span>
              <span>
                <time dateTime={yazi.yayin_tarihi}>{tarihYaz(yazi.yayin_tarihi)}</time>
                {guncellendiMi(yazi) ? (
                  <>
                    {" "}· Güncellendi: <time dateTime={yazi.guncelleme_tarihi}>{tarihYaz(yazi.guncelleme_tarihi)}</time>
                  </>
                ) : null}
              </span>
              <span>{govde.dakika} dk okuma</span>
            </div>
          </div>
        </section>
      </div>

      <div className="px-5 py-10 md:py-14">
        <div className={`mx-auto grid max-w-5xl gap-12 ${toc.length ? "lg:grid-cols-[minmax(0,1fr)_240px]" : ""}`}>
          <article className="min-w-0">
            {yazi.kapak_url ? (
              <figure className="mb-10 overflow-hidden rounded-[20px] border border-line bg-surface">
                <Image
                  src={yazi.kapak_url}
                  alt={yazi.kapak_alt || ""}
                  width={1200}
                  height={630}
                  priority
                  sizes="(min-width: 1024px) 720px, 100vw"
                  className="h-auto w-full"
                />
              </figure>
            ) : null}

            {yazi.bir_bakista?.length ? <BirBakista baslik={yazi.bir_bakista_baslik} maddeler={yazi.bir_bakista} /> : null}

            {toc.length ? (
              <details className={`${kart} group mb-10 px-5 lg:hidden`}>
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                  İçindekiler
                  <Plus size={16} weight="bold" className="text-muted group-open:rotate-45 motion-safe:transition-transform" />
                </summary>
                <div className="pb-5">
                  <Icindekiler basliklar={toc} />
                </div>
              </details>
            ) : null}

            <div className="blog-govde" dangerouslySetInnerHTML={{ __html: govde.html }} />

            {yazi.sss?.length ? (
              <section id="sss" className="mt-14" aria-labelledby="sss-baslik">
                <h2 id="sss-baslik" className="text-[26px] font-semibold tracking-[-0.015em]">Sık sorulan sorular</h2>
                <div className={`${kart} mt-6 px-6`}>
                  {yazi.sss.map((s) => (
                    <details key={s.soru} className="group border-b border-line last:border-b-0">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                        <h3>{s.soru}</h3>
                        <Plus size={16} weight="bold" className="shrink-0 text-muted group-open:rotate-45 motion-safe:transition-transform" />
                      </summary>
                      <p className="-mt-1 whitespace-pre-line pb-5 text-[15px] leading-relaxed text-muted">{s.cevap}</p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

          </article>

          {toc.length ? (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">İçindekiler</p>
                <Icindekiler basliklar={toc} />
              </div>
            </aside>
          ) : null}
        </div>
      </div>

      <div className="p-2 md:px-4">
        <section className="flex flex-col gap-8 rounded-[32px] bg-ink px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-14">
          <div>
            <h2 className="text-[26px] font-extrabold leading-tight tracking-[-0.015em] text-white lg:text-[30px]">
              Duruşmana gidemiyorsan meslektaşın gitsin
            </h2>
            <p className="mt-3 max-w-[30rem] text-[16px] leading-relaxed text-white/70">
              Tevkil ilanını aç, o adliyede çalışan baro kimliğiyle doğrulanmış avukatlar başvursun. Ücretsiz.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <WebUyeOl />
          </div>
        </section>
      </div>

      {ilgili.length ? (
        <Bolum>
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <h2 className="text-[22px] font-semibold tracking-[-0.01em]">İlgili yazılar</h2>
            <Link href="/blog" className="text-[15px] font-semibold text-navy underline-offset-4 hover:underline">
              Tüm yazılar
            </Link>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ilgili.map((y) => (
              <li key={y.slug}>
                <YaziKarti yazi={y} baslikEtiketi="h3" />
              </li>
            ))}
          </ul>
        </Bolum>
      ) : null}

      <HomeFooter />
    </main>
  );
}
