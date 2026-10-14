import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { kart } from "@/components/Bolum";

// İl tevkil sayfasına giden kart; ana sayfa, il listesi ve il sayfalarının yakın iller kutusunda kullanılır
export function IlKarti({ il }) {
  return (
    <Link href={il.yol} className={`${kart} group flex h-full items-center justify-between gap-4 p-6 hover:border-navy`}>
      <span>
        <span className="block text-[17px] font-semibold">{il.ad} Tevkil</span>
        <span className="mt-1 block text-[14px] text-muted">{il.kart}</span>
      </span>
      <ArrowRight size={18} weight="bold" className="shrink-0 text-muted group-hover:text-ink" />
    </Link>
  );
}

export function TumIllerLinki() {
  return (
    <Link
      href="/illere-gore-tevkil"
      className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-navy underline-offset-4 hover:underline"
    >
      Tüm illerde tevkil
      <ArrowRight size={15} weight="bold" />
    </Link>
  );
}
