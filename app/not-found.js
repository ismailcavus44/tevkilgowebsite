import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { kart } from "@/components/Bolum";
import { HomeFooter } from "@/components/HomeFooter";
import { HomeHeader } from "@/components/HomeHeader";

export const metadata = { title: "Sayfa bulunamadı" };

const yollar = [
  { href: "/", title: "Ana sayfa", text: "Tevkil uygulamasının nasıl çalıştığını gör." },
  { href: "/illere-gore-tevkil", title: "İllere göre tevkil", text: "81 ildeki adliyeler ve şehir rehberleri." },
  { href: "/iletisim", title: "İletişim", text: "Aradığını bulamadıysan bize yaz." },
];

export default function NotFound() {
  return (
    <main id="icerik" className="min-h-dvh overflow-x-clip bg-canvas">
      <div className="p-2 md:p-4">
        <section className="relative overflow-hidden rounded-[32px] bg-ink">
          <HomeHeader />
          <div className="px-6 pb-14 pt-10 lg:px-14 lg:pb-20 lg:pt-12">
            <p className="text-[14px] font-bold uppercase tracking-[0.08em] text-white/60">404</p>
            <h1 className="mt-5 max-w-[20ch] text-[34px] font-extrabold leading-[1.08] tracking-[-0.025em] text-white lg:text-[52px]">
              Aradığın sayfa burada değil.
            </h1>
            <p className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-white/[0.72] lg:text-[19px]">
              Adres yanlış yazılmış ya da sayfa taşınmış olabilir. Aşağıdaki sayfalardan devam edebilirsin.
            </p>
            <Link
              href="/"
              className="mt-10 inline-flex h-14 items-center gap-2 rounded-[12px] bg-white px-6 text-base font-bold text-ink hover:bg-white/90"
            >
              Ana sayfaya dön
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </section>
      </div>

      <section className="px-5 py-12 md:py-16">
        <ul className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {yollar.map((yol) => (
            <li key={yol.href}>
              <Link
                href={yol.href}
                className={`${kart} group flex h-full items-center justify-between gap-4 p-6 hover:border-navy`}
              >
                <span>
                  <span className="block text-[16px] font-semibold">{yol.title}</span>
                  <span className="mt-1 block text-[14px] leading-relaxed text-muted">{yol.text}</span>
                </span>
                <ArrowRight size={18} weight="bold" className="shrink-0 text-muted group-hover:text-ink" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <HomeFooter />
    </main>
  );
}
