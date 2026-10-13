"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createClient } from "@/lib/supabase/client";

// Kategoriler panelden yönetilir; bu liste yalnızca ilk yükleme sürerken kullanılır
let kategoriListesi = [
  { kod: "durusma", ad: "Duruşma", sira: 1, aktif: true, not_zorunlu: false },
  { kod: "savcilik", ad: "Savcılık İşlemleri", sira: 2, aktif: true, not_zorunlu: false },
  { kod: "icra", ad: "İcra İşlemleri", sira: 3, aktif: true, not_zorunlu: false },
  { kod: "kurum", ad: "Kurum İşlemleri", sira: 4, aktif: true, not_zorunlu: false },
];
let kategoriYukleniyor = null;
const kategoriDinleyiciler = new Set();

function kategorileriYukle() {
  if (kategoriYukleniyor) return kategoriYukleniyor;
  kategoriYukleniyor = createClient()
    .from("kategoriler")
    .select("kod, ad, sira, aktif, not_zorunlu")
    .order("sira", { ascending: true })
    .then(({ data, error }) => {
      if (error || !data?.length) {
        kategoriYukleniyor = null;
        return;
      }
      kategoriListesi = data;
      kategoriDinleyiciler.forEach((fn) => fn());
    });
  return kategoriYukleniyor;
}

function kategoriAbone(fn) {
  kategoriDinleyiciler.add(fn);
  kategorileriYukle();
  return () => kategoriDinleyiciler.delete(fn);
}

// Seçim listeleri için yalnızca aktif kategoriler: [{ value, label }]
export function useKategoriler() {
  const liste = useSyncExternalStore(kategoriAbone, () => kategoriListesi, () => kategoriListesi);
  return {
    kategoriler: liste,
    secenekler: liste.filter((k) => k.aktif).map((k) => ({ value: k.kod, label: k.ad })),
  };
}

export function kategoriBilgisi(kod) {
  return kategoriListesi.find((k) => k.kod === kod) || null;
}

export const DURUM = {
  acik: "Açık",
  beklemede: "Onay Bekliyor",
  atandi: "Atandı",
  tamamlandi: "Tamamlandı",
  iptal: "İptal",
  suresi_doldu: "Süresi Doldu",
};

export function kategoriAd(kod) {
  return kategoriListesi.find((k) => k.kod === kod)?.ad || kod || "";
}

export function puanlamaKayitlari(data) {
  const ham = Array.isArray(data) ? data : data ? [data] : [];
  return ham
    .map((item) => (item && typeof item === "object" ? item : { id: item }))
    .filter((item) => item && (item.id || item.task_id));
}

export function Iskelet({ satir = 4 }) {
  return (
    <div className="space-y-3 p-4" aria-busy="true" aria-label="Yükleniyor">
      {Array.from({ length: satir }, (_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-card bg-line/70" />
      ))}
    </div>
  );
}

export function Bos({ baslik, metin, children }) {
  return (
    <div className="px-5 py-16 text-center">
      {baslik ? <p className="text-[15px] font-semibold">{baslik}</p> : null}
      {metin ? <p className="mt-2 text-[14px] leading-relaxed text-muted">{metin}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

export function KaydirSonu({ aktif, onGor }) {
  const ref = useRef(null);
  const onGorRef = useRef(onGor);
  useEffect(() => {
    onGorRef.current = onGor;
    const el = ref.current;
    if (!el || !aktif) return undefined;
    const kok = el.closest("[data-kaydir]");
    const goz = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) onGorRef.current();
    }, { root: kok, threshold: 0.4 });
    goz.observe(el);
    return () => goz.disconnect();
  }, [aktif, onGor]);
  return <div ref={ref} className="h-8" aria-hidden="true" />;
}
