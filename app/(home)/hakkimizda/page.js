import { Buildings, Coins, IdentificationCard, LockKey, Star, UsersThree, X, Check } from "@phosphor-icons/react/ssr";
import { Bolum, BolumBasligi, IkonHalka, kart } from "@/components/Bolum";
import { HomeFooter } from "@/components/HomeFooter";
import { WebUyeOl } from "@/components/HomeHero";
import { PlayBadge } from "@/components/PlayBadge";
import { SayfaHero } from "@/components/SayfaHero";
import { genelSayilar } from "@/lib/iller";

export const metadata = {
  title: "Hakkımızda",
  description:
    "TevkilGO, avukatların duruşma ve adliye işleri için tevkil ilanı açtığı, aynı adliyedeki doğrulanmış meslektaşlarının başvurduğu tevkil uygulamasıdır.",
  alternates: { canonical: "/hakkimizda" },
};

const ilkeler = [
  {
    icon: IdentificationCard,
    title: "Yalnızca avukatlar",
    text: "Her üye baro kimlik kartıyla doğrulanır. Kart yalnızca doğrulama için kullanılır ve onaydan sonra silinir.",
  },
  {
    icon: UsersThree,
    title: "Seçim senin",
    text: "Başvurular kısa bir süre toplanır ve hepsi aynı anda listelenir. İlk yazan işi kapmaz; tevkili kime vereceğine sen karar verirsin.",
  },
  {
    icon: LockKey,
    title: "Numaran gizli",
    text: "Telefon numaraları yalnızca tevkil verildiğinde karşılıklı açılır. Başvuru aşamasında kimse numaranı görmez.",
  },
  {
    icon: Star,
    title: "Kayıt ve puan",
    text: "Her işten sonra taraflar birbirini puanlar. Sorun olursa şikâyet edilir; bir sonraki seçimde puan görünür.",
  },
  {
    icon: Buildings,
    title: "Doğru adliye",
    text: "İlan, seçilen adliyeyi çalışma bölgesi olarak işaretlemiş avukatlara bildirim olarak düşer.",
  },
  {
    icon: Coins,
    title: "Komisyon yok",
    text: "TevkilGO şu an ücretsiz. Tevkil ücretini ilanı açan avukat belirler, ödeme avukatlar arasında doğrudan yapılır.",
  },
];

const gruplar = [
  "İlk yazan işi kapar.",
  "Kimin avukat olduğu belli değildir.",
  "Telefon numaran herkese açıktır.",
  "İş bitince kayıt kalmaz.",
];

const tevkilgo = [
  "Başvurular toplanır, seçimi sen yaparsın.",
  "Her üye baro kimliğiyle doğrulanır.",
  "Numaran yalnızca eşleşmede açılır.",
  "Taraflar birbirini puanlar.",
];

export default async function HakkimizdaPage() {
  const sayi = await genelSayilar();
  const rakamlar = [
    { deger: sayi.il, etiket: "il" },
    { deger: sayi.adliye, etiket: "adliye" },
    { deger: sayi.baro, etiket: "baro" },
  ];

  return (
    <main id="icerik" className="overflow-x-clip">
      <SayfaHero
        ust="Hakkımızda"
        baslik="Tevkili mesaj gruplarından güvenli bir uygulamaya taşıyoruz."
        metin="TevkilGO, duruşmasına ya da adliye işine gidemeyen avukatla o adliyede çalışan doğrulanmış meslektaşını buluşturan bir tevkil uygulamasıdır."
      />

      <Bolum>
        <BolumBasligi title="Neden TevkilGO?">
          Tevkil uzun süre mesaj gruplarında yürüdü. Hızlıydı ama kontrolsüzdü. TevkilGO aynı hızı doğrulama, adil seçim
          ve kayıtla bir araya getirmek için geliştirildi.
        </BolumBasligi>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-12">
          <div className={`${kart} p-7`}>
            <h3 className="text-[17px] font-semibold text-muted">Mesaj gruplarında</h3>
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
            <h3 className="text-[17px] font-semibold">TevkilGO&apos;da</h3>
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

      <Bolum>
        <BolumBasligi title="Rakamlarla TevkilGO">
          Türkiye&apos;deki bütün adliyeler listededir. İl dışındaki bir duruşma için de ilçedeki bir haciz için de
          ilanı işin görüleceği adliyede açarsın.
        </BolumBasligi>
        <dl className="mt-10 grid gap-4 sm:grid-cols-3 lg:mt-12">
          {rakamlar.map((satir) => (
            <div key={satir.etiket} className={`${kart} flex flex-col-reverse p-7`}>
              <dt className="mt-2 text-[15px] text-muted">{satir.etiket}</dt>
              <dd className="text-[44px] font-extrabold leading-none tracking-[-0.03em]">{satir.deger}</dd>
            </div>
          ))}
        </dl>
      </Bolum>

      <Bolum>
        <BolumBasligi title="İlkelerimiz">
          Uygulamadaki her kural, tevkil veren avukatın da tevkil alan avukatın da kime güvendiğini bilmesi için var.
        </BolumBasligi>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {ilkeler.map((ilke) => (
            <li key={ilke.title} className={`${kart} p-6`}>
              <IkonHalka icon={ilke.icon} />
              <h3 className="mt-5 text-[16px] font-semibold">{ilke.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{ilke.text}</p>
            </li>
          ))}
        </ul>
      </Bolum>

      <div className="p-2 md:px-4">
        <section className="flex flex-col gap-8 rounded-[32px] bg-ink px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-14">
          <div>
            <h2 className="text-[26px] font-extrabold leading-tight tracking-[-0.015em] text-white lg:text-[30px]">
              Tevkil ilanını şimdi aç
            </h2>
            <p className="mt-3 max-w-[30rem] text-[16px] leading-relaxed text-white/70">
              Ücretsiz üye ol, baro kimliğinle doğrulan, bir sonraki duruşma çakışmasında meslektaşın gitsin.
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
