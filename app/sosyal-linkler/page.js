import Image from "next/image";
import {
  AppleLogo,
  ArrowUpRight,
  EnvelopeSimple,
  Globe,
  GooglePlayLogo,
  TelegramLogo,
} from "@phosphor-icons/react/ssr";
import { APP_STORE_URL } from "@/components/HomeHero";

// Sosyal medya biyografilerine konan "link in bio" sayfası. Arama motorlarına kapalı
// (noindex) ve sitemap'te yok. Header/footer'sız, tek sütun, telefon öncelikli.
// Sayfa "follow": yalnızca web sitesi bağlantısı takip edilir, diğerleri rel="nofollow".
// Yeni bağlantı eklemek için ANA listesine { ad, alt, href, Ikon } satırı eklemek yeterli.

export const metadata = {
  title: "Bağlantılar",
  description: "TevkilGO uygulaması ve topluluk bağlantıları.",
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

const ANA = [
  { ad: "App Store'dan indir", alt: "iPhone ve iPad", href: APP_STORE_URL, Ikon: AppleLogo },
  {
    ad: "Google Play",
    alt: "Android sürümü yakında",
    href: "https://play.google.com/store/apps/details?id=com.ismailcavus.TevkilGO",
    Ikon: GooglePlayLogo,
    // Uygulama Play Store'a çıkınca bu satırı silip ad'ı "Google Play'den indir", alt'ı "Android" yap.
    yakinda: true,
  },
  { ad: "Telegram grubumuza katıl", alt: "Tevkil ilanları ve duyurular", href: "https://t.me/TevkilGO", Ikon: TelegramLogo },
  { ad: "Web sitesi", alt: "tevkilgo.org", href: "https://www.tevkilgo.org", Ikon: Globe, takip: true },
];

const SOSYAL = [{ ad: "E-posta", href: "mailto:destek@tevkilgo.org", Ikon: EnvelopeSimple }];

export default function SosyalLinklerPage() {
  return (
    <main
      id="icerik"
      className="flex min-h-dvh justify-center bg-ink px-4 pt-[max(3rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex w-full max-w-[440px] flex-col items-center">
        <Image
          src="/icon.png"
          alt=""
          width={88}
          height={88}
          priority
          className="size-22 rounded-[22px] shadow-[0_12px_32px_-8px_rgb(0_0_0/0.5)]"
        />
        <h1 className="mt-5 text-[1.625rem] font-extrabold tracking-tight text-white">TevkilGO</h1>
        <p className="mt-2 max-w-[32ch] text-center text-[0.9375rem] leading-relaxed text-on-ink">
          Duruşmana gidemiyorsan, adliyedeki meslektaşın gitsin.
        </p>

        <ul className="mt-8 flex w-full flex-col gap-3">
          {ANA.map(({ ad, alt, href, Ikon, takip, yakinda }) => (
            <li key={href}>
              {yakinda ? (
                <div
                  aria-disabled="true"
                  className="flex min-h-16 cursor-not-allowed items-center gap-4 rounded-[16px] bg-white/10 px-4 py-3 text-white/50 select-none"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-white/10">
                    <Ikon size={22} weight="fill" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-bold">{ad}</span>
                    <span className="block truncate text-sm">{alt}</span>
                  </span>
                  <span className="shrink-0 rounded-full border border-white/20 px-2.5 py-1 text-xs font-semibold">
                    Yakında
                  </span>
                </div>
              ) : (
              <a
                href={href}
                {...(takip ? {} : { target: "_blank", rel: "nofollow noopener noreferrer" })}
                className="group flex min-h-16 items-center gap-4 rounded-[16px] bg-white px-4 py-3 text-ink transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold [@media(hover:hover)]:hover:-translate-y-0.5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-muted">
                  <Ikon size={22} weight="fill" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold">{ad}</span>
                  <span className="block truncate text-sm text-muted-foreground">{alt}</span>
                </span>
                <ArrowUpRight size={18} weight="bold" aria-hidden="true" className="shrink-0 text-muted-foreground" />
              </a>
              )}
            </li>
          ))}
        </ul>

        {SOSYAL.length > 0 && (
          <ul className="mt-8 flex flex-wrap justify-center gap-3" aria-label="Sosyal medya">
            {SOSYAL.map(({ ad, href, Ikon }) => (
              <li key={ad}>
                <a
                  href={href}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  aria-label={ad}
                  title={ad}
                  className="flex size-12 items-center justify-center rounded-full border border-white/20 text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold [@media(hover:hover)]:hover:bg-white/10"
                >
                  <Ikon size={22} weight="fill" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-auto pt-10 text-xs text-on-ink/60">© TevkilGO</p>
      </div>
    </main>
  );
}
