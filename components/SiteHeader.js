import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/Button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface md:static">
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between gap-3 px-5">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <Image src="/icon.png" alt="" width={32} height={32} className="rounded-lg" />
          <span className="truncate text-lg font-extrabold tracking-tight">
            TevkilGO
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <Button href="/giris" variant="secondary" className="px-3 text-sm">
            Giriş yap
          </Button>
          <Button href="/uye-ol" className="px-3 text-sm">
            Üye ol
          </Button>
        </div>
      </div>
    </header>
  );
}
