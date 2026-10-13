"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hataMesaji } from "@/lib/hata-mesaji";
import { useOzellikler } from "@/components/uygulama/Ozellikler";
import { createClient } from "@/lib/supabase/client";

function whatsappNumara(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `90${digits.slice(1)}`;
  else if (digits.length === 10 && digits.startsWith("5")) digits = `90${digits}`;
  return digits;
}

function kalanDakika(bitis) {
  if (!bitis) return 0;
  const ms = new Date(bitis).getTime() - (performance.timeOrigin + performance.now());
  if (!Number.isFinite(ms)) return 0;
  return Math.max(0, Math.ceil(ms / 60000));
}

export function AvukatAra() {
  const router = useRouter();
  const { modlarAktif, hazir } = useOzellikler();
  const [iller, setIller] = useState([]);
  const [adliyeler, setAdliyeler] = useState([]);
  const [il, setIl] = useState("");
  const [adliye, setAdliye] = useState("");
  const [segment, setSegment] = useState("tumu");
  const [ben, setBen] = useState(null);
  const [liste, setListe] = useState(null);
  const [hata, setHata] = useState("");
  const [, setSimdi] = useState(0);

  useEffect(() => {
    if (hazir && !modlarAktif) router.replace("/app");
  }, [hazir, modlarAktif, router]);

  const yukle = useCallback(async (seciliIl, seciliAdliye) => {
    const { data, error } = await createClient().rpc("aktif_modlar", {
      p_il: seciliIl || null,
      p_adliye: seciliAdliye || null,
    });
    if (error) throw error;
    setListe(data || []);
  }, []);

  useEffect(() => {
    let iptal = false;
    (async () => {
      const supabase = createClient();
      const [{ data: { user } }, sehir, mahkeme] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("cities").select("slug, name").order("name", { ascending: true }),
        supabase.from("adliyeler").select("kod, ad, il_kod").eq("aktif", true).order("sira", { ascending: true }),
      ]);
      if (iptal) return;
      setIller(sehir.data || []);
      setAdliyeler(mahkeme.data || []);
      setBen(user?.id || null);
      let secili = "";
      if (user) {
        const { data } = await supabase.from("users").select("il").eq("id", user.id).single();
        secili = data?.il || "";
      }
      setIl(secili);
      await yukle(secili || null, null);
    })().catch((error) => { if (!iptal) setHata(hataMesaji(error)); });
    return () => { iptal = true; };
  }, [yukle]);

  useEffect(() => {
    const zaman = setInterval(() => setSimdi((n) => n + 1), 30000);
    return () => clearInterval(zaman);
  }, []);

  const gorunen = (liste || []).filter((kisi) => {
    if (kalanDakika(kisi.bitis) <= 0) return false;
    if (segment === "adliye") return kisi.tip === "adliye";
    if (segment === "gece") return kisi.tip === "gece";
    return true;
  });
  const adliyeAd = (kod) => adliyeler.find((s) => s.kod === kod)?.ad || kod;

  if (hazir && !modlarAktif) return null;

  return (
    <div className="h-full overflow-y-auto bg-canvas">
      <div className="mx-auto max-w-lg space-y-4 py-6 md:px-5 md:py-8">
        <h1 className="text-[22px] font-semibold">Müsait</h1>
        {hata ? <p className="text-[14px] text-danger">{hata}</p> : null}
        <label className="block text-[14px] font-medium">İl
          <select className="control mt-1.5" value={il} onChange={(e) => { setIl(e.target.value); setAdliye(""); yukle(e.target.value || null, null).catch((error) => setHata(hataMesaji(error))); }}>
            <option value="">İl seçin</option>
            {iller.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </label>
        <label className="block text-[14px] font-medium">Adliye
          <select className="control mt-1.5" value={adliye} onChange={(e) => { setAdliye(e.target.value); yukle(il || null, e.target.value || null).catch((error) => setHata(hataMesaji(error))); }}>
            <option value="">Tüm adliyeler</option>
            {adliyeler.filter((s) => !il || s.il_kod === il).map((s) => <option key={s.kod} value={s.kod}>{s.ad}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[["tumu", "Tümü"], ["adliye", "Adliyede"], ["gece", "Gece"]].map(([value, label]) => (
            <button key={value} type="button" onClick={() => setSegment(value)} className={`min-h-11 rounded-control border px-2 py-2 text-base ${segment === value ? "border-navy bg-navy text-white" : "border-line"}`}>{label}</button>
          ))}
        </div>
        {!liste ? <div className="h-24 animate-pulse rounded-card bg-line/70" aria-busy="true" /> : null}
        {liste && !gorunen.length ? <p className="text-[14px] text-muted">Şu an bu bölgede modu açık meslektaş yok.</p> : null}
        <ul className="space-y-3">
          {gorunen.map((kisi) => (
            <li key={kisi.oturum_id} className="rounded-card border border-line bg-surface p-4">
              <p className="font-semibold break-words">{kisi.ad_soyad}{kisi.kullanici_id === ben ? " · Siz" : ""}</p>
              {kisi.baro ? <p className="text-[14px] text-muted">{kisi.baro}</p> : null}
              {kisi.tbb_sicil ? <p className="text-[14px] text-muted">TBB Sicil: {kisi.tbb_sicil}</p> : null}
              <p className="mt-2 text-[14px]">{kisi.tip === "gece" ? "Gece Nöbeti" : "Adliyede"} · {adliyeAd(kisi.adliye)}</p>
              <p className="text-[14px] text-muted">{kalanDakika(kisi.bitis)} dk kaldı</p>
              {kisi.kullanici_id === ben ? null : (
                <div className="mt-3 flex gap-3 text-[14px] font-medium text-navy">
                  <a href={`tel:${kisi.telefon}`}>Ara</a>
                  <a href={`https://wa.me/${whatsappNumara(kisi.telefon)}`}>WhatsApp</a>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
