import { HomeHeader } from "@/components/HomeHeader";

// Ana sayfa hero'sunun telefon önizlemesiz, alçak hali; kurumsal sayfaların üst bölümü
export function SayfaHero({ ust, baslik, metin }) {
  return (
    <div className="p-2 md:p-4">
      <section className="relative overflow-hidden rounded-[32px] bg-ink">
        <HomeHeader />
        <div className="px-6 pb-14 pt-10 lg:px-14 lg:pb-20 lg:pt-12">
          <h1>
            <span className="mb-5 block text-[14px] font-bold uppercase tracking-[0.08em] text-white/60">{ust}</span>
            <span className="block max-w-[22ch] text-[34px] font-extrabold leading-[1.08] tracking-[-0.025em] text-white lg:text-[52px]">
              {baslik}
            </span>
          </h1>
          <p className="mt-6 max-w-[38rem] text-[17px] leading-relaxed text-white/[0.72] lg:text-[19px]">{metin}</p>
        </div>
      </section>
    </div>
  );
}
