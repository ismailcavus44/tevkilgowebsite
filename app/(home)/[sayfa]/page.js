import { notFound } from "next/navigation";
import { Bank, Buildings, Check, Factory, LockKey, Mountains, Path, Plus, Scales, X } from "@phosphor-icons/react/ssr";
import { BagliMetin, duzMetin } from "@/components/BagliMetin";
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

// Sayfanın ili, metinleri ve veritabanı verisi. {adliye} ve {baro} yer tutucuları teyitli adliye ve baro
// sayısıyla doldurulur.
async function ilHazirla(sayfa) {
  if (!sayfa.endsWith(EK)) return null;
  const kod = sayfa.slice(0, -EK.length);
  if (!ilIcerik[kod]) return null;

  const veri = await ilVerisi(kod);
  if (!veri) return null;
  const icerik = JSON.parse(
    JSON.stringify(ilIcerik[kod])
      .replaceAll("{adliye}", String(veri.adliyeler.length))
      .replaceAll("{baro}", String(veri.barolar.length)),
  );
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
  const baslik = icerik.metaBaslik || `${icerik.ad} Tevkil | TevkilGO`;
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
          acceptedAnswer: { "@type": "Answer", text: duzMetin(soru.a) },
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

const tarihBicimi = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

// Başlık altında üçlü ya da dörtlü kart dizisi; durumlar, kimler, ücret ve yetki belgesi bölümlerinde ortak
function Kartlar({ ogeler, sutun = "md:grid-cols-3" }) {
  return (
    <ul className={`mt-10 grid gap-4 lg:mt-12 ${sutun}`}>
      {ogeler.map((oge) => {
        const Ikon = oge.ikon && (ikonlar[oge.ikon] || Buildings);
        return (
          <li key={oge.title} className={`${kart} p-6`}>
            {Ikon && (
              <span className="mb-5 inline-flex size-10 items-center justify-center rounded-full border border-line">
                <Ikon size={18} weight="bold" color="#1E3A5F" />
              </span>
            )}
            <h3 className="text-[16px] font-semibold">{oge.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              <BagliMetin>{oge.text}</BagliMetin>
            </p>
          </li>
        );
      })}
    </ul>
  );
}

function Hucre({ hucre }) {
  const [metin, tur] = hucre;
  return (
    <span className="inline-flex items-start gap-2">
      {tur === "iyi" && <Check size={15} weight="bold" className="mt-0.5 shrink-0 text-emerald-700" />}
      {tur === "kotu" && <X size={15} weight="bold" className="mt-0.5 shrink-0 text-rose-700" />}
      {metin}
    </span>
  );
}

function Karsilastirma({ tablo }) {
  return (
    <div className={`${kart} mt-8 overflow-x-auto`}>
      <table className="w-full min-w-[560px] text-left text-[14px]">
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="px-5 py-4 font-semibold text-muted">
              <span className="sr-only">Ölçüt</span>
            </th>
            {tablo.sutunlar.map((sutun, i) => (
              <th
                key={sutun}
                scope="col"
                className={`px-5 py-4 font-semibold ${i === tablo.sutunlar.length - 1 ? "text-ink" : "text-muted"}`}
              >
                {sutun}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tablo.satirlar.map((satir) => (
            <tr key={satir.etiket} className="border-b border-line last:border-b-0">
              <th scope="row" className="px-5 py-4 font-semibold">
                {satir.etiket}
              </th>
              {satir.hucreler.map((hucre, i) => (
                <td key={i} className="px-5 py-4 leading-relaxed text-muted">
                  <Hucre hucre={hucre} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CagriBandi({ baslik, metin }) {
  return (
    <div className="p-2 md:px-4">
      <section className="flex flex-col gap-8 rounded-[32px] bg-ink px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-14">
        <div>
          <h2 className="text-[26px] font-extrabold leading-tight tracking-[-0.015em] text-white lg:text-[30px]">
            {baslik}
          </h2>
          <p className="mt-3 max-w-[28rem] text-[16px] leading-relaxed text-white/70">{metin}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <WebUyeOl />
        </div>
      </section>
    </div>
  );
}

// İl sayfası iki düzende üretilir. Zengin düzende başlık dağılımı Konseptofis ana sayfasını izler: H1 tam hedef
// kelime, il adı yalnızca tam ifade gereken H2'lerde (nedir, ücret, adliyeler, SSS), diğer H2'ler "Tevkil" ile başlar.
// İçeriği zenginleştirilmiş il (ozet alanı olan) cevap, tanım, ücret,
// yetki belgesi ve adliye rehberi bölümleriyle; diğerleri kısa düzenle. İller sırayla yeni düzene geçer.
function IlTevkilSayfasi({ bulunan }) {
  const { kod, icerik, veri } = bulunan;

  const { ad } = icerik;
  const zengin = Boolean(icerik.ozet);
  const merkez = new Set(icerik.merkez);
  // Merkez adliyeler başa alınır, ilçe adliyeleri veritabanındaki sırayı korur
  const adliyeler = [
    ...veri.adliyeler.filter((a) => merkez.has(a.kod)),
    ...veri.adliyeler.filter((a) => !merkez.has(a.kod)),
  ];
  const barolar = veri.barolar.map((b) => b.ad);

  const durumlar = (
    <Bolum>
      <BolumBasligi title={zengin ? "Tevkil gerektiren işler" : `${ek(ad, "de")} tevkil`}>
        <BagliMetin>{icerik.giris}</BagliMetin>
      </BolumBasligi>
      <Kartlar ogeler={icerik.durumlar} />
    </Bolum>
  );

  const adimlar = (
    <Bolum>
      <BolumBasligi title={zengin ? "Tevkil ilanı nasıl açılır?" : "Üç adımda tevkil"}>
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
  );

  const adliyeBolumu = (
    <Bolum id="adliyeler">
      <BolumBasligi title={zengin ? `${ek(ad, "de")} tevkil verilen adliyeler` : `${ek(ad, "deki")} adliyeler`}>
        <BagliMetin>{icerik.adliyeMetni}</BagliMetin>
      </BolumBasligi>
      {icerik.rehber && <Kartlar ogeler={icerik.rehber} sutun="md:grid-cols-2" />}
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
  );

  const sss = (
    <Bolum id="sss">
      <BolumBasligi title={zengin ? `${ad} tevkil hakkında sık sorulan sorular` : `${ad} tevkil hakkında sorular`}>
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
            <p className="-mt-1 pb-5 text-[14px] leading-relaxed text-muted">
              <BagliMetin>{soru.a}</BagliMetin>
            </p>
          </details>
        ))}
      </div>
      <p className="mt-6 text-[13px] text-muted">
        Son güncelleme: <time dateTime={icerik.guncelleme}>{tarihBicimi.format(new Date(icerik.guncelleme))}</time>
      </p>
    </Bolum>
  );

  const sonCagri = (
    <CagriBandi
      baslik={`${ek(ad, "de")} tevkil ilanını şimdi aç`}
      metin={`${ek(ad, "deki")} bir sonraki duruşma çakışmasında tevkil ilanını aç. ${ek(ad, "de")} çalışıyorsan tevkil ilanları sana bildirim olarak gelsin.`}
    />
  );

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
        anahtar={zengin ? `${ad} Tevkil` : undefined}
        baslik={icerik.baslik}
        metin={icerik.metin}
        alt={[...barolar, `${adliyeler.length} adliye`].join(" · ")}
        ekran={{ il: ad, ...icerik.ekran }}
      />

      {zengin ? (
        <>
          <Bolum>
            <BolumBasligi title="Tevkil nasıl verilir?">
              <BagliMetin>{icerik.ozet}</BagliMetin>
            </BolumBasligi>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
              {icerik.ozetKartlari.map((oge) => (
                <li key={oge.etiket} className={`${kart} p-6`}>
                  <p className="text-[30px] font-extrabold leading-none tracking-[-0.02em]">{oge.deger}</p>
                  <h3 className="mt-2 text-[15px] font-semibold">{oge.etiket}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{oge.text}</p>
                </li>
              ))}
            </ul>
          </Bolum>

          <Bolum>
            <BolumBasligi title={`${ad} tevkil nedir?`}>
              <BagliMetin>{icerik.nedir.metin}</BagliMetin>
            </BolumBasligi>
            <Kartlar ogeler={icerik.nedir.kartlar} />
            <h3 className="mt-14 text-[22px] font-semibold tracking-[-0.01em]">{icerik.karsilastirma.baslik}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{icerik.karsilastirma.metin}</p>
            <Karsilastirma tablo={icerik.karsilastirma} />
          </Bolum>

          <Bolum id="ucret">
            <BolumBasligi title={`${ad} tevkil ücreti`}>
              <BagliMetin>{icerik.ucret.metin}</BagliMetin>
            </BolumBasligi>
            <Kartlar ogeler={icerik.ucret.maddeler} sutun="md:grid-cols-2" />
          </Bolum>

          {adimlar}

          <Bolum id="yetki-belgesi">
            <BolumBasligi title={icerik.yasal.baslik}>
              <BagliMetin>{icerik.yasal.metin}</BagliMetin>
            </BolumBasligi>
            <Kartlar ogeler={icerik.yasal.maddeler} sutun="md:grid-cols-2" />
          </Bolum>

          <CagriBandi baslik={icerik.cagri.baslik} metin={icerik.cagri.metin} />

          <Bolum>
            <BolumBasligi title="Tevkil kimler için uygun?">
              {icerik.kimlerMetni}
            </BolumBasligi>
            <Kartlar ogeler={icerik.kimler} sutun="md:grid-cols-2" />
          </Bolum>

          {durumlar}
          {adliyeBolumu}
          {sss}
          {sonCagri}
        </>
      ) : (
        <>
          {durumlar}
          {adliyeBolumu}
          {adimlar}
          {sss}
          {sonCagri}
        </>
      )}

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
