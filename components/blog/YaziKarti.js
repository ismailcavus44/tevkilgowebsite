import Image from "next/image";
import Link from "next/link";
import { kart } from "@/components/Bolum";
import { KATEGORILER, tarihYaz } from "@/lib/blog";

// Blog ızgarasındaki ve yazı altındaki "ilgili yazılar" kartı. Kapak yoksa markalı zemin gösterilir.
export function YaziKarti({ yazi, oncelikli = false, baslikEtiketi: Baslik = "h2" }) {
  return (
    <article className={`${kart} group relative flex h-full flex-col overflow-hidden hover:border-navy`}>
      <div className="relative aspect-[1200/630] overflow-hidden bg-ink">
        {yazi.kapak_url ? (
          <Image
            src={yazi.kapak_url}
            alt={yazi.kapak_alt || ""}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
            priority={oncelikli}
            className="object-cover motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center gap-3" aria-hidden="true">
            <Image src="/icon.png" alt="" width={40} height={40} className="size-10 rounded-[10px]" />
            <span className="text-[20px] font-extrabold tracking-tight text-white">TevkilGO</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[13px] font-semibold text-navy">{KATEGORILER[yazi.kategori] || "Rehber"}</p>
        <Baslik className="mt-2 text-[18px] font-semibold leading-snug tracking-[-0.01em]">
          <Link href={`/${yazi.slug}`} className="after:absolute after:inset-0">
            {yazi.baslik}
          </Link>
        </Baslik>
        {yazi.ozet ? <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-muted">{yazi.ozet}</p> : null}
        <p className="mt-auto pt-4 text-[13px] text-muted">
          <time dateTime={yazi.yayin_tarihi}>{tarihYaz(yazi.yayin_tarihi)}</time>
        </p>
      </div>
    </article>
  );
}
