"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/Button";
import { BANDI_AC_OLAYI, cerezBandiniAc, cerezOnayiKaydet, useCerezOnayi } from "@/lib/cerez-onay";

// Reklam ölçüm çerezleri için açık rıza bandı. "Kabul et" ve "Reddet" eşit ağırlıktadır;
// seçim yapılmadıkça Meta Pixel ve Google etiketi yüklenmez.
const bosAbone = () => () => {};

export function CerezBandi() {
  const onay = useCerezOnayi();
  const yol = usePathname() || "/";
  const [elleAcik, setElleAcik] = useState(false);
  // Sunucuda false, tarayıcıda true: rıza okunmadan bant bir an görünüp kaybolmasın.
  const hazir = useSyncExternalStore(bosAbone, () => true, () => false);

  useEffect(() => {
    const ac = () => setElleAcik(true);
    window.addEventListener(BANDI_AC_OLAYI, ac);
    return () => window.removeEventListener(BANDI_AC_OLAYI, ac);
  }, []);

  // Üye alanında (/app) ölçüm yapılmadığı için bant da gösterilmez.
  const uyeAlani = yol === "/app" || yol.startsWith("/app/");
  if (!hazir || uyeAlani || (onay !== null && !elleAcik)) return null;

  function sec(durum) {
    cerezOnayiKaydet(durum);
    setElleAcik(false);
  }

  return (
    <section
      role="region"
      aria-label="Çerez tercihi"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 mx-auto max-w-3xl rounded-modal border border-line bg-surface p-5 shadow-float sm:inset-x-6"
    >
      <p className="text-[15px] font-semibold">Çerez tercihin</p>
      <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
        Sitenin çalışması için gerekli çerezler her zaman kullanılır. İzin verirsen, reklamlarımızın kaç avukata
        ulaştığını ölçmek için Meta ve Google reklam çerezlerini de kullanırız. Bu çerezlerle ad, e-posta veya
        telefon bilgin paylaşılmaz. Ayrıntılar{" "}
        <Link href="/gizlilik#cerezler-ve-reklam-olcumu" className="font-medium text-navy underline underline-offset-2">
          Gizlilik Politikası
        </Link>
        &apos;nda.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" type="button" onClick={() => sec("red")}>
          Reddet
        </Button>
        <Button variant="secondary" type="button" onClick={() => sec("kabul")}>
          Kabul et
        </Button>
      </div>
    </section>
  );
}

export function CerezTercihleriLinki({ className = "" }) {
  return (
    <button
      type="button"
      onClick={cerezBandiniAc}
      className={`text-left ${className}`}
    >
      Çerez Tercihleri
    </button>
  );
}
