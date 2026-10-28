import Image from "next/image";
import Link from "next/link";
import { yayindakiIller } from "@/lib/il-icerik";

const kurumsal = [
  { href: "/illere-gore-tevkil", label: "İllere Göre Tevkil" },
  { href: "/blog", label: "Blog" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

const yasal = [
  { href: "/gizlilik", label: "Gizlilik Politikası" },
  { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
  { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
  { href: "/hesap-silme", label: "Hesap Silme" },
];

export function HomeFooter() {
  return (
    <footer className="mx-auto mt-12 w-full max-w-5xl px-5 pb-12">
      <div className="grid gap-10 border-b border-line pb-10 sm:grid-cols-2 lg:grid-cols-[2fr_1.6fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/icon.png" alt="" width={30} height={30} className="rounded-lg" />
            <span className="text-[17px] font-extrabold tracking-tight">TevkilGO</span>
          </Link>
          <p className="mt-4 max-w-[300px] text-[14px] leading-relaxed text-muted">
            Avukatlar arası tevkil uygulaması. Duruşma ve adliye işleri için doğrulanmış meslektaşlarla buluşma yeri.
          </p>
        </div>
        <nav aria-label="İllere göre tevkil" className="flex flex-col items-start gap-2.5">
          <p className="text-[14px] font-semibold">Tevkil</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {yayindakiIller().map((il) => (
              <Link key={il.yol} href={il.yol} className="text-[14px] text-muted hover:text-ink">
                {il.ad} tevkil
              </Link>
            ))}
          </div>
        </nav>
        <nav aria-label="Kurumsal" className="flex flex-col items-start gap-2.5">
          <p className="text-[14px] font-semibold">Kurumsal</p>
          {kurumsal.map((link) => (
            <Link key={link.href} href={link.href} className="text-[14px] text-muted hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
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
  );
}
