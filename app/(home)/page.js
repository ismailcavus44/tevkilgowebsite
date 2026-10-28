import Link from "next/link";
import {
  Bank,
  Bell,
  Buildings,
  Check,
  DotsThreeOutline,
  Gavel,
  IdentificationCard,
  LockKey,
  Moon,
  Plus,
  Scales,
  ShieldCheck,
  Star,
  UsersThree,
  X,
} from "@phosphor-icons/react/ssr";
import { Bolum, BolumBasligi, IkonHalka, kart } from "@/components/Bolum";
import { HomeFooter } from "@/components/HomeFooter";
import { HomeHero, WebUyeOl } from "@/components/HomeHero";
import { IlKarti, TumIllerLinki } from "@/components/IlKarti";
import { ilIcerik, ilYolu } from "@/lib/il-icerik";
import { genelSayilar } from "@/lib/iller";

const SITE = "https://www.tevkilgo.org";
const BASLIK = "Tevkil Uygulaması · Avukatlar Arası Tevkil | TevkilGO";
const aciklama = (sayi) =>
  `Duruşmana gidemiyorsan tevkil ilanı aç; ${sayi.adliye} adliyede baro kimliğiyle doğrulanmış avukatlar başvursun. Avukatlar arası ücretsiz tevkil uygulaması.`;

// Ana sayfada kartla öne çıkan iller; tamamı /illere-gore-tevkil sayfasında listelenir
const ONE_CIKAN_ILLER = ["istanbul", "ankara", "izmir", "bursa", "antalya", "konya"];

export async function generateMetadata() {
  const ACIKLAMA = aciklama(await genelSayilar());
  return {
    title: { absolute: BASLIK },
    description: ACIKLAMA,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: "TevkilGO",
      locale: "tr_TR",
      title: BASLIK,
      description: ACIKLAMA,
      url: "/",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "TevkilGO, avukatlar arası tevkil uygulaması" }],
    },
    twitter: { card: "summary_large_image", title: BASLIK, description: ACIKLAMA, images: ["/opengraph-image"] },
  };
}

const kavramlar = [
  {
    icon: Gavel,
    title: "Tevkil",
    text: "Avukatın vekâletnamedeki yetkiye dayanarak bir işi ya da duruşmayı başka bir avukata devretmesi. Tevkil edilen avukat o iş için meslektaşının yerine geçer.",
  },
  {
    icon: UsersThree,
    title: "Teşrik",
    text: "Avukatın işi bırakmadan başka bir avukatı işe ortak etmesi. Duruşmaya gidemeyen avukatın başvurduğu yol çoğunlukla teşrik değil tevkildir.",
  },
  {
    icon: IdentificationCard,
    title: "Yetki belgesi",
    text: "Vekâletnamede başkasını tevkil yetkisi varsa avukat, işi alacak meslektaşına bu yetkiye dayanarak yetki belgesi düzenler.",
  },
];

const adimlar = [
  {
    title: "Tevkil ilanını aç",
    text: "Adliyeyi, iş türünü, tarihi, saati ve ücreti seç. İlan o adliyede çalışan meslektaşlarına bildirim olarak düşer.",
  },
  {
    title: "Başvuran avukatları gör",
    text: "Başvurular kısa bir süre toplanır ve hepsi aynı anda listelenir. Barosunu, puanını ve tamamladığı tevkil sayısını görürsün.",
  },
  {
    title: "Meslektaşına tevkil ver",
    text: "Seçtiğin avukata tevkil verilir, iletişim bilgileriniz karşılıklı açılır. Yetki belgesini aranızda hazırlarsınız.",
  },
];

const isTurleri = [
  { icon: Gavel, title: "Duruşma", text: "İl dışındaki ya da aynı saate denk gelen duruşmalara katılım." },
  { icon: Scales, title: "Savcılık işlemleri", text: "İfadeye katılma, dosya inceleme ve evrak teslimi." },
  { icon: Bank, title: "İcra işlemleri", text: "Haciz, dosya inceleme ve icra dairesindeki işlemler." },
  { icon: Buildings, title: "Kurum işlemleri", text: "Tapu, SGK, vergi dairesi ve bakanlıklarda yapılacak işler." },
  { icon: LockKey, title: "Cezaevi ziyareti", text: "Ceza infaz kurumunda müvekkille görüşme." },
  { icon: DotsThreeOutline, title: "Diğer işlemler", text: "Listede olmayan adliye ve kurum işleri, iş türü notla açıklanır." },
];

const guvenceler = [
  {
    icon: ShieldCheck,
    title: "Baro kimliğiyle doğrulama",
    text: "Her üye baro kimlik kartıyla doğrulanır. Kart yalnızca doğrulama için kullanılır ve onaydan sonra silinir.",
  },
  {
    icon: UsersThree,
    title: "İlk yazan kapmaz",
    text: "Başvurular kısa süre toplanır, hepsi aynı anda listelenir. Tevkili kime vereceğine sen karar verirsin.",
  },
  {
    icon: LockKey,
    title: "Numaran gizli kalır",
    text: "Başvuruda telefon numaran görünmez. Tevkil verildiğinde iki taraf birbirine ulaşır.",
  },
  {
    icon: Star,
    title: "Puan ve şikâyet",
    text: "Her işten sonra taraflar birbirini puanlar. Seçim yaparken meslektaşının puanını görürsün.",
  },
  {
    icon: Bell,
    title: "Adliye modu",
    text: "Adliyedeyken tek dokunuşla müsait olursun, acil tevkil ilanı açan meslektaşın seni bulur.",
  },
  {
    icon: Moon,
    title: "Gece modu",
    text: "Karakol ifadesi, sulh ceza sorgusu gibi mesai dışı işler için 18:00 ile 08:00 arasında müsait olursun.",
  },
];

const gruplar = [
  "İlk yazan işi kapar, seçim şansın olmaz.",
  "Grupta kimin avukat olduğu belli değildir.",
  "Telefon numaran grubun tamamına açıktır.",
  "İş bitince kayıt kalmaz, puan ya da şikâyet yoktur.",
];

const tevkilgo = [
  "Başvurular toplanır, meslektaşını sen seçersin.",
  "Her üye baro kimliğiyle doğrulanmıştır.",
  "Numaran yalnızca tevkil verildiğinde açılır.",
  "Taraflar birbirini puanlar, sorun olursa şikâyet edilir.",
];

const ucretMaddeleri = [
  {
    title: "Ücreti sen belirlersin",
    text: "Tevkil ilanını açarken ücreti yazarsın. Başvuran avukatlar bu ücreti görerek başvurur.",
  },
  {
    title: "İş türüne göre asgari tutar",
    text: "Bazı iş türlerinde altına inilemeyen bir asgari tutar uygulanır. Tutar, ilan formunda ücret alanının altında yazar.",
  },
  {
    title: "Komisyon yok",
    text: "TevkilGO tevkil ücretinden pay almaz ve ödemeye aracılık etmez. Ücret avukatlar arasında doğrudan ödenir.",
  },
];

const sorulariHazirla = (sayi) => [
  {
    q: "Tevkil nedir?",
    a: "Tevkil, avukatın vekâletnamedeki yetkiye dayanarak bir işi ya da duruşmayı başka bir avukata devretmesidir. Uygulamada en çok, gidilemeyen bir duruşmaya meslektaşın katılması için kullanılır.",
  },
  {
    q: "Tevkil uygulaması ne işe yarar?",
    a: "Tevkil uygulaması, tevkil verecek avukatla işin görüleceği adliyede çalışan meslektaşını buluşturur. TevkilGO'da ilanı açarsın, o adliyedeki doğrulanmış avukatlar başvurur ve kime tevkil vereceğini sen seçersin.",
  },
  {
    q: "Başka şehirdeki duruşma için nasıl tevkil bulurum?",
    a: "Duruşmanın görüleceği adliyeyi seçip tevkil ilanı açarsın. İlan, o adliyeyi çalışma bölgesi olarak seçmiş doğrulanmış avukatlara bildirim olarak düşer; başvuranlar arasından birini seçersin.",
  },
  {
    q: "Muhabir avukat ne demek?",
    a: "Başka bir şehirdeki ya da adliyedeki işi, o işi takip eden avukat adına yürüten meslektaşa muhabir avukat denir. Tevkil edilen avukat çoğu zaman bu rolü üstlenir.",
  },
  {
    q: "Tevkil ile teşrik arasındaki fark nedir?",
    a: "Tevkilde avukat işi ya da duruşmayı başka bir avukata devreder. Teşrikte ise işi bırakmaz, başka bir avukatı işe ortak eder.",
  },
  {
    q: "Tevkil için yetki belgesi gerekir mi?",
    a: "Evet. Tevkil verebilmek için vekâletnamende başkasını tevkil yetkisi bulunmalı; işi alacak meslektaşına bu yetkiye dayanarak yetki belgesi düzenlersin. TevkilGO meslektaşı bulmanı sağlar, yetki belgesi taraflar arasında hazırlanır.",
  },
  {
    q: "Tevkil ücreti ne kadar?",
    a: "Ücreti ilanı açan avukat belirler, başvuranlar bu ücreti görerek başvurur. Bazı iş türlerinde uygulama altına inilemeyen bir asgari tutar uygular. Ödeme taraflar arasında doğrudan yapılır; TevkilGO ödemeye aracılık etmez.",
  },
  {
    q: "Hangi adliyelerde tevkil verebilirim?",
    a: `${sayi.il} ildeki ${sayi.adliye} adliyenin tamamı TevkilGO'da listelidir. İl dışındaki bir duruşma ya da uzak bir ilçe adliyesindeki iş için o adliyeyi seçip tevkil ilanı açabilirsin.`,
  },
  {
    q: "Kimler üye olabilir?",
    a: "Bir baroya kayıtlı avukatlar. Platform yalnızca avukatlara açıktır; kayıttan sonra baro kimlik kartının ön yüzünü yüklersin, kart onaydan sonra silinir.",
  },
  {
    q: "TevkilGO ücretli mi, komisyon alıyor mu?",
    a: "Şu an ücretsiz. Tevkil ilanı açmak da ilanlara başvurmak da ücretsizdir. TevkilGO tevkil ücretinden komisyon almaz.",
  },
];

const hesapSilmeSorusu = {
  q: "Hesabımı nasıl silerim?",
  a: "Uygulamada Profil > Hesabımı Sil adımıyla silebilirsin. Ayrıntılar hesap silme sayfasında.",
};

const semaHazirla = (sayi, sorular) => ({
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
      "@id": `${SITE}/#webpage`,
      url: SITE,
      name: BASLIK,
      description: aciklama(sayi),
      inLanguage: "tr-TR",
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#app` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE}/#app`,
      name: "TevkilGO",
      description: "Avukatlar arası tevkil uygulaması. Tevkil ilanı açılır, aynı adliyedeki doğrulanmış avukatlar başvurur.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: SITE,
      inLanguage: "tr-TR",
      audience: { "@type": "Audience", audienceType: "Avukatlar" },
      offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
      publisher: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE}/#sss`,
      mainEntity: [...sorular, hesapSilmeSorusu].map((soru) => ({
        "@type": "Question",
        name: soru.q,
        acceptedAnswer: { "@type": "Answer", text: soru.a },
      })),
    },
  ],
});

export default async function HomePage() {
  const sayi = await genelSayilar();
  const sorular = sorulariHazirla(sayi);
  const oneCikan = ONE_CIKAN_ILLER.filter((kod) => ilIcerik[kod]).map((kod) => ({
    kod,
    ad: ilIcerik[kod].ad,
    kart: ilIcerik[kod].kart,
    yol: ilYolu(kod),
  }));

  return (
    <main id="icerik" className="overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(semaHazirla(sayi, sorular)).replace(/</g, "\\u003c") }}
      />
      <HomeHero
        ust="Avukatlar arası tevkil uygulaması"
        baslik="Duruşmana gidemiyorsan tevkil ver, adliyedeki meslektaşın gitsin."
        metin="Tevkil ilanını aç; aynı adliyede çalışan, baro kimliğiyle doğrulanmış avukatlar başvursun."
        alt={`${sayi.baro} baro · ${sayi.adliye} adliye · Baro kimliğiyle doğrulanmış üyelik`}
      />

      <Bolum id="tevkil-nedir">
        <BolumBasligi title="Tevkil nedir?">
          Tevkil, avukatın müvekkilinden aldığı vekâlete dayanarak bir işi ya da duruşmayı başka bir avukata
          devretmesidir. Avukatlar tevkile en çok il dışı duruşmalarda, aynı saate denk gelen iki celsede, haciz ve
          icra takiplerinde ya da uzak ilçe adliyelerindeki işlerde başvurur. Bu işi üstlenen meslektaşa muhabir avukat
          da denir.
        </BolumBasligi>
        <ul className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-12">
          {kavramlar.map((kavram) => (
            <li key={kavram.title} className={`${kart} p-6`}>
              <IkonHalka icon={kavram.icon} />
              <h3 className="mt-5 text-[16px] font-semibold">{kavram.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{kavram.text}</p>
            </li>
          ))}
        </ul>
      </Bolum>

      <Bolum>
        <BolumBasligi title="Tevkil uygulaması nasıl çalışır?">
          Mesaj gruplarında tevkil aramak yerine ilanını açarsın. TevkilGO, tevkil ilanını işin görüleceği adliyede
          çalışan doğrulanmış avukatlara ulaştırır; başvuranları sen görürsün, kime tevkil vereceğine sen karar verirsin.
        </BolumBasligi>
        <ol className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-12">
          {adimlar.map((adim, i) => (
            <li key={adim.title} className={`${kart} p-6`}>
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-canvas text-[13px] font-bold text-muted">
                {i + 1}
              </span>
              <h3 className="mt-5 text-[16px] font-semibold">{adim.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{adim.text}</p>
            </li>
          ))}
        </ol>
      </Bolum>

      <Bolum>
        <BolumBasligi title="Hangi işler için tevkil verilir?">
          Duruşma tevkili en yaygın olanıdır, ama avukatlar savcılık, icra ve kurum işlerini de meslektaşlarına tevkil
          eder. İlanı açarken iş türünü seçersin; başvuran avukat işin ne olduğunu bilerek başvurur.
        </BolumBasligi>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {isTurleri.map((tur) => (
            <li key={tur.title} className={`${kart} flex items-start gap-4 p-5`}>
              <IkonHalka icon={tur.icon} />
              <span>
                <span className="block text-[15px] font-semibold">{tur.title}</span>
                <span className="mt-1 block text-[14px] leading-relaxed text-muted">{tur.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </Bolum>

      <Bolum id="iller">
        <BolumBasligi title="Büyük şehirlerde tevkil" sag={<TumIllerLinki />}>
          {sayi.il} ildeki {sayi.adliye} adliyenin hepsinde tevkil ilanı açabilirsin. Büyük şehirlerde adliyeler arası mesafe, uzak ilçe
          adliyeleri ve bölge adliye mahkemeleri tevkil ihtiyacını artırır; her şehrin kendine özgü durumunu il
          sayfalarında anlattık.
        </BolumBasligi>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {oneCikan.map((il) => (
            <li key={il.kod}>
              <IlKarti il={il} />
            </li>
          ))}
        </ul>
      </Bolum>

      <Bolum>
        <BolumBasligi title="Doğrulanmış avukatlarla güvenli tevkil">
          Tevkil verdiğin meslektaşın gerçekten avukat olduğunu, numaranın ne zaman açılacağını ve işi kimin
          üstleneceğini sen bilirsin. Avukat tevkil sürecindeki belirsizliği kaldıran kurallar uygulamanın içindedir.
        </BolumBasligi>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {guvenceler.map((madde) => (
            <li key={madde.title} className={`${kart} p-6`}>
              <IkonHalka icon={madde.icon} />
              <h3 className="mt-5 text-[16px] font-semibold">{madde.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{madde.text}</p>
            </li>
          ))}
        </ul>
      </Bolum>

      <Bolum>
        <BolumBasligi title="Tevkil grupları mı, tevkil uygulaması mı?">
          Mesaj gruplarında tevkil hızlıdır ama kontrolsüzdür. Tevkil uygulaması aynı hızı doğrulama, adil seçim ve
          kayıtla birleştirir.
        </BolumBasligi>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-12">
          <div className={`${kart} p-7`}>
            <h3 className="text-[17px] font-semibold text-muted">Tevkil grupları</h3>
            <ul className="mt-5 space-y-3.5">
              {gruplar.map((madde) => (
                <li key={madde} className="flex items-start gap-3 text-[15px] leading-relaxed text-muted">
                  <X size={16} weight="bold" className="mt-1 shrink-0" />
                  {madde}
                </li>
              ))}
            </ul>
          </div>
          <div className={`${kart} border-navy/30 p-7`}>
            <h3 className="text-[17px] font-semibold">TevkilGO</h3>
            <ul className="mt-5 space-y-3.5">
              {tevkilgo.map((madde) => (
                <li key={madde} className="flex items-start gap-3 text-[15px] leading-relaxed">
                  <Check size={16} weight="bold" color="#2F6B4F" className="mt-1 shrink-0" />
                  {madde}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Bolum>

      <Bolum id="tevkil-ucreti">
        <BolumBasligi title="Tevkil ücreti nasıl belirlenir?">
          TevkilGO&apos;da tevkil ücreti ilan açılırken bellidir. Başvuran meslektaşın ne kadar alacağını bilerek
          başvurur; pazarlık, komisyon ya da aracı yoktur.
        </BolumBasligi>
        <ul className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-12">
          {ucretMaddeleri.map((madde) => (
            <li key={madde.title} className={`${kart} p-6`}>
              <h3 className="text-[16px] font-semibold">{madde.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{madde.text}</p>
            </li>
          ))}
        </ul>
      </Bolum>

      <Bolum id="sss">
        <BolumBasligi title="Tevkil hakkında sık sorulanlar">
          Tevkil, tevkil uygulaması, yetki belgesi ve tevkil ücreti hakkında en çok sorulanlar. Cevabını bulamadığın
          soru için destek@tevkilgo.org adresine yazabilirsin.
        </BolumBasligi>
        <div className={`${kart} mt-10 px-6 lg:mt-12`}>
          {sorular.map((soru) => (
            <Soru key={soru.q} q={soru.q}>
              {soru.a}
            </Soru>
          ))}
          <Soru q={hesapSilmeSorusu.q}>
            Uygulamada Profil &gt; Hesabımı Sil adımıyla silebilirsin. Ayrıntılar{" "}
            <Link href="/hesap-silme" className="font-semibold text-ink underline underline-offset-4">
              hesap silme
            </Link>{" "}
            sayfasında.
          </Soru>
        </div>
      </Bolum>

      <div className="p-2 md:px-4">
        <section className="flex flex-col gap-8 rounded-[32px] bg-ink px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-14">
          <div>
            <h2 className="text-[26px] font-extrabold leading-tight tracking-[-0.015em] text-white lg:text-[30px]">
              Tevkil ilanını şimdi aç
            </h2>
            <p className="mt-3 max-w-[30rem] text-[16px] leading-relaxed text-white/70">
              Bir sonraki duruşma çakışmasında ücretsiz üye ol, ilanını aç; adliyedeki doğrulanmış meslektaşın gitsin.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <WebUyeOl />
          </div>
        </section>
      </div>

      <HomeFooter />
    </main>
  );
}

function Soru({ q, children }) {
  return (
    <details className="group border-b border-line last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
        {q}
        <Plus size={16} weight="bold" className="shrink-0 text-muted group-open:rotate-45 motion-safe:transition-transform" />
      </summary>
      <p className="-mt-1 pb-5 text-[14px] leading-relaxed text-muted">{children}</p>
    </details>
  );
}
