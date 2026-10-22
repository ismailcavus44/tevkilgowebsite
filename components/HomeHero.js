import Link from "next/link";
import { HomeHeader } from "@/components/HomeHeader";
import { PhoneFrame } from "@/components/PhoneFrame";
import { IlanDetayEkrani } from "@/components/screens/IlanDetayEkrani";
import { IlanlarEkrani } from "@/components/screens/IlanlarEkrani";

export function WebUyeOl() {
  return (
    <Link
      href="/uye-ol"
      className="inline-flex h-14 items-center rounded-[12px] border border-white/25 px-6 text-base font-bold text-white hover:bg-white/10"
    >
      Web&apos;de üye ol
    </Link>
  );
}

// Ana sayfa ve il sayfalarının ortak hero'su. ekran: telefon önizlemelerinde gösterilecek il ve adliyeler.
export function HomeHero({ ust, baslik, metin, alt, ekran = {} }) {
  return (
    <div className="p-2 md:p-4">
      <section className="relative flex min-h-[88vh] flex-col overflow-hidden rounded-[32px] bg-ink">
        <HomeHeader />
        <div className="grid flex-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="flex flex-col justify-center px-6 pb-10 pt-10 lg:px-14 lg:pb-16 lg:pt-6">
            <h1>
              <span className="mb-5 block text-[14px] font-bold uppercase tracking-[0.08em] text-white/60">{ust}</span>
              <span className="block max-w-[16ch] text-[38px] font-extrabold leading-[1.04] tracking-[-0.025em] text-white lg:text-[64px]">
                {baslik}
              </span>
            </h1>
            <p className="mt-6 max-w-[30rem] text-[18px] leading-relaxed text-white/[0.72] lg:text-[20px]">{metin}</p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <WebUyeOl />
            </div>
            <p className="mt-14 text-[14px] text-white/60">{alt}</p>
          </div>

          <div data-nosnippet aria-hidden="true" className="relative mb-10 hidden h-[680px] self-center sm:block lg:my-10">
            <div className="absolute bottom-0 left-1/2 h-full w-[480px] -translate-x-1/2">
              <PhoneFrame scale={0.62} className="absolute left-0 top-[84px] rounded-[27px]">
                <IlanDetayEkrani il={ekran.il} adliye={ekran.detay} />
              </PhoneFrame>
              <PhoneFrame
                scale={0.74}
                className="absolute right-0 top-[28px] rounded-[33px] shadow-[0_30px_60px_rgb(0_0_0/0.35)]"
              >
                <IlanlarEkrani adliyeler={ekran.adliyeler} />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
