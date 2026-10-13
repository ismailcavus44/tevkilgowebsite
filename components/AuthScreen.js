import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { IlanlarEkrani } from "@/components/screens/IlanlarEkrani";

const yasal = [
  { href: "/gizlilik", label: "Gizlilik" },
  { href: "/kvkk", label: "KVKK" },
  { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
];

export function AuthScreen({ title, lede, logo = true, geri = "/", geriYazi = "Ana sayfa", children }) {
  return (
    <div className="grid min-h-dvh gap-2 p-2 md:gap-4 md:p-4 lg:grid-cols-2">
      <div className="flex flex-col px-3 pb-4 pt-3 sm:px-8 lg:px-12 lg:pt-6">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/icon.png" alt="" width={32} height={32} className="rounded-lg" />
            <span className="text-[17px] font-extrabold tracking-tight">TevkilGO</span>
          </Link>
          <Link href={geri} className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-primary hover:underline">
            <ArrowLeft className="size-4" />
            {geriYazi}
          </Link>
        </header>

        <main id="icerik" className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[400px]">
            {logo ? (
              <Image src="/logo.png" alt="TevkilGO" width={160} height={160} priority className="mx-auto mb-6 h-40 w-40 object-contain" />
            ) : null}
            <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">{title}</h1>
            {lede ? <p className="mt-2 text-[15px] leading-relaxed text-muted">{lede}</p> : null}
            <div className="mt-8">{children}</div>
          </div>
        </main>

        <footer className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted">
          <span>© 2026 TevkilGO</span>
          {yasal.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
        </footer>
      </div>

      <aside className="relative hidden flex-col overflow-hidden rounded-[32px] bg-ink lg:sticky lg:top-4 lg:flex lg:h-[calc(100dvh-2rem)]">
        <div className="px-14 pt-14">
          <p className="max-w-[17ch] text-[36px] font-extrabold leading-[1.08] tracking-[-0.025em] text-white">
            Duruşmana gidemiyorsan, adliyedeki meslektaşın gitsin.
          </p>
          <p className="mt-5 text-[14px] text-white/60">81 baro · 597 adliye · Baro kimliğiyle doğrulanmış üyelik</p>
        </div>
        <div className="mt-auto flex justify-center pt-10">
          <PhoneFrame
            scale={0.66}
            crop={470}
            className="rounded-t-[29px] shadow-[0_30px_60px_rgb(0_0_0/0.35)]"
          >
            <IlanlarEkrani />
          </PhoneFrame>
        </div>
      </aside>
    </div>
  );
}
