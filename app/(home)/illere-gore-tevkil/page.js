import Link from "next/link";
import { Plus } from "@phosphor-icons/react/ssr";
import { Bolum, BolumBasligi, kart } from "@/components/Bolum";
import { HomeFooter } from "@/components/HomeFooter";
import { HomeHero, WebUyeOl } from "@/components/HomeHero";
import { PlayBadge } from "@/components/PlayBadge";
import { ilIcerik, ilYolu, yayindakiIller } from "@/lib/il-icerik";
import { ilAdliyeSayilari } from "@/lib/iller";

const SITE = "https://www.tevkilgo.org";
const YOL = "/illere-gore-tevkil";
const BASLIK = "İllere Göre Tevkil | TevkilGO";
const ACIKLAMA =
  "81 ilin hangisinde duruşman varsa o adliyede çalışan doğrulanmış bir avukata tevkil ver. İl il adliye sayıları ve şehir şehir tevkil rehberleri.";

export const metadata = {
  title: { absolute: BASLIK },
  description: ACIKLAMA,
  alternates: { canonical: YOL },
  openGraph: { type: "website", siteName: "TevkilGO", locale: "tr_TR", url: YOL, title: BASLIK, description: ACIKLAMA },
  twitter: { card: "summary_large_image", title: BASLIK, description: ACIKLAMA },
};

const sorular = [
  {
    q: "Hangi illerde tevkil verebilirim?",
    a: "81 ilin tamamında. TevkilGO'daki adliye listesi Türkiye'deki bütün adliyeleri kapsar; ilanı işin görüleceği adliyeyi seçerek açarsın.",
  },
  {
    q: "İl dışındaki bir duruşma için nasıl tevkil veririm?",
    a: "Bulunduğun il değil, duruşmanın görüleceği adliye seçilir. İlan, o adliyeyi çalışma bölgesi olarak seçmiş doğrulanmış avukatlara bildirim olarak düşer.",
  },
  {
    q: "Küçük bir ilçe adliyesinde de tevkil ilanı açabilir miyim?",
    a: "Evet. Listede ilçe adliyeleri de yer alır. Küçük adliyelerde başvuran sayısı az olabileceği için ilanı erken açmak ve yolu ücrete yansıtmak işini kolaylaştırır.",
  },
];

function sema(yayinda) {
  const url = `${SITE}${YOL}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: "İllere Göre Tevkil",
        description: ACIKLAMA,
        inLanguage: "tr-TR",
        isPartOf: { "@id": `${SITE}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: { "@id": `${url}#iller` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "TevkilGO", item: SITE },
          { "@type": "ListItem", position: 2, name: "İllere Göre Tevkil", item: url },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${url}#iller`,
        name: "İl tevkil sayfaları",
        numberOfItems: yayinda.length,
        itemListElement: yayinda.map((il, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${il.ad} Tevkil`,
          url: `${SITE}${il.yol}`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#sss`,
        mainEntity: sorular.map((soru) => ({
          "@type": "Question",
          name: soru.q,
          acceptedAnswer: { "@type": "Answer", text: soru.a },
        })),
      },
    ],
  };
}

export default async function IllereGoreTevkil() {
  const yayinda = yayindakiIller();
  const tumIller = await ilAdliyeSayilari();
  const toplamAdliye = tumIller.reduce((toplam, il) => toplam + il.adliye, 0);

  return (
    <main id="icerik" className="overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sema(yayinda)).replace(/</g, "\\u003c") }}
      />
      <HomeHero
        ust="İllere göre tevkil"
        baslik="Hangi ilde duruşman varsa orada bir meslektaşın var."
        metin={`${tumIller.length} ildeki ${toplamAdliye} adliyenin her birinde tevkil ilanı açabilirsin. İlan, o adliyede çalışan doğrulanmış avukatlara düşer.`}
        alt={`${tumIller.length} il · ${toplamAdliye} adliye · Baro kimliğiyle doğrulanmış üyelik`}
      />

      <Bolum id="tum-iller">
        <BolumBasligi title={`${tumIller.length} ilde adliye sayıları`}>
          Türkiye&apos;deki bütün adliyeler TevkilGO&apos;da listelidir. İl dışı duruşmalarda tevkil ilanını, duruşmanın
          görüleceği ilin adliyesini seçerek açarsın; ilan o adliyeyi çalışma bölgesi olarak seçmiş avukatlara gider.
        </BolumBasligi>
        <ul className={`${kart} mt-10 grid grid-cols-2 gap-x-6 px-6 py-4 sm:grid-cols-3 lg:mt-12 lg:grid-cols-4`}>
          {tumIller.map((il) => (
            <li key={il.kod} className="flex items-baseline justify-between gap-3 border-b border-line py-2.5 text-[14px]">
              {ilIcerik[il.kod] ? (
                <Link href={ilYolu(il.kod)} className="font-semibold text-navy underline-offset-4 hover:underline">
                  {il.ad} tevkil
                </Link>
              ) : (
                <span>{il.ad}</span>
              )}
              <span className="shrink-0 text-[13px] text-muted">{il.adliye} adliye</span>
            </li>
          ))}
        </ul>
      </Bolum>

      <Bolum id="sss">
        <BolumBasligi title="İllere göre tevkil hakkında sorular" />
        <div className={`${kart} mt-10 px-6 lg:mt-12`}>
          {sorular.map((soru) => (
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
              İl dışı duruşman için tevkil ilanı aç
            </h2>
            <p className="mt-3 max-w-[30rem] text-[16px] leading-relaxed text-white/70">
              Duruşmanın görüleceği adliyeyi seç, o adliyede çalışan doğrulanmış meslektaşın başvursun. Üyelik ücretsiz.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <PlayBadge height={56} />
            <WebUyeOl />
          </div>
        </section>
      </div>

      <HomeFooter />
    </main>
  );
}
