"use client";

import { useEffect, useMemo, useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { kartSinifi, PageHeader } from "@/components/PageHeader";
import { SSS, sssDegerleri, sssMetinDoldur } from "@/lib/sss";
import { createClient } from "@/lib/supabase/client";

export function SssEkrani() {
  const [arama, setArama] = useState("");
  const [acik, setAcik] = useState(null);
  const [degerler, setDegerler] = useState(() => sssDegerleri([]));
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    let iptal = false;
    createClient()
      .from("app_ayarlar")
      .select("anahtar, deger")
      .then(({ data, error }) => {
        if (iptal) return;
        setDegerler(sssDegerleri(error ? [] : data));
        setYukleniyor(false);
      });
    return () => { iptal = true; };
  }, []);

  const gruplar = useMemo(() => {
    const q = arama.trim().toLocaleLowerCase("tr");
    return SSS.map((grup) => ({
      ...grup,
      sorular: grup.sorular
        .map((soru) => ({
          ...soru,
          soru: sssMetinDoldur(soru.soru, degerler),
          cevap: sssMetinDoldur(soru.cevap, degerler),
        }))
        .filter((soru) => {
          if (!q) return true;
          return soru.soru.toLocaleLowerCase("tr").includes(q) || soru.cevap.toLocaleLowerCase("tr").includes(q);
        }),
    })).filter((grup) => grup.sorular.length > 0);
  }, [arama, degerler]);

  return (
    <div className="h-full overflow-y-auto bg-canvas">
      <PageHeader baslik="Sık Sorulan Sorular" />
      <div className={`${kartSinifi} mb-8 space-y-4 p-4`}>
        <input
          value={arama}
          onChange={(e) => setArama(e.target.value)}
          placeholder="Soru veya cevap ara"
          className="control"
        />
        {yukleniyor ? <div className="h-8 animate-pulse rounded-card bg-line/70" aria-busy="true" /> : null}
        {gruplar.map((grup) => (
          <section key={grup.baslik}>
            <h2 className="mb-2 text-[14px] font-semibold text-muted">{grup.baslik}</h2>
            <div className="space-y-2">
              {grup.sorular.map((soru) => {
                const anahtar = `${grup.baslik}-${soru.soru}`;
                const acikMi = acik === anahtar;
                return (
                  <button
                    key={anahtar}
                    type="button"
                    onClick={() => setAcik(acikMi ? null : anahtar)}
                    className="block w-full rounded-card border border-line bg-surface p-4 text-left"
                  >
                    <span className="flex items-start gap-3">
                      <span className="flex-1 text-[15px] font-semibold">{soru.soru}</span>
                      {acikMi ? <CaretUp size={18} className="mt-0.5 shrink-0 text-muted" /> : <CaretDown size={18} className="mt-0.5 shrink-0 text-muted" />}
                    </span>
                    {acikMi ? <span className="mt-3 block text-[15px] leading-relaxed">{soru.cevap}</span> : null}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
