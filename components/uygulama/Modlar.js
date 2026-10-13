"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Buildings, MoonStars } from "@phosphor-icons/react";
import { Button } from "@/components/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { hataMesaji } from "@/lib/hata-mesaji";
import { createClient } from "@/lib/supabase/client";

function ikiHane(deger) {
  const sayi = Number(deger);
  return String(Number.isFinite(sayi) ? sayi : deger).padStart(2, "0");
}

function sureYaz(dakika) {
  const sayi = Math.max(0, Math.trunc(Number(dakika) || 0));
  const saat = Math.floor(sayi / 60);
  const dk = sayi % 60;
  if (saat && dk) return `${saat} sa ${dk} dk`;
  if (saat) return `${saat} sa`;
  return `${dk} dk`;
}

function kisaTarih(value) {
  if (!value) return "";
  const tarih = new Date(value);
  if (Number.isNaN(tarih.getTime())) return "";
  return new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", day: "2-digit", month: "2-digit" }).format(tarih).replace(/\.$/, "");
}

function bakiyeSatiri(durum) {
  const parcalar = [
    ["Adliye", durum?.adliye_bakiye_dk, durum?.adliye_bakiye_bitis],
    ["Gece", durum?.gece_bakiye_dk, durum?.gece_bakiye_bitis],
  ].filter(([, dakika]) => Number(dakika) > 0);
  if (!parcalar.length) return "";
  const tarihler = [...new Set(parcalar.map(([, , bitis]) => kisaTarih(bitis)).filter(Boolean))];
  const govde = parcalar.map(([ad, dakika, bitis]) => {
    const tarih = kisaTarih(bitis);
    if (tarihler.length > 1 && tarih) return `${ad} ${sureYaz(dakika)} · ${tarih}'e kadar`;
    return `${ad} ${sureYaz(dakika)}`;
  }).join(" · ");
  const son = tarihler.length === 1 ? ` · ${tarihler[0]}'e kadar` : "";
  return `Kalan süre: ${govde}${son}`;
}

let ucus = null;
const dinleyen = new Set();

function sayiya(deger) {
  if (deger == null || deger === "") return null;
  const sayi = Number(deger);
  return Number.isFinite(sayi) ? sayi : null;
}

function ayarAyikla(satirlar) {
  const harita = Object.fromEntries((satirlar || []).map((satir) => [satir.anahtar, satir.deger]));
  const adliye = sayiya(harita.adliye_mod_dakika);
  const gece = sayiya(harita.gece_mod_dakika);
  if (adliye == null || gece == null) return null;
  return {
    adliye,
    gece,
    bas: sayiya(harita.gece_baslangic_saat),
    bit: sayiya(harita.gece_bitis_saat),
  };
}

async function modKaydiGetir() {
  if (ucus) return ucus;
  const istek = (async () => {
    const supabase = createClient();
    await supabase.auth.getSession();
    const { data: oturum } = await supabase.auth.getUser();
    const user = oturum?.user;
    const ayarSorgusu = () => supabase.from("app_ayarlar").select("anahtar, deger").in("anahtar", ["adliye_mod_dakika", "gece_mod_dakika", "gece_baslangic_saat", "gece_bitis_saat"]);
    const [ayarSonuc, modSonuc, adliyeSonuc] = await Promise.all([
      ayarSorgusu(),
      supabase.rpc("benim_modum"),
      supabase.from("adliyeler").select("kod, ad, teyit_bekliyor").eq("aktif", true),
    ]);
    if (ayarSonuc.error) throw ayarSonuc.error;
    if (modSonuc.error) throw modSonuc.error;
    let ayar = ayarAyikla(ayarSonuc.data);
    if (!ayar) {
      const tekrar = await ayarSorgusu();
      if (tekrar.error) throw tekrar.error;
      ayar = ayarAyikla(tekrar.data);
    }
    let adliyeler = [];
    if (user) {
      const { data, error } = await supabase.from("users").select("adliyeler").eq("id", user.id).single();
      if (error) throw error;
      adliyeler = data?.adliyeler || [];
    }
    const paket = { durum: modSonuc.data || {}, ayar, adliyeler, katalog: adliyeSonuc.data || [] };
    dinleyen.forEach((fn) => fn(paket));
    return paket;
  })();
  ucus = istek;
  try {
    return await istek;
  } finally {
    if (ucus === istek) ucus = null;
  }
}

function kalanDakika(bitis) {
  if (!bitis) return 0;
  const ms = new Date(bitis).getTime() - (performance.timeOrigin + performance.now());
  if (!Number.isFinite(ms)) return 0;
  return Math.max(0, Math.ceil(ms / 60000));
}

export function Modlar({ gomulu = false, kartlar = false }) {
  const [durum, setDurum] = useState(null);
  const [adliyeler, setAdliyeler] = useState([]);
  const [katalog, setKatalog] = useState([]);
  const [ayar, setAyar] = useState(null);
  const [hata, setHata] = useState("");
  const [bilgi, setBilgi] = useState(false);
  const [bekleyen, setBekleyen] = useState(null);
  const [secilen, setSecilen] = useState(null);
  const [onay, setOnay] = useState(false);
  const [islem, setIslem] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [geceSaatDisi, setGeceSaatDisi] = useState(false);

  const adliyeAdi = (kod) => katalog.find((s) => s.kod === kod)?.ad || kod || "";

  const yukle = useCallback(() => modKaydiGetir(), []);

  useEffect(() => {
    const parca = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Istanbul",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const al = (tip) => Number(parca.find((oge) => oge.type === tip)?.value || 0);
    const dakika = al("hour") * 60 + al("minute");
    setGeceSaatDisi(dakika >= 8 * 60 && dakika < 18 * 60);
  }, []);

  useEffect(() => {
    let iptal = false;
    const dinle = (paket) => {
      if (iptal) return;
      setDurum(paket.durum);
      setAyar(paket.ayar);
      setAdliyeler(paket.adliyeler);
      setKatalog(paket.katalog);
      setYukleniyor(false);
    };
    dinleyen.add(dinle);
    yukle().catch((error) => {
      if (iptal) return;
      const mesaj = hataMesaji(error);
      if (kartlar) toast.error(mesaj);
      else setHata(mesaj);
      setYukleniyor(false);
    });
    return () => {
      iptal = true;
      dinleyen.delete(dinle);
    };
  }, [yukle, kartlar]);

  const dk = durum?.aktif ? kalanDakika(durum.bitis) : 0;
  const acik = Boolean(durum?.aktif) && dk > 0;
  const adliyeGunluk = Number(durum?.adliye_gunluk_kalan) || 0;
  const geceGunluk = Number(durum?.gece_gunluk_kalan) || 0;
  const adliyeBakiye = Number(durum?.adliye_bakiye_dk) || 0;
  const geceBakiye = Number(durum?.gece_bakiye_dk) || 0;
  const adliyeBitti = adliyeGunluk <= 0 && adliyeBakiye <= 0;
  const geceBitti = geceGunluk <= 0 && geceBakiye <= 0;
  const bakiyeKaynak = durum?.kaynak === "bakiye";
  const hazir = Boolean(ayar && durum);
  const etiket = (gunluk, bakiyeDk, ucretsizDk) => {
    if (gunluk > 0) return ucretsizDk == null ? null : `Ücretsiz · ${ucretsizDk} dk`;
    if (bakiyeDk > 0) return `Bakiye · ${sureYaz(bakiyeDk)}`;
    return "Bugün kullanıldı";
  };
  const adliyeEtiket = hazir ? etiket(adliyeGunluk, adliyeBakiye, ayar.adliye) : null;
  const geceEtiket = hazir ? etiket(geceGunluk, geceBakiye, ayar.gece) : null;
  const geceAralik = ayar?.bas != null && ayar?.bit != null ? `${ikiHane(ayar.bas)}:00–${ikiHane(ayar.bit)}:00` : "";
  const bilgiMetin = `Mod açıkken adınız ve telefonunuz seçtiğiniz adliyede, belirtilen süre boyunca Müsait listesinde görünür. Her modu günde bir kez açabilirsiniz; erken kapatırsanız aynı gün tekrar açamazsınız.${geceAralik ? ` Gece modu ${geceAralik} arasında açılabilir.` : ""}`;

  function baslat(tip) {
    if (tip === "adliye" && adliyeBitti) return;
    if (tip === "gece" && geceBitti) return;
    if (!adliyeler.length) {
      const mesaj = "Önce profilden çalıştığınız bölgeyi seçin";
      if (kartlar) toast.error(mesaj);
      else setHata(mesaj);
      return;
    }
    setBekleyen(tip);
    setHata("");
    if (adliyeler.length === 1) {
      setSecilen(adliyeler[0]);
      setOnay(true);
      return;
    }
    setSecilen(null);
  }

  async function onayla() {
    if (islem) return;
    const tip = bekleyen;
    setIslem(true);
    let mesaj = "";
    try {
      const { error } = await createClient().rpc("mod_ac", { p_tip: tip, p_adliye: secilen });
      if (error) throw error;
    } catch (error) {
      mesaj = hataMesaji(error);
    }
    setIslem(false);
    setOnay(false);
    setBekleyen(null);
    if (mesaj) {
      toast.error(mesaj);
      return;
    }
    toast.success(tip === "gece" ? "Gece modu açıldı" : "Adliye modu açıldı");
    try {
      await yukle();
    } catch (error) {
      const yukleme = hataMesaji(error);
      if (kartlar) toast.error(yukleme);
      else setHata(yukleme);
    }
  }

  async function kapat() {
    try {
      const { error } = await createClient().rpc("mod_kapat");
      if (error) throw error;
      await yukle();
    } catch (error) {
      const mesaj = hataMesaji(error);
      if (kartlar) toast.error(mesaj);
      else setHata(mesaj);
    }
  }

  const gunlukVar = bekleyen === "gece" ? geceGunluk > 0 : adliyeGunluk > 0;
  const sure = bekleyen === "gece" ? ayar?.gece : ayar?.adliye;

  const acikAdliye = acik && durum?.tip !== "gece";
  const acikGece = acik && durum?.tip === "gece";
  const acikOzet = `Açık · ${dk} dk kaldı${durum?.adliye ? ` · ${adliyeAdi(durum.adliye)}` : ""}`;

  if (kartlar) {
    return (
      <div className="space-y-3">
        <section className="overflow-hidden rounded-lg border border-border bg-card shadow-none">
          <div className="border-b border-border p-4">
            <h2 className="text-sm font-medium">Modlarım</h2>
          </div>
          {yukleniyor ? (
            <div className="divide-y divide-border">
              <div className="px-4 py-3"><Skeleton className="h-4 w-40" /></div>
              <div className="px-4 py-3"><Skeleton className="h-4 w-40" /></div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              <ModSatiri
                ikon={Buildings}
                baslik="Adliye modu"
                aciklama="Seçtiğin adliyede müsait listesinde görünürsün"
                acik={acikAdliye}
                ozet={acikOzet}
                etiket={adliyeEtiket}
                pasif={!hazir || adliyeBitti}
                onAc={() => baslat("adliye")}
                onKapat={kapat}
                kapatBaslik={bakiyeKaynak && durum?.tip !== "gece" ? "Duraklat" : "Kapat"}
              />
              <ModSatiri
                ikon={MoonStars}
                baslik="Gece modu"
                aciklama={geceSaatDisi ? "18:00'den sonra açılabilir" : (geceAralik ? `${geceAralik} arası açılabilir` : "")}
                acik={acikGece}
                ozet={acikOzet}
                etiket={geceEtiket}
                pasif={!hazir || geceBitti || geceSaatDisi}
                onAc={() => { if (!geceSaatDisi) baslat("gece"); }}
                onKapat={kapat}
                kapatBaslik={bakiyeKaynak && durum?.tip === "gece" ? "Duraklat" : "Kapat"}
              />
            </div>
          )}
        </section>
        {bekleyen && adliyeler.length > 1 && !onay ? (
          <section className="space-y-2 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <p className="font-semibold">Hangi adliyede müsaitsiniz?</p>
            {adliyeler.map((slug) => {
              const kayit = katalog.find((s) => s.kod === slug);
              return (
                <Button key={slug} type="button" variant="secondary" className="w-full" onClick={() => { setSecilen(slug); setOnay(true); }}>
                  {kayit?.ad || adliyeAdi(slug)}{kayit?.teyit_bekliyor ? " (teyit bekleniyor)" : ""}
                </Button>
              );
            })}
          </section>
        ) : null}
        {onay ? (
          <div role="dialog" className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 md:items-center">
            <div className="max-h-[90dvh] w-full max-w-md space-y-3 overflow-y-auto rounded-card bg-surface p-6 shadow-float" style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
              <h2 className="text-[17px] font-semibold">{bekleyen === "gece" ? "Gece modunu aç" : "Adliye modunu aç"}</h2>
              <p className="text-[14px] leading-relaxed">
                {gunlukVar
                  ? `${adliyeAdi(secilen)} için ${bekleyen === "gece" ? "gece" : "adliye"} modunu açıyorsunuz. Adınız ve telefonunuz ${sure} dakika boyunca Müsait listesinde bu adliyede görünecek. Bu hakkı bugün bir kez kullanabilirsiniz.`
                  : "Mod bakiyenizden açılacak. Dilediğiniz zaman duraklatabilirsiniz; kullanmadığınız süre bakiyenize iade edilir."}
              </p>
              <Button type="button" className="w-full" disabled={islem} onClick={onayla}>{islem ? "Onaylanıyor…" : "Onayla"}</Button>
              <Button type="button" variant="secondary" className="w-full" disabled={islem} onClick={() => { setOnay(false); setBekleyen(null); }}>Vazgeç</Button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={gomulu ? "" : "h-full overflow-y-auto bg-canvas"}>
      <div className={gomulu ? "space-y-4" : "mx-auto max-w-lg space-y-4 px-5 py-8 lg:max-w-4xl lg:px-6"}>
        {gomulu ? null : <h1 className="text-[22px] font-semibold lg:hidden">Müsaitlik</h1>}
        {yukleniyor ? <div className="h-28 animate-pulse rounded-card bg-line/70" aria-busy="true" /> : null}
        {hata ? <p role="alert" className="text-[14px] text-danger">{hata}</p> : null}
        {!yukleniyor && acik ? (
          <section className="space-y-3 rounded-card border border-line bg-surface p-4 lg:hidden">
            <p className="font-semibold">{durum.tip === "gece" ? "Gece Nöbeti" : "Adliyedesiniz"} · {adliyeAdi(durum.adliye)}</p>
            <p className="text-[20px] font-semibold">{dk} dk kaldı</p>
            <Link href="/app/avukat-ara" className="text-[14px] font-medium text-navy hover:underline">Müsait listesini gör</Link>
            <Kapat onayMetin={bakiyeKaynak
              ? "Mod duraklatılacak, kalan süreniz bakiyenize iade edilecek. İstediğiniz zaman tekrar açabilirsiniz."
              : "Kapatırsanız bugün tekrar açamazsınız"}
              baslik={bakiyeKaynak ? "Duraklat" : "Modu Kapat"}
              onKapat={kapat}
            />
          </section>
        ) : null}
        {!yukleniyor && !acik ? (
          <section className="space-y-3 rounded-card border border-line bg-surface p-4 lg:hidden">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Müsaitlik</p>
              <button type="button" className="text-[13px] text-navy" onClick={() => setBilgi(true)}>Mod nedir</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => baslat("adliye")} disabled={!hazir || adliyeBitti} className="rounded-control border border-line px-3 py-4 text-left disabled:opacity-40">
                <span className="block font-semibold">Adliyede</span>
                <span className="mt-1 block text-[13px] text-muted">{adliyeEtiket == null ? <Skeleton className="h-3 w-24" /> : adliyeEtiket}</span>
              </button>
              <button type="button" onClick={() => baslat("gece")} disabled={!hazir || geceBitti} className="rounded-control border border-line px-3 py-4 text-left disabled:opacity-40">
                <span className="block font-semibold">Gece Nöbeti</span>
                <span className="mt-1 block text-[13px] text-muted">{geceEtiket == null ? <Skeleton className="h-3 w-24" /> : geceEtiket}</span>
                {geceAralik ? <span className="mt-1 block text-[12px] text-muted">{geceAralik} arası</span> : <Skeleton className="mt-1 h-3 w-28" />}
              </button>
            </div>
            {bakiyeSatiri(durum) ? <p className="text-[13px] text-muted">{bakiyeSatiri(durum)}</p> : null}
          </section>
        ) : null}

        {!yukleniyor ? (
          <div className={`hidden gap-4 lg:grid ${gomulu ? "lg:grid-cols-1" : "lg:grid-cols-2"}`}>
            <ModKartiMasa
              baslik="Adliye modu"
              metin="Adliyedeyken adınız ve telefonunuz, seçtiğiniz adliyede Müsait listesinde görünür."
              acik={acik && durum?.tip !== "gece"}
              kalan={acik && durum?.tip !== "gece" ? dk : 0}
              toplam={ayar?.adliye}
              etiket={adliyeEtiket}
              pasif={!hazir || adliyeBitti}
              onAc={() => baslat("adliye")}
              onKapat={kapat}
              kapatBaslik={bakiyeKaynak && durum?.tip !== "gece" ? "Duraklat" : "Kapat"}
            />
            <ModKartiMasa
              baslik="Gece modu"
              metin={geceAralik ? `Gece işleri için müsaitliğiniz. ${geceAralik} arasında açılabilir.` : "Gece işleri için müsaitliğiniz."}
              acik={acik && durum?.tip === "gece"}
              kalan={acik && durum?.tip === "gece" ? dk : 0}
              toplam={ayar?.gece}
              etiket={geceEtiket}
              pasif={!hazir || geceBitti}
              onAc={() => baslat("gece")}
              onKapat={kapat}
              kapatBaslik={bakiyeKaynak && durum?.tip === "gece" ? "Duraklat" : "Kapat"}
            />
            <Link href="/app/avukat-ara" className="col-span-2 text-[13px] font-medium text-navy">Müsait meslektaşlar</Link>
            {bakiyeSatiri(durum) ? <p className="col-span-2 text-[13px] text-muted">{bakiyeSatiri(durum)}</p> : null}
          </div>
        ) : null}

        {bekleyen && adliyeler.length > 1 && !onay ? (
          <section className="space-y-2 rounded-card border border-line bg-surface p-4">
            <p className="font-semibold">Hangi adliyede müsaitsiniz?</p>
            {adliyeler.map((slug) => {
              const kayit = katalog.find((s) => s.kod === slug);
              return (
                <Button key={slug} type="button" variant="secondary" className="w-full" onClick={() => { setSecilen(slug); setOnay(true); }}>
                  {kayit?.ad || adliyeAdi(slug)}{kayit?.teyit_bekliyor ? " (teyit bekleniyor)" : ""}
                </Button>
              );
            })}
          </section>
        ) : null}

        {bilgi ? (
          <div role="dialog" className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 md:items-center" onMouseDown={(e) => { if (e.target === e.currentTarget) setBilgi(false); }}>
            <div className="max-h-[90dvh] w-full max-w-md space-y-3 overflow-y-auto rounded-card bg-surface p-6" style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
              <h2 className="text-[17px] font-semibold">Müsaitlik modu</h2>
              <p className="text-[14px] leading-relaxed">{bilgiMetin}</p>
              <Button type="button" variant="secondary" className="w-full" onClick={() => setBilgi(false)}>Kapat</Button>
            </div>
          </div>
        ) : null}

        {onay ? (
          <div role="dialog" className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 md:items-center">
            <div className="max-h-[90dvh] w-full max-w-md space-y-3 overflow-y-auto rounded-card bg-surface p-6 shadow-float" style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
              <h2 className="text-[17px] font-semibold">{bekleyen === "gece" ? "Gece modunu aç" : "Adliye modunu aç"}</h2>
              <p className="text-[14px] leading-relaxed">
                {gunlukVar
                  ? `${adliyeAdi(secilen)} için ${bekleyen === "gece" ? "gece" : "adliye"} modunu açıyorsunuz. Adınız ve telefonunuz ${sure} dakika boyunca Müsait listesinde bu adliyede görünecek. Bu hakkı bugün bir kez kullanabilirsiniz.`
                  : "Mod bakiyenizden açılacak. Dilediğiniz zaman duraklatabilirsiniz; kullanmadığınız süre bakiyenize iade edilir."}
              </p>
              <Button type="button" className="w-full" disabled={islem} onClick={onayla}>{islem ? "Onaylanıyor…" : "Onayla"}</Button>
              <Button type="button" variant="secondary" className="w-full" disabled={islem} onClick={() => { setOnay(false); setBekleyen(null); }}>Vazgeç</Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ModSatiri({ ikon: Ikon, baslik, aciklama, acik, ozet, etiket, pasif, onAc, onKapat, kapatBaslik }) {
  const [sor, setSor] = useState(false);
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Ikon size={18} aria-hidden="true" className="shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{baslik}</p>
        <p className="text-xs text-muted-foreground">
          {acik ? ozet : (
            <>
              {aciklama}
              {etiket == null ? <Skeleton className="ml-1 inline-block h-3 w-24 align-middle" /> : etiket ? <span> · {etiket}</span> : null}
            </>
          )}
        </p>
      </div>
      <Switch
        checked={acik}
        disabled={!acik && pasif}
        onCheckedChange={(sonraki) => { if (sonraki) onAc(); else setSor(true); }}
        aria-label={acik ? `${baslik} kapat` : `${baslik} aç`}
      />
      <Dialog open={sor} onOpenChange={setSor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{kapatBaslik}</DialogTitle>
            <DialogDescription>
              {kapatBaslik === "Duraklat"
                ? "Mod duraklatılacak, kalan süreniz bakiyenize iade edilecek. İstediğiniz zaman tekrar açabilirsiniz."
                : "Kapatırsanız bugün tekrar açamazsınız"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setSor(false)}>Vazgeç</Button>
            <Button type="button" onClick={() => { setSor(false); onKapat(); }}>{kapatBaslik}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ModKartiMasa({ ikon: Ikon, baslik, metin, acik, kalan, toplam, etiket, pasif, onAc, onKapat, kapatBaslik }) {
  const [sor, setSor] = useState(false);
  const oran = acik && toplam ? Math.max(4, Math.min(100, (kalan / toplam) * 100)) : 0;
  return (
    <Card className={acik ? "ring-accent-gold" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {Ikon ? <Ikon size={18} weight="regular" /> : null}
            <CardTitle>{baslik}</CardTitle>
          </div>
          <Switch
            checked={acik}
            disabled={!acik && pasif}
            onCheckedChange={(sonraki) => { if (sonraki) onAc(); else setSor(true); }}
            aria-label={acik ? `${baslik} kapat` : `${baslik} aç`}
          />
        </div>
        <Badge variant="secondary" className={acik ? "border-transparent bg-accent-gold text-white" : ""}>{acik ? "Açık" : "Kapalı"}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-[13px] leading-relaxed text-muted-foreground">{metin}</p>
        {acik ? (
          <div className="space-y-1">
            <Progress value={oran} className="[&_[data-slot=progress-indicator]]:bg-accent-gold" />
            <p className="text-[13px]">{sureYaz(kalan)} kaldı</p>
          </div>
        ) : (
          <p className="text-[13px] text-muted-foreground">{etiket == null ? <Skeleton className="h-3 w-28" /> : etiket}</p>
        )}
      </CardContent>
      <Dialog open={sor} onOpenChange={setSor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{kapatBaslik}</DialogTitle>
            <DialogDescription>
              {kapatBaslik === "Duraklat"
                ? "Mod duraklatılacak, kalan süreniz bakiyenize iade edilecek. İstediğiniz zaman tekrar açabilirsiniz."
                : "Kapatırsanız bugün tekrar açamazsınız"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setSor(false)}>Vazgeç</Button>
            <Button type="button" onClick={() => { setSor(false); onKapat(); }}>{kapatBaslik}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function Kapat({ baslik, onayMetin, onKapat }) {
  const [acik, setAcik] = useState(false);
  return (
    <>
      <Button type="button" variant="secondary" className="w-full" onClick={() => setAcik(true)}>{baslik}</Button>
      {acik ? (
        <div role="dialog" className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 md:items-center">
          <div className="max-h-[90dvh] w-full max-w-md space-y-3 overflow-y-auto rounded-card bg-surface p-6" style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
            <h2 className="text-[17px] font-semibold">{baslik}</h2>
            <p className="text-[14px] leading-relaxed">{onayMetin}</p>
            <Button type="button" className="w-full" onClick={() => { setAcik(false); onKapat(); }}>{baslik === "Duraklat" ? "Duraklat" : "Kapat"}</Button>
            <Button type="button" variant="secondary" className="w-full" onClick={() => setAcik(false)}>Vazgeç</Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
