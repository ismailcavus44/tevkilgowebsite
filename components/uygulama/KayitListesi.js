"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ClipboardText, PaperPlaneTilt, Tray } from "@phosphor-icons/react";
import { hataMesaji } from "@/lib/hata-mesaji";
import { createClient } from "@/lib/supabase/client";
import { istanbulParcalari, kisaTarihSaat, ymdIstanbul } from "@/lib/tarih";
import { Iskelet, kategoriAd, useKategoriler } from "@/components/uygulama/ortak";
import { StatusBadge, durumAnahtari } from "@/components/uygulama/StatusBadge";
import { DataTable } from "@/components/DataTable";
import { KartBos, ListCard, ListeAraclari, ListeSayfa, PageHeader, Toolbar } from "@/components/list-layout";
import { Button } from "@/components/ui/button";

export function KayitListesi(props) {
  return (
    <Suspense fallback={<Iskelet />}>
      <KayitIc {...props} />
    </Suspense>
  );
}

function KayitIc({ rol, baslik, taban }) {
  const { secenekler: kategoriSecenekleri } = useKategoriler();
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const [satirlar, setSatirlar] = useState(null);
  const [adlar, setAdlar] = useState({});
  const [hata, setHata] = useState("");
  const [dakika, setDakika] = useState(5);
  const [simdi, setSimdi] = useState(0);
  const [adliye, setAdliye] = useState("");
  const [kategori, setKategori] = useState("");
  const [sira, setSira] = useState("yeni");
  const [sayfa, setSayfa] = useState(0);
  const sekme = params.get("sekme") || "tumu";
  const gun = params.get("gun") || "";
  const [yenileme, setYenileme] = useState(0);

  useEffect(() => {
    const yenile = () => setYenileme((n) => n + 1);
    window.addEventListener("ilanlar-yenile", yenile);
    return () => window.removeEventListener("ilanlar-yenile", yenile);
  }, []);

  useEffect(() => {
    let iptal = false;
    createClient()
      .from("gorevlerim")
      .select("*")
      .eq("rol", rol)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (iptal) return;
        if (error) setHata(error?.message || hataMesaji(error));
        else setSatirlar(data || []);
        setSimdi(Date.now());
      });
    return () => {
      iptal = true;
    };
  }, [rol, yenileme]);

  useEffect(() => {
    let iptal = false;
    createClient()
      .from("adliyeler")
      .select("kod, ad")
      .eq("aktif", true)
      .then(({ data }) => {
        if (iptal || !data) return;
        setAdlar(Object.fromEntries(data.map((satir) => [satir.kod, satir.ad])));
      });
    return () => { iptal = true; };
  }, []);

  useEffect(() => {
    let iptal = false;
    createClient()
      .from("app_ayarlar")
      .select("deger")
      .eq("anahtar", "basvuru_toplama_dakika")
      .maybeSingle()
      .then(({ data }) => {
        if (iptal) return;
        const sayi = Number(data?.deger);
        if (Number.isFinite(sayi) && sayi >= 0) setDakika(sayi);
      });
    return () => { iptal = true; };
  }, []);

  const hazir = (satirlar || []).filter((gorev) => {
    const anahtar = durumAnahtari(gorev, dakika, simdi);
    if (gun === "bugun" && istanbulParcalari(gorev.tarih_saat).tarih !== (simdi ? ymdIstanbul(new Date(simdi)) : "")) return false;
    return sekmeUygun(gorev, anahtar, sekme);
  });
  const sekmeler = rol === "olusturan"
    ? [["tumu", "Tümü"], ["acik", "Açık"], ["secim", "Seçim bekliyor"], ["atandi", "Atandı"], ["tamamlandi", "Tamamlandı"], ["iptal", "İptal"]]
    : [["tumu", "Tümü"], ["bekliyor", "Bekliyor"], ["secildi", "Seçildim"], ["kapali", "Seçilmedim"], ["tamamlandi", "Tamamlandı"]];
  function say(kod) {
    return (satirlar || []).filter((gorev) => sekmeUygun(gorev, durumAnahtari(gorev, dakika, simdi), kod)).length;
  }
  const kolonlar = useMemo(() => {
    const bas = [
      { header: "Tarih ve saat", cell: ({ row }) => <span className="tabular-nums">{kisaTarihSaat(row.original.tarih_saat)}</span> },
      { header: "Adliye", cell: ({ row }) => adlar[row.original.adliye] || row.original.adliye },
      { header: "İş türü", cell: ({ row }) => kategoriAd(row.original.kategori) },
      { header: "Ücret", meta: { className: "text-right tabular-nums" }, cell: ({ row }) => <span className="block text-right tabular-nums">{Number(row.original.ucret).toLocaleString("tr-TR")} TL</span> },
    ];
    const orta = rol === "olusturan"
      ? [{ header: "Başvuru", meta: { className: "text-right tabular-nums" }, cell: ({ row }) => <span className="block text-right tabular-nums">{row.original.basvuru_sayisi || 0}/10</span> }]
      : [{
          header: "İlan sahibi",
          cell: ({ row }) => {
            const ad = row.original.olusturan_ad_soyad || row.original.maskeli_ad;
            const puan = row.original.puan_ortalama;
            if (!ad && puan == null) return "—";
            return `${ad || "—"} · ${puan != null ? Number(puan).toLocaleString("tr-TR", { maximumFractionDigits: 1 }) : "—"}`;
          },
        }];
    return [...bas, ...orta, { header: "Durum", meta: { className: "text-right" }, cell: ({ row }) => <span className="flex justify-end"><StatusBadge durum={durumAnahtari(row.original, dakika, simdi)} /></span> }];
  }, [adlar, dakika, rol, simdi]);

  const liste = useMemo(() => {
    const suzulen = hazir.filter((gorev) => {
      if (adliye && gorev.adliye !== adliye) return false;
      if (kategori && gorev.kategori !== kategori) return false;
      return true;
    });
    const kopya = [...suzulen];
    if (sira === "ucret") kopya.sort((a, b) => Number(b.ucret) - Number(a.ucret));
    else if (sira === "tarih") kopya.sort((a, b) => new Date(a.tarih_saat) - new Date(b.tarih_saat));
    else kopya.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return kopya;
  }, [adliye, hazir, kategori, sira]);
  const sayfaBoyu = 20;
  const sayfaSayisi = Math.max(1, Math.ceil(liste.length / sayfaBoyu));
  const guvenliSayfa = Math.min(sayfa, sayfaSayisi - 1);
  const dilim = liste.slice(guvenliSayfa * sayfaBoyu, (guvenliSayfa + 1) * sayfaBoyu);

  function sekmeGit(deger) {
    const sonraki = new URLSearchParams(params);
    setSayfa(0);
    if (deger === "tumu") sonraki.delete("sekme");
    else sonraki.set("sekme", deger);
    const sorgu = sonraki.toString();
    router.push(sorgu ? `${taban}?${sorgu}` : taban);
  }

  const tumuHref = (() => {
    const sonraki = new URLSearchParams(params);
    sonraki.delete("sekme");
    const sorgu = sonraki.toString();
    return sorgu ? `${taban}?${sorgu}` : taban;
  })();

  const sekmeOgeleri = sekmeler.map(([value, label]) => ({ value, label, adet: satirlar ? say(value) : 0 }));
  const adliyeSecenekleri = [...new Set((satirlar || []).map((gorev) => gorev.adliye).filter(Boolean))].map((kod) => ({ value: kod, label: adlar[kod] || kod }));
  const siralar = [{ value: "yeni", label: "En yeni" }, { value: "tarih", label: "En yakın tarih" }];
  const yukleniyor = !satirlar && !hata;
  const ilkBos = Boolean(satirlar && !satirlar.length);
  const filtreBos = Boolean(satirlar?.length && !liste.length);

  return (
    <ListeSayfa>
      <PageHeader baslik={baslik} />
      <Toolbar sekmeler={sekmeOgeleri} sekme={sekme} onSekme={sekmeGit}>
        <ListeAraclari
          adliye={adliye}
          onAdliye={(deger) => { setSayfa(0); setAdliye(deger); }}
          adliyeler={adliyeSecenekleri}
          kategori={kategori}
          onKategori={(deger) => { setSayfa(0); setKategori(deger); }}
          kategoriler={kategoriSecenekleri}
          sira={sira}
          onSira={(deger) => { setSayfa(0); setSira(deger); }}
          siralar={siralar}
        />
      </Toolbar>
      {hata ? <p role="alert" className="mb-4 text-sm text-destructive">{hata}</p> : null}
      <ListCard>
        <DataTable columns={kolonlar} data={yukleniyor || ilkBos || filtreBos ? [] : dilim} yukleniyor={yukleniyor} secili={(gorev) => pathname === `${taban}/${gorev.id}`} onRow={(gorev) => router.push(`${taban}/${gorev.id}`)} />
        {ilkBos && rol === "olusturan" ? (
          <KartBos ikon={ClipboardText} baslik="Henüz ilan açmadın.">
            <Button size="sm" onClick={() => window.dispatchEvent(new Event("ilan-ac"))}>İlan aç</Button>
          </KartBos>
        ) : null}
        {ilkBos && rol !== "olusturan" ? (
          <KartBos ikon={PaperPlaneTilt} baslik="Henüz başvurun yok.">
            <Button size="sm" nativeButton={false} render={<Link href="/app/ilanlar" />}>İlanlara göz at</Button>
          </KartBos>
        ) : null}
        {filtreBos ? (
          <KartBos ikon={Tray} baslik={rol === "olusturan" ? "Bu durumda görev yok" : "Bu durumda başvurun yok"}>
            <Link href={tumuHref} onClick={() => { setAdliye(""); setKategori(""); setSayfa(0); }} className="text-sm font-medium text-primary">Tümünü göster</Link>
          </KartBos>
        ) : null}
        {!ilkBos && !filtreBos && liste.length > sayfaBoyu ? (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-sm text-muted-foreground">{guvenliSayfa + 1} / {sayfaSayisi}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={guvenliSayfa === 0} onClick={() => setSayfa(guvenliSayfa - 1)}>Önceki</Button>
              <Button size="sm" variant="outline" disabled={guvenliSayfa + 1 >= sayfaSayisi} onClick={() => setSayfa(guvenliSayfa + 1)}>Sonraki</Button>
            </div>
          </div>
        ) : null}
      </ListCard>
    </ListeSayfa>
  );
}

function sekmeUygun(gorev, anahtar, sekme) {
  if (!sekme || sekme === "tumu") return true;
  if (sekme === "acik") return anahtar === "acik" || anahtar === "toplaniyor";
  if (sekme === "bekliyor") return gorev.basvuru_durumu === "bekliyor";
  if (sekme === "secildi") return anahtar === "atandi";
  if (sekme === "kapali") return anahtar === "geri" || anahtar === "reddedildi";
  return anahtar === sekme;
}
