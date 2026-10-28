import { notFound } from "next/navigation";
import { Bank, Buildings, Factory, LockKey, Mountains, Path, Plus, Scales } from "@phosphor-icons/react/ssr";
import { Bolum, BolumBasligi, kart } from "@/components/Bolum";
import { HomeFooter } from "@/components/HomeFooter";
import { HomeHero, WebUyeOl } from "@/components/HomeHero";
import { IlKarti, TumIllerLinki } from "@/components/IlKarti";
import { YaziSayfasi } from "@/components/blog/YaziSayfasi";
import { govdeHazirla, ilgiliYazilar, KATEGORILER, yazi, yazilar } from "@/lib/blog";
import { ilIcerik, ilYolu, yakinIller } from "@/lib/il-icerik";
import { ilVerisi } from "@/lib/iller";
import { ek } from "@/lib/turkce";

const SITE = "https://www.tevkilgo.org";
const EK = "-tevkil";

const ikonlar = {
  yargi: Scales,
  kurum: Bank,
  yol: Path,
  adliye: Buildings,
  cezaevi: LockKey,
  dag: Mountains,
  sanayi: Factory,
};

// Sayfa arama motorları için tam HTML olarak üretilmeli. Suspense iskeleti içeriği gizli bloğa
// taşıyacağından anında geçiş doğrulaması bu sayfada kapatılır.
export const instant = false;

// Kök adresler iki türlü sayfaya ait: il tevkil sayfaları (<il>-tevkil) ve blog yazıları (<slug>).
// İl sayfası önceliklidir; panel <il>-tevkil biçiminde blog adresine izin vermez.
export async function generateStaticParams() {
  const iller = Object.keys(ilIcerik).map((kod) => ({ sayfa: `${kod}${EK}` }));
  const bloglar = (await yazilar()).map((y) => ({ sayfa: y.slug }));
  return [...iller, ...bloglar];
}

// Sayfanın ili, metinleri ve veritabanı verisi. {adliye} yer tutucuları teyitli adliye sayısıyla doldurulur.
async function ilHazirla(sayfa) {
  if (!sayfa.endsWith(EK)) return null;
  const kod = sayfa.slice(0, -EK.length);
  if (!ilIcerik[kod]) return null;

  const veri = await ilVerisi(kod);
  if (!veri) return null;
  const icerik = JSON.parse(JSON.stringify(ilIcerik[kod]).replaceAll("{adliye}", String(veri.adliyeler.length)));
  return { kod, icerik, veri };
}

function yaziMetadata(y) {
  const baslik = y.meta_baslik || `${y.baslik} | TevkilGO`;
  const aciklama = y.meta_aciklama || y.ozet;
  return {
    title: { absolute: baslik },
    description: aciklama,
    alternates: { canonical: `/${y.slug}` },
    authors: [{ name: "TevkilGO", url: "https://www.tevkilgo.org" }],
    openGraph: {
      type: "article",
      siteName: "TevkilGO",
      locale: "tr_TR",
      url: `/${y.slug}`,
      title: baslik,
      description: aciklama,
      publishedTime: y.yayin_tarihi,
      modifiedTime: y.guncelleme_tarihi,
      section: KATEGORILER[y.kategori] || "Rehber",
    },
    twitter: { card: "summary_large_image", title: baslik, description: aciklama },
  };
}

export async function generateMetadata({ params }) {
  const { sayfa } = await params;
  const bulunan = await ilHazirla(sayfa);
  if (!bulunan) {
    const y = await yazi(sayfa);
    return y ? yaziMetadata(y) : {};
  }

  const { kod, icerik } = bulunan;
  const baslik = `${icerik.ad} Tevkil | TevkilGO`;
  return {
    title: { absolute: baslik },
    description: icerik.aciklama,
    alternates: { canonical: ilYolu(kod) },
    openGraph: {
      type: "website",
      siteName: "TevkilGO",
      locale: "tr_TR",
      url: ilYolu(kod),
      title: baslik,
      description: icerik.aciklama,
    },
    twitter: { card: "summary_large_image", title: baslik, description: icerik.aciklama },
  };
}

function sema({ kod, icerik, adliyeler }) {
  const url = `${SITE}${ilYolu(kod)}`;
  const bolge = {
    "@type": "AdministrativeArea",
    name: icerik.ad,
    containedInPlace: { "@type": "Country", name: "Türkiye" },
  };

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
        name: `${icerik.ad} Tevkil`,
        description: icerik.aciklama,
        inLanguage: "tr-TR",
        dateModified: icerik.guncelleme,
        isPartOf: { "@id": `${SITE}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        about: { "@id": `${url}#hizmet` },
        spatialCoverage: bolge,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "TevkilGO", item: SITE },
          { "@type": "ListItem", position: 2, name: "İllere Göre Tevkil", item: `${SITE}/illere-gore-tevkil` },
          { "@type": "ListItem", position: 3, name: `${icerik.ad} Tevkil`, item: url },
        ],
      },
      {
        "@type": "Service",
        "@id": `${url}#hizmet`,
        name: `${icerik.ad} Tevkil`,
        serviceType: "Avukatlar arası tevkil",
        description: icerik.aciklama,
        provider: { "@id": `${SITE}/#organization` },
        areaServed: bolge,
        audience: { "@type": "ProfessionalAudience", audienceType: "Avukatlar" },
        offers: { "@type": "Offer", price: "0", priceCurrency: "TRY", url: `${SITE}/uye-ol` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#adliyeler`,
        name: `${ek(icerik.ad, "deki")} adliyeler`,
        numberOfItems: adliyeler.length,
        itemListElement: adliyeler.map((adliye, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Courthouse",
            name: adliye.ad,
            address: { "@type": "PostalAddress", addressRegion: icerik.ad, addressCountry: "TR" },
          },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#sss`,
        mainEntity: icerik.sorular.map((soru) => ({
          "@type": "Question",
          name: soru.q,
          acceptedAnswer: { "@type": "Answer", text: soru.a },
        })),
      },
    ],
  };
}

export default async function KokSayfa({ params }) {
  const { sayfa } = await params;
  const bulunan = await ilHazirla(sayfa);
  if (bulunan) return <IlTevkilSayfasi bulunan={bulunan} />;

  const y = await yazi(sayfa);
  if (!y) notFound();
  return <YaziSayfasi yazi={y} govde={govdeHazirla(y.icerik)} ilgili={await ilgiliYazilar(y.slug, y.kategori)} />;
}

function IlTevkilSayfasi({ bulunan }) {

  const { kod, icerik, veri } = bulunan;

  const { ad } = icerik;
  const merkez = new Set(icerik.merkez);
  // Merkez adliyeler başa alınır, ilçe adliyeleri veritabanındaki sırayı korur
  const adliyeler = [
    ...veri.adliyeler.filter((a) => merkez.has(a.kod)),
    ...veri.adliyeler.filter((a) => !merkez.has(a.kod)),
  ];
  const barolar = veri.barolar.map((b) => b.ad);

  return (
    <main id="icerik" className="overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(sema({ kod, icerik, adliyeler })).replace(/</g, "\\u003c"),
        }}
      />

      <HomeHero
        ust={`${ad} tevkil`}
        baslik={icerik.baslik}
        metin={icerik.metin}
        alt={[...barolar, `${adliyeler.length} adliye`].join(" · ")}
        ekran={{ il: ad, ...icerik.ekran }}
      />

      <Bolum>
        <BolumBasligi title={`${ek(ad, "de")} tevkil`}>{icerik.giris}</BolumBasligi>
        <ul className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-12">
          {icerik.durumlar.map((durum) => {
            const Ikon = ikonlar[durum.ikon] || Buildings;
            return (
              <li key={durum.title} className={`${kart} p-6`}>
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-line">
                  <Ikon size={18} weight="bold" color="#1E3A5F" />
                </span>
                <h3 className="mt-5 text-[16px] font-semibold">{durum.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{durum.text}</p>
              </li>
            );
          })}
        </ul>
      </Bolum>

      <Bolum>
        <BolumBasligi title={`${ek(ad, "deki")} adliyeler`}>
          {icerik.adliyeMetni}
        </BolumBasligi>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {adliyeler.map((adliye) => (
            <li key={adliye.kod} className={`${kart} flex items-center justify-between gap-3 px-5 py-4`}>
              <span className="flex items-center gap-3">
                <Buildings size={17} weight="bold" color="#1E3A5F" className="shrink-0" />
                <span className="text-[15px] font-semibold">{adliye.ad}</span>
              </span>
              {merkez.has(adliye.kod) && (
                <span className="rounded-md bg-canvas px-2 py-0.5 text-[12px] font-semibold text-muted">Merkez</span>
              )}
            </li>
          ))}
        </ul>
      </Bolum>

      <Bolum>
        <BolumBasligi title="Üç adımda tevkil">
          {icerik.adimMetni}
        </BolumBasligi>
        <ol className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-12">
          {[
            ["Adliyeyi seç, ilanı aç", "İş türünü, tarihi, saati ve ücreti yaz."],
            ["Başvuruları karşılaştır", "Başvurular kısa bir süre toplanır, hepsi aynı anda listelenir."],
            ["Meslektaşına tevkil ver", "Seçtiğin avukatla iletişim bilgileriniz karşılıklı açılır."],
          ].map(([title, text], i) => (
            <li key={title} className={`${kart} p-6`}>
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-canvas text-[13px] font-bold text-muted">
                {i + 1}
              </span>
              <h3 className="mt-5 text-[16px] font-semibold">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </Bolum>

      <Bolum id="sss">
        <BolumBasligi title={`${ad} tevkil hakkında sorular`}>
          {icerik.sssMetni} Cevabını bulamadığın soru için{" "}
          <a href="mailto:destek@tevkilgo.org" className="font-semibold text-ink underline underline-offset-4">
            destek@tevkilgo.org
          </a>
        </BolumBasligi>
        <div className={`${kart} mt-10 px-6 lg:mt-12`}>
          {icerik.sorular.map((soru) => (
            <details key={soru.q} className="group border-b border-line last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                {soru.q}
                <Plus
                  size={16}
                  weight="bold"
                  className="shrink-0 text-muted group-open:rotate-45 motion-safe:transition-transform"
                />
              </summary>
              <p className="-mt-1 pb-5 text-[14px] leading-relaxed text-muted">{soru.a}</p>
            </details>
          ))}
        </div>
      </Bolum>

      <div className="p-2 md:px-4">
        <section className="flex flex-col gap-8 rounded-[32px] bg-ink px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-14">
          <div>
            <h2 className="text-[26px] font-extrabold leading-tight tracking-[-0.015em] text-white lg:text-[30px]">
              {ek(ad, "de")} tevkil ilanını şimdi aç
            </h2>
            <p className="mt-3 max-w-[28rem] text-[16px] leading-relaxed text-white/70">
              {ek(ad, "deki")} bir sonraki duruşma çakışmasında tevkil ilanını aç. {ek(ad, "de")} çalışıyorsan tevkil
              ilanları sana bildirim olarak gelsin.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <WebUyeOl />
          </div>
        </section>
      </div>

      <Bolum>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <h2 className="text-[22px] font-semibold tracking-[-0.01em]">Yakındaki illerde tevkil</h2>
          <TumIllerLinki />
        </div>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {yakinIller(kod).map((il) => (
            <li key={il.kod}>
              <IlKarti il={il} />
            </li>
          ))}
        </ul>
      </Bolum>

      <HomeFooter />
    </main>
  );
}
