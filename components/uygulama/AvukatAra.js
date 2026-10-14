"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Gavel, MapPin, MoonStars, Phone, UsersThree, WhatsappLogo } from "@phosphor-icons/react";
import { hataMesaji } from "@/lib/hata-mesaji";
import { useOzellikler } from "@/components/uygulama/Ozellikler";
import { createClient } from "@/lib/supabase/client";
import { AracSelect, BosListe, ListCard, ListeSayfa, PageHeader, Toolbar } from "@/components/list-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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

function kalanMetin(dk) {
  if (dk < 60) return `${dk} dk kaldı`;
  const saat = Math.floor(dk / 60);
  const kalan = dk % 60;
  return kalan ? `${saat} sa ${kalan} dk kaldı` : `${saat} sa kaldı`;
}

function basHarfler(ad) {
  return String(ad || "?").trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toLocaleUpperCase("tr")).join("");
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
    setListe(null);
    setHata("");
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
    })().catch((error) => { if (!iptal) { setHata(hataMesaji(error)); setListe([]); } });
    return () => { iptal = true; };
  }, [yukle]);

  useEffect(() => {
    const zaman = setInterval(() => setSimdi((n) => n + 1), 30000);
    return () => clearInterval(zaman);
  }, []);

  const ilSec = (deger) => {
    setIl(deger);
    setAdliye("");
    yukle(deger || null, null).catch((error) => { setHata(hataMesaji(error)); setListe([]); });
  };

  const adliyeSec = (deger) => {
    setAdliye(deger);
    yukle(il || null, deger || null).catch((error) => { setHata(hataMesaji(error)); setListe([]); });
  };

  const aktifler = (liste || []).filter((kisi) => kalanDakika(kisi.bitis) > 0);
  const gorunen = aktifler.filter((kisi) => segment === "tumu" || kisi.tip === segment);
  const adliyeAd = (kod) => adliyeler.find((s) => s.kod === kod)?.ad || kod;
  const ilAd = iller.find((s) => s.slug === il)?.name;

  const ilSecenekleri = useMemo(() => iller.map((s) => ({ value: s.slug, label: s.name })), [iller]);
  const adliyeSecenekleri = useMemo(
    () => adliyeler.filter((s) => !il || s.il_kod === il).map((s) => ({ value: s.kod, label: s.ad })),
    [adliyeler, il],
  );

  const sekmeler = [
    { value: "tumu", label: "Tümü", adet: aktifler.length },
    { value: "adliye", label: "Adliyede", adet: aktifler.filter((k) => k.tip === "adliye").length },
    { value: "gece", label: "Gece nöbeti", adet: aktifler.filter((k) => k.tip === "gece").length },
  ];

  if (hazir && !modlarAktif) return null;

  return (
    <ListeSayfa>
      <PageHeader
        baslik="Müsait Meslektaşlar"
        aciklama={ilAd ? `${ilAd} genelinde şu an modu açık avukatlar` : "Şu an modu açık avukatlar"}
      />
      <Toolbar sekmeler={sekmeler} sekme={segment} onSekme={setSegment}>
        <AracSelect genislik="w-full md:w-44" value={il || "tumu"} placeholder="Tüm iller" secenekler={ilSecenekleri} onValueChange={(deger) => ilSec(!deger || deger === "tumu" ? "" : deger)} />
        <AracSelect genislik="w-full md:w-56" value={adliye || "tumu"} placeholder="Tüm adliyeler" secenekler={adliyeSecenekleri} onValueChange={(deger) => adliyeSec(!deger || deger === "tumu" ? "" : deger)} />
      </Toolbar>

      {hata ? <p role="alert" className="mb-4 rounded-lg border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger">{hata}</p> : null}

      {!liste ? (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
          {[0, 1, 2].map((n) => <li key={n} className="h-44 animate-pulse rounded-xl border bg-background" />)}
        </ul>
      ) : null}

      {liste && !gorunen.length && !hata ? (
        <ListCard>
          <BosListe
            ikon={UsersThree}
            baslik="Şu an müsait meslektaş yok"
            aciklama={adliye || il ? "Farklı bir il ya da adliye seçmeyi deneyin." : "Modu açık avukat olduğunda burada listelenir."}
          />
        </ListCard>
      ) : null}

      {liste && gorunen.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {gorunen.map((kisi) => <MeslektasKarti key={kisi.oturum_id} kisi={kisi} ben={kisi.kullanici_id === ben} adliyeAd={adliyeAd(kisi.adliye)} />)}
        </ul>
      ) : null}
    </ListeSayfa>
  );
}

function MeslektasKarti({ kisi, ben, adliyeAd }) {
  const gece = kisi.tip === "gece";
  const dk = kalanDakika(kisi.bitis);
  const TipIkon = gece ? MoonStars : Gavel;
  return (
    <li className="flex flex-col rounded-xl border bg-background p-4 transition-shadow hover:shadow-[0_8px_24px_-12px_rgb(18_38_63/0.18)]">
      <div className="flex items-start gap-3">
        <Avatar className="size-11 shrink-0">
          {kisi.fotograf_url ? <AvatarImage src={kisi.fotograf_url} alt="" /> : null}
          <AvatarFallback className="bg-navy/10 text-sm font-semibold text-navy">{basHarfler(kisi.ad_soyad)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 font-semibold leading-snug">
            <span className="truncate">{kisi.ad_soyad}</span>
            {ben ? <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Siz</span> : null}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {[kisi.baro, kisi.tbb_sicil ? `Sicil ${kisi.tbb_sicil}` : null].filter(Boolean).join(" · ") || "Avukat"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5 text-sm">
        <span className="flex items-center gap-2 text-foreground">
          <MapPin size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="truncate">{adliyeAd}</span>
        </span>
        <span className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${gece ? "bg-navy text-white" : "bg-success-soft text-success"}`}>
            <TipIkon size={13} weight="fill" aria-hidden="true" />
            {gece ? "Gece nöbeti" : "Adliyede"}
          </span>
          <span className={`inline-flex items-center gap-1 text-xs ${dk <= 15 ? "font-medium text-warning" : "text-muted-foreground"}`}>
            <Clock size={13} aria-hidden="true" />
            {kalanMetin(dk)}
          </span>
        </span>
      </div>

      {ben || !kisi.telefon ? null : (
        <div className="mt-4 grid grid-cols-2 gap-2 border-t pt-4">
          <Button variant="outline" className="h-10" nativeButton={false} render={<a href={`tel:${kisi.telefon}`} />}>
            <Phone size={16} />
            Ara
          </Button>
          <Button className="h-10 bg-[#1f8f4e] text-white hover:bg-[#1a7a43]" nativeButton={false} render={<a href={`https://wa.me/${whatsappNumara(kisi.telefon)}`} target="_blank" rel="noopener noreferrer" />}>
            <WhatsappLogo size={16} weight="fill" />
            WhatsApp
          </Button>
        </div>
      )}
    </li>
  );
}
