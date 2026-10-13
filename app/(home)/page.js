import Image from "next/image";
import Link from "next/link";
import { Lock, LockOpen, Plus, ShieldCheck, Star, UsersThree } from "@phosphor-icons/react/ssr";
import { HomeHeader } from "@/components/HomeHeader";
import { PhoneFrame } from "@/components/PhoneFrame";
import { PlayBadge } from "@/components/PlayBadge";
import { GorevOlusturEkrani } from "@/components/screens/GorevOlusturEkrani";
import { IlanDetayEkrani } from "@/components/screens/IlanDetayEkrani";
import { IlanlarEkrani } from "@/components/screens/IlanlarEkrani";

const adimlar = [
  {
    n: "1",
    title: "İlanı aç",
    text: "Adliyeyi, tarihi, saati ve ücreti seç. İlan o adliyedeki meslektaşlarına düşer.",
    screen: <GorevOlusturEkrani />,
  },
  {
    n: "2",
    title: "Başvuruları gör",
    text: "Başvuranların barosunu, puanını ve tamamladığı iş sayısını görürsün.",
    screen: <IlanDetayEkrani gorunum="basvuranlar" />,
  },
  {
    n: "3",
    title: "Meslektaşını seç",
    text: "Seçtiğin kişiye tevkil verilir, iletişim bilgileriniz karşılıklı açılır.",
    screen: <IlanDetayEkrani gorunum="secildi" />,
  },
];

const puanlar = [
  { ad: "Av. M··· K.", cinsiyet: "erkek", puan: "4,8", kaydir: "mr-10" },
  { ad: "Av. S··· D.", cinsiyet: "kadin", puan: "4,9", kaydir: "" },
  { ad: "Av. E··· T.", cinsiyet: "erkek", puan: "4,6", kaydir: "mr-6" },
];

const sorular = [
  {
    q: "Kimler üye olabilir?",
    a: "Bir baroya kayıtlı avukatlar. Platform yalnızca avukatlara açıktır.",
  },
  {
    q: "Ücretli mi?",
    a: "Şu an ücretsiz.",
  },
  {
    q: "Kimlik doğrulama nasıl yapılıyor?",
    a: "Kayıttan sonra baro kimlik kartının ön yüzünü yüklersin. Kart yalnızca doğrulama için kullanılır ve onaydan sonra silinir.",
  },
  {
    q: "Tevkil ücretini uygulama mı alıyor?",
    a: "Hayır. Ücret avukatlar arasında belirlenir; uygulama ödemeye aracılık etmez.",
  },
];

const yasal = [
  { href: "/gizlilik", label: "Gizlilik Politikası" },
  { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
  { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
  { href: "/hesap-silme", label: "Hesap Silme" },
];

const kart = "rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgb(18_38_63/0.05)]";

function Avatar({ cinsiyet, size }) {
  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-line"
      style={{ width: size, height: size }}
    >
      <Image
        src={`/avatar/${cinsiyet}.jpg`}
        alt=""
        width={size * 2}
        height={size * 2}
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        style={{ width: size * 1.45, height: size * 1.45 }}
      />
    </span>
  );
}

function WebUyeOl() {
  return (
    <Link
      href="/uye-ol"
      className="inline-flex h-14 items-center rounded-[12px] border border-white/25 px-6 text-base font-bold text-white hover:bg-white/10"
    >
      Web&apos;de üye ol
    </Link>
  );
}

function BolumBasligi({ title, children }) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <h2 className="text-balance text-[30px] font-semibold leading-tight tracking-[-0.02em] lg:text-[36px]">{title}</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">{children}</p>
    </div>
  );
}

function IkonHalka({ icon: Icon }) {
  return (
    <span className="inline-flex size-10 items-center justify-center rounded-full border border-line">
      <Icon size={18} weight="bold" color="#1E3A5F" />
    </span>
  );
}

function Anahtar({ acik }) {
  return (
    <span className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 ${acik ? "justify-end bg-navy" : "bg-line"}`}>
      <span className="size-4 rounded-full bg-white shadow-sm" />
    </span>
  );
}

function EkranOnizleme({ children }) {
  return (
    <div aria-hidden="true" className="pointer-events-none relative h-[230px] overflow-hidden rounded-lg bg-canvas">
      <div
        className="absolute left-1/2 top-6 -translate-x-1/2 overflow-hidden rounded-t-[18px] border border-line shadow-[0_8px_24px_rgb(18_38_63/0.08)]"
        style={{ width: 390 * 0.56, height: 844 * 0.56 }}
      >
        <div style={{ width: 390, transform: "scale(0.56)", transformOrigin: "top left" }}>{children}</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main id="icerik" className="overflow-x-clip">
      <div className="p-2 md:p-4">
        <section className="relative flex min-h-[88vh] flex-col overflow-hidden rounded-[32px] bg-ink">
          <HomeHeader />
          <div className="grid flex-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="flex flex-col justify-center px-6 pb-10 pt-10 lg:px-14 lg:pb-16 lg:pt-6">
              <h1 className="max-w-[15ch] text-[38px] font-extrabold leading-[1.04] tracking-[-0.025em] text-white lg:text-[64px]">
                Duruşmana gidemiyorsan, adliyedeki meslektaşın gitsin.
              </h1>
              <p className="mt-6 max-w-[30rem] text-[18px] leading-relaxed text-white/[0.72] lg:text-[20px]">
                Tevkil ilanını aç; aynı adliyede çalışan, baro kimliğiyle doğrulanmış avukatlar başvursun.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <PlayBadge height={56} />
                <WebUyeOl />
              </div>
              <p className="mt-14 text-[14px] text-white/60">
                81 baro · 597 adliye · Baro kimliğiyle doğrulanmış üyelik
              </p>
            </div>

            <div className="relative mb-10 hidden h-[680px] self-center sm:block lg:my-10">
              <div className="absolute bottom-0 left-1/2 h-full w-[480px] -translate-x-1/2">
                <PhoneFrame scale={0.62} className="absolute left-0 top-[84px] rounded-[27px]">
                  <IlanDetayEkrani />
                </PhoneFrame>
                <PhoneFrame
                  scale={0.74}
                  className="absolute right-0 top-[28px] rounded-[33px] shadow-[0_30px_60px_rgb(0_0_0/0.35)]"
                >
                  <IlanlarEkrani />
                </PhoneFrame>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <BolumBasligi title="Üç adımda tevkil">
            İlanı sen açarsın, başvuranları sen görürsün, kararı sen verirsin.
          </BolumBasligi>
          <ol className="mt-12 grid gap-4 md:grid-cols-3 lg:mt-16">
            {adimlar.map((adim) => (
              <li key={adim.n} className={`${kart} p-2`}>
                <EkranOnizleme>{adim.screen}</EkranOnizleme>
                <div className="px-4 pb-5 pt-5">
                  <h3 className="flex items-center gap-2.5 text-[16px] font-semibold">
                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-canvas text-[12px] font-bold text-muted">
                      {adim.n}
                    </span>
                    {adim.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{adim.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <BolumBasligi title="Yalnızca doğrulanmış avukatlar arasında">
            Kimin başvurduğunu ve numaranın ne zaman açılacağını sen bilirsin.
          </BolumBasligi>

          <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-6">
            <div className={`${kart} flex flex-col items-center justify-center p-8 text-center lg:col-span-2`}>
              <div className="relative flex h-24 w-56 items-center justify-center">
                <span className="absolute inset-0 -rotate-6 rounded-[50%] border-2 border-line" />
                <span className="text-[52px] font-semibold tracking-[-0.03em]">597</span>
              </div>
              <h3 className="mt-6 text-[20px] font-semibold">Adliye</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">81 ildeki bütün adliyeler listede.</p>
            </div>

            <div className={`${kart} flex flex-col items-center p-8 text-center lg:col-span-2`}>
              <div className="flex size-28 items-center justify-center rounded-full border border-line">
                <div className="flex size-20 items-center justify-center rounded-full border border-line bg-canvas">
                  <ShieldCheck size={34} weight="duotone" color="#1E3A5F" />
                </div>
              </div>
              <h3 className="mt-6 text-[16px] font-semibold">Baro kimliğiyle doğrulama</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Kartının ön yüzünü yüklersin, ekip inceler. Onaydan sonra kart silinir.
              </p>
            </div>

            <div className={`${kart} flex flex-col p-8 text-center lg:col-span-2`}>
              <div className="mx-auto w-full max-w-[240px] space-y-2 text-left">
                <div className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold">Adliye modu</span>
                    <span className="block text-[12px] text-muted">Ankara Batı Adliyesi</span>
                  </span>
                  <Anahtar acik />
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold">Gece modu</span>
                    <span className="block text-[12px] text-muted">18:00–08:00</span>
                  </span>
                  <Anahtar />
                </div>
              </div>
              <h3 className="mt-6 text-[16px] font-semibold">Adliye ve gece modu</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Tek dokunuşla müsait olursun, acil işi olan meslektaşın seni bulur.
              </p>
            </div>

            <div className={`${kart} grid gap-8 p-8 sm:grid-cols-2 lg:col-span-3`}>
              <div className="flex flex-col justify-between gap-8">
                <IkonHalka icon={Star} />
                <div>
                  <h3 className="text-[16px] font-semibold">Puan ve şikayet</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">
                    Her görevden sonra taraflar birbirini puanlar. Seçim yaparken puanı görürsün.
                  </p>
                </div>
              </div>
              <ul className="flex flex-col items-end justify-center gap-3">
                {puanlar.map((kisi) => (
                  <li key={kisi.ad} className={`flex items-center gap-2 ${kisi.kaydir}`}>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2 py-1 text-[12px] font-medium shadow-[0_1px_2px_rgb(18_38_63/0.05)]">
                      {kisi.ad}
                      <span className="inline-flex items-center gap-0.5 text-muted">
                        <Star size={11} weight="fill" color="#B7791F" />
                        {kisi.puan}
                      </span>
                    </span>
                    <Avatar cinsiyet={kisi.cinsiyet} size={30} />
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${kart} grid gap-8 p-8 sm:grid-cols-2 lg:col-span-3`}>
              <div className="flex flex-col justify-between gap-8">
                <IkonHalka icon={UsersThree} />
                <div>
                  <h3 className="text-[16px] font-semibold">Numaran eşleşmeden görünmez</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">
                    Başvuruda numaran gizli kalır. Tevkil verildiğinde iki taraf birbirine ulaşır.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-3">
                <div>
                  <p className="mb-1.5 text-[12px] text-muted">Başvuruda</p>
                  <div className="flex items-center gap-2.5 rounded-lg border border-line px-3 py-2.5">
                    <Avatar cinsiyet="kadin" size={28} />
                    <span className="flex-1 whitespace-nowrap text-[13px] font-semibold text-muted">05•• ••• •• ••</span>
                    <Lock size={15} weight="bold" className="text-muted" />
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-[12px] text-muted">Tevkil verildikten sonra</p>
                  <div className="flex items-center gap-2.5 rounded-lg border border-line px-3 py-2.5">
                    <Avatar cinsiyet="kadin" size={28} />
                    <span className="flex-1 text-[13px] font-semibold">0500 123 45 67</span>
                    <LockOpen size={15} weight="bold" color="#2F7D5B" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sss" className="scroll-mt-24 px-5 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <BolumBasligi title="Sık sorulanlar">
            Cevabını bulamadığın soru için{" "}
            <a href="mailto:destek@tevkilgo.org" className="font-semibold text-ink underline underline-offset-4">
              destek@tevkilgo.org
            </a>
          </BolumBasligi>
          <div className={`${kart} mt-12 px-6`}>
            {sorular.map((soru) => (
              <Soru key={soru.q} q={soru.q}>
                {soru.a}
              </Soru>
            ))}
            <Soru q="Hesabımı nasıl silerim?">
              Uygulamada Profil &gt; Hesabımı Sil adımıyla silebilirsin. Ayrıntılar{" "}
              <Link href="/hesap-silme" className="font-semibold text-ink underline underline-offset-4">
                hesap silme
              </Link>{" "}
              sayfasında.
            </Soru>
          </div>
        </div>
      </section>

      <div className="p-2 md:px-4">
        <section className="flex flex-col gap-8 rounded-[32px] bg-ink px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-14">
          <div>
            <h2 className="text-[26px] font-extrabold leading-tight tracking-[-0.015em] text-white lg:text-[30px]">
              Adliyede yalnız değilsin.
            </h2>
            <p className="mt-3 max-w-[28rem] text-[16px] leading-relaxed text-white/70">
              Bir sonraki duruşma çakışmasında ilanını aç, meslektaşın gitsin.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <PlayBadge height={56} />
            <WebUyeOl />
          </div>
        </section>
      </div>

      <footer className="mx-auto mt-12 w-full max-w-5xl px-5 pb-12">
        <div className="grid gap-10 border-b border-line pb-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/icon.png" alt="" width={30} height={30} className="rounded-lg" />
              <span className="text-[17px] font-extrabold tracking-tight">TevkilGO</span>
            </Link>
            <p className="mt-4 max-w-[300px] text-[14px] leading-relaxed text-muted">
              Avukatlar arasında duruşma tevkili için doğrulanmış bir buluşma yeri.
            </p>
          </div>
          <nav aria-label="Yasal" className="flex flex-col items-start gap-2.5">
            <p className="text-[14px] font-semibold">Yasal</p>
            {yasal.map((link) => (
              <Link key={link.href} href={link.href} className="text-[14px] text-muted hover:text-ink">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col items-start gap-2.5">
            <p className="text-[14px] font-semibold">İletişim</p>
            <a href="mailto:destek@tevkilgo.org" className="text-[14px] text-muted hover:text-ink">
              destek@tevkilgo.org
            </a>
          </div>
        </div>
        <p className="mt-6 text-[13px] text-muted">© 2026 TevkilGO</p>
      </footer>
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
