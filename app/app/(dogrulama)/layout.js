import Image from "next/image";
import Link from "next/link";
import { CikisButonu } from "@/components/CikisButonu";

export default function DogrulamaLayout({ children }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="flex h-16 items-center justify-between border-b border-line bg-surface px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/icon.png" alt="" width={30} height={30} className="rounded-lg" />
          <span className="text-[17px] font-extrabold tracking-tight">TevkilGO</span>
        </Link>
        <CikisButonu className="text-[14px] font-medium text-muted hover:text-ink" />
      </header>
      <main id="icerik" className="flex-1 px-5 py-10 sm:py-14">
        <div className="mx-auto w-full max-w-[480px]">{children}</div>
      </main>
    </div>
  );
}
