import Image from "next/image";
import Link from "next/link";

const kurumsal = [
  { href: "/illere-gore-tevkil", label: "İllere Göre Tevkil" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

const links = [
  { href: "/gizlilik", label: "Gizlilik Politikası" },
  { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
  { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
  { href: "/hesap-silme", label: "Hesap Silme" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <Link href="/" className="flex items-center gap-2 self-start">
            <Image src="/icon.png" alt="" width={36} height={36} className="rounded-lg" />
            <span className="text-lg font-extrabold tracking-tight">TevkilGO</span>
          </Link>
          <nav aria-label="Kurumsal" className="flex flex-col items-start gap-3">
            <p className="text-base font-bold">Kurumsal</p>
            {kurumsal.map((link) => (
              <Link key={link.href} href={link.href} className="text-[15px] leading-snug text-muted hover:text-ink">
                {link.label}
              </Link>
            ))}
          </nav>
          <nav aria-label="Yasal" className="flex flex-col items-start gap-3">
            <p className="text-base font-bold">Yasal</p>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] leading-snug text-muted hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col items-start gap-3">
            <p className="text-base font-bold">İletişim</p>
            <a
              href="mailto:destek@tevkilgo.org"
              className="text-[15px] leading-snug text-muted hover:text-ink"
            >
              destek@tevkilgo.org
            </a>
          </div>
          <div className="flex flex-col items-start gap-3">
            <p className="text-base font-bold">Uygulama</p>
            <Link href="/uye-ol" className="text-[15px] leading-snug text-muted hover:text-ink">
              Ücretsiz üye ol
            </Link>
            <Link href="/giris" className="text-[15px] leading-snug text-muted hover:text-ink">
              Giriş yap
            </Link>
          </div>
        </div>
        <p className="mt-12 border-t border-line pt-6 text-[15px] text-muted">
          © 2026 TevkilGO
        </p>
      </div>
    </footer>
  );
}
