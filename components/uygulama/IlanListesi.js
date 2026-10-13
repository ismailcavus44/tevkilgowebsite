"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Funnel, MapPin, Tray } from "@phosphor-icons/react";
import { acikIlanFiltrele } from "@/lib/acik-ilanlar";
import { hataMesaji } from "@/lib/hata-mesaji";
import { createClient } from "@/lib/supabase/client";
import { istanbulParcalari, kisaTarihSaat, tarihAraligi, tarihSaat, ymdIstanbul } from "@/lib/tarih";
import { kategoriAd, useKategoriler } from "@/components/uygulama/ortak";
import { StatusBadge } from "@/components/uygulama/StatusBadge";
import { DataTable } from "@/components/DataTable";
import { KartBos, ListCard, ListeAraclari, ListeSayfa, PageHeader, Toolbar } from "@/components/list-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SAYFA = 20;
const TARIHLER = [["tumu", "Tümü"], ["bugun", "Bugün"], ["yarin", "Yarın"], ["hafta", "Bu hafta"]];
const SIRALAR = [
  { value: "tarih", label: "En yakın tarih" },
  { value: "ucret", label: "En yüksek ücret" },
  { value: "yeni", label: "En yeni" },
];

export function IlanSatiri({ ilan, adliyeAdi, simdi = 0, onClick }) {
  const parca = istanbulParcalari(ilan.tarih_saat);
  const bugun = simdi ? ymdIstanbul(new Date(simdi)) : "";
  const bugunMu = Boolean(bugun) && parca.tarih === bugun;
  const kalan = new Date(ilan.tarih_saat).getTime() - simdi;
  const acil = simdi > 0 && kalan > 0 && kalan < 2 * 60 * 60 * 1000;
  return (
    <button type="button" onClick={onClick} className="flex h-[52px] w-full items-center gap-3 border-b border-border px-1 text-left text-sm hover:bg-muted/50">
      <span className={acil ? "w-28 shrink-0 font-semibold text-accent-gold" : bugunMu ? "w-28 shrink-0 font-semibold text-foreground" : "w-28 shrink-0 text-foreground"}>{bugunMu ? `Bugün ${parca.saat}` : tarihSaat(ilan.tarih_saat)}</span>
      <span className="min-w-0 flex-1 truncate text-foreground">{adliyeAdi(ilan.adliye)}</span>
      <span className="hidden shrink-0 text-foreground sm:block">{kategoriAd(ilan.kategori)}</span>
      <span className="w-24 shrink-0 text-right text-foreground">{Number(ilan.ucret).toLocaleString("tr-TR")} TL</span>
    </button>
  );
}

export function IlanListesi() {
  const { secenekler: kategoriSecenekleri } = useKategoriler();
  const pathname = usePathname();
  const router = useRouter();
  const [adliyeler, setAdliyeler] = useState(null);
  const [katalog, setKatalog] = useState([]);
  const [ilanlar, setIlanlar] = useState([]);
  const [adliye, setAdliye] = useState("");
  const [coklu, setCoklu] = useState([]);
  const [kategori, setKategori] = useState("");
  const [tarih, setTarih] = useState("tumu");
  const [sira, setSira] = useState("tarih");
  const [gizle, setGizle] = useState(true);
  const [dahaVar, setDahaVar] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [sayfaNo, setSayfaNo] = useState(0);
  const [hata, setHata] = useState("");
  const [rozetler, setRozetler] = useState({});
  const [gizliAdet, setGizliAdet] = useState(0);
  const sayfa = useRef(0);
  const kilit = useRef(false);
  const nesil = useRef(0);
  const filtreli = Boolean(adliye || coklu.length || kategori || tarih !== "tumu" || sira !== "tarih" || !gizle);

  const adliyeAdi = useCallback(
    (kod) => katalog.find((satir) => satir.kod === kod)?.ad || kod || "",
    [katalog],
  );

  const yukle = useCallback(
    async (sifirla) => {
      const ben = ++nesil.current;
      await Promise.resolve();
      setHata("");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      let courts = [];
      if (user) {
        const { data, error } = await supabase.from("users").select("adliyeler").eq("id", user.id).single();
        if (error) throw error;
        courts = data?.adliyeler || [];
      }
      setAdliyeler(courts);
      if (!courts.length) {
        setIlanlar([]);
        setDahaVar(false);
        setRozetler({});
        setGizliAdet(0);
        return;
      }
      const adliyeFiltre = coklu.length ? coklu : (adliye ? [adliye] : []);
      const aralik = tarihAraligi(tarih);
      const filtre = { adliyeFiltre, kategori, aralik, basvurdum: gizle ? false : undefined };
      let sorgu = acikIlanFiltrele(supabase.from("acik_gorevler").select("*"), filtre);
      if (sira === "ucret") sorgu = sorgu.order("ucret", { ascending: false });
      else if (sira === "yeni") sorgu = sorgu.order("created_at", { ascending: false });
      else sorgu = sorgu.order("tarih_saat", { ascending: true });
      const from = sifirla ? 0 : sayfa.current;
      const { data, error } = await sorgu.range(from, from + SAYFA - 1);
      if (error) throw error;
      const gelen = data || [];
      sayfa.current = from + gelen.length;
      setIlanlar((onceki) => (sifirla ? gelen : [...onceki, ...gelen]));
      setDahaVar(gelen.length === SAYFA);
      const adetler = await Promise.all(TARIHLER.map(async ([kod]) => {
        const { count, error: sayimHatasi } = await acikIlanFiltrele(
          supabase.from("acik_gorevler").select("id", { count: "exact", head: true }),
          { adliyeFiltre, kategori, aralik: tarihAraligi(kod), basvurdum: gizle ? false : undefined },
        );
        if (sayimHatasi) throw sayimHatasi;
        return count || 0;
      }));
      if (nesil.current !== ben) return;
      setRozetler(Object.fromEntries(TARIHLER.map(([kod], i) => [kod, adetler[i]])));
      if (!gizle) {
        setGizliAdet(0);
      } else {
        const { count: gizli, error: gizliHata } = await acikIlanFiltrele(
          supabase.from("acik_gorevler").select("id", { count: "exact", head: true }),
          { adliyeFiltre, kategori, aralik, basvurdum: true },
        );
        if (gizliHata) throw gizliHata;
        if (nesil.current !== ben) return;
        setGizliAdet(gizli || 0);
      }
    },
    [adliye, coklu, kategori, tarih, sira, gizle],
  );

  useEffect(() => {
    let iptal = false;
    createClient()
      .from("adliyeler")
      .select("kod, ad, il_kod, sira, teyit_bekliyor")
      .eq("aktif", true)
      .order("il_kod", { ascending: true })
      .order("sira", { ascending: true })
      .then(({ data }) => {
        if (!iptal) setKatalog(data || []);
      });
    return () => {
      iptal = true;
    };
  }, []);

  useEffect(() => {
    let iptal = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- ilanlar sunucudan gelir
    yukle(true)
      .catch((error) => { if (!iptal) setHata(hataMesaji(error)); })
      .finally(() => { if (!iptal) setYukleniyor(false); });
    return () => { iptal = true; };
  }, [yukle]);

  useEffect(() => {
    const yenile = () => { yukle(true).catch((error) => setHata(hataMesaji(error))); };
    window.addEventListener("ilanlar-yenile", yenile);
    return () => window.removeEventListener("ilanlar-yenile", yenile);
  }, [yukle]);

  const secenekler = (adliyeler || []).map((slug) => {
    const kayit = katalog.find((satir) => satir.kod === slug);
    return { value: slug, label: kayit?.ad || slug, teyit: Boolean(kayit?.teyit_bekliyor) };
  });

  function temizle() {
    setAdliye("");
    setCoklu([]);
    setKategori("");
    setTarih("tumu");
    setSira("tarih");
    setGizle(true);
  }

  const kolonlar = useMemo(() => [
    { header: "Tarih ve saat", cell: ({ row }) => <span className="tabular-nums">{kisaTarihSaat(row.original.tarih_saat)}</span> },
    { header: "Adliye", cell: ({ row }) => adliyeAdi(row.original.adliye) },
    { header: "İş türü", cell: ({ row }) => kategoriAd(row.original.kategori) },
    {
      header: "Ücret",
      meta: { className: "text-right tabular-nums" },
      cell: ({ row }) => <span className="block text-right tabular-nums">{Number(row.original.ucret).toLocaleString("tr-TR")} TL</span>,
    },
    {
      header: "Başvuru",
      meta: { className: "text-right tabular-nums" },
      cell: ({ row }) => <span className="block text-right tabular-nums">{row.original.basvuru_sayisi || 0}/10</span>,
    },
    {
      header: "Durum",
      meta: { className: "text-right" },
      cell: ({ row }) => (
        <span className="flex justify-end">
          {row.original.basvurdum ? <span className="text-xs text-muted-foreground">Başvuruldu</span> : <StatusBadge durum="acik" />}
        </span>
      ),
    },
  ], [adliyeAdi]);

  const sayfaAdet = Math.max(1, Math.ceil(ilanlar.length / SAYFA));
  const aktifSayfa = Math.min(sayfaNo, sayfaAdet - 1);
  const dilim = ilanlar.slice(aktifSayfa * SAYFA, (aktifSayfa + 1) * SAYFA);
  function sonrakiSayfa() {
    if (aktifSayfa + 1 < sayfaAdet) {
      setSayfaNo(aktifSayfa + 1);
      return;
    }
    if (!dahaVar || kilit.current) return;
    kilit.current = true;
    yukle(false).then(() => setSayfaNo(aktifSayfa + 1)).catch((error) => setHata(hataMesaji(error))).finally(() => { kilit.current = false; });
  }

  const bos = !yukleniyor && !ilanlar.length;
  const sekmeOgeleri = TARIHLER.map(([value, label]) => ({ value, label, adet: rozetler[value] || 0 }));

  return (
    <ListeSayfa>
      <PageHeader baslik="İlanlar" />
      <Toolbar sekmeler={sekmeOgeleri} sekme={tarih} onSekme={(deger) => { setSayfaNo(0); setTarih(deger); }}>
        <ListeAraclari
          adliye={adliye}
          onAdliye={(deger) => { setSayfaNo(0); setCoklu([]); setAdliye(deger); }}
          adliyeler={secenekler}
          kategori={kategori}
          onKategori={(deger) => { setSayfaNo(0); setKategori(deger); }}
          kategoriler={kategoriSecenekleri}
          sira={sira}
          onSira={(deger) => { setSayfaNo(0); setSira(deger); }}
          siralar={SIRALAR}
        />
      </Toolbar>
      {hata ? <p role="alert" className="mb-4 text-sm text-destructive">{hata}</p> : null}
      <div className="mb-3 flex justify-end">
        <div className="flex items-center gap-2">
          <Switch id="gizle-basvuru" size="sm" checked={gizle} onCheckedChange={(deger) => { setSayfaNo(0); setGizle(deger); }} />
          <Label htmlFor="gizle-basvuru" className="cursor-pointer text-xs font-normal text-muted-foreground">Başvurduklarımı gizle</Label>
        </div>
      </div>
      <ListCard>
        <DataTable columns={kolonlar} data={bos ? [] : dilim} yukleniyor={yukleniyor} secili={(ilan) => pathname === `/app/ilanlar/${ilan.id}`} onRow={(ilan) => router.push(`/app/ilanlar/${ilan.id}`)} />
        {bos && adliyeler && !adliyeler.length ? (
          <KartBos ikon={MapPin} baslik="Henüz bölge seçmedin" aciklama="İlanlar, seçtiğin adliyelere göre listelenir. En fazla 3 adliye seçebilirsin.">
            <Button size="sm" nativeButton={false} render={<Link href="/app/profil#bolge" />}>Bölge seç</Button>
          </KartBos>
        ) : null}
        {bos && adliyeler?.length && filtreli ? (
          <KartBos ikon={Funnel} baslik="Bu filtrelere uyan ilan yok">
            <Button size="sm" variant="outline" onClick={() => { setSayfaNo(0); temizle(); }}>Filtreleri temizle</Button>
          </KartBos>
        ) : null}
        {bos && adliyeler?.length && !filtreli && gizliAdet > 0 ? (
          <KartBos ikon={Tray} baslik={`Başvurduğun ${gizliAdet} ilan gizlendi`}>
            <Button size="sm" variant="outline" onClick={() => { setSayfaNo(0); setGizle(false); }}>Göster</Button>
          </KartBos>
        ) : null}
        {bos && adliyeler?.length && !filtreli && !gizliAdet ? (
          <KartBos ikon={Tray} baslik="Bölgende şu an açık ilan yok" aciklama="Yeni ilan açıldığında bildirim alırsın.">
            <Button size="sm" onClick={() => window.dispatchEvent(new Event("ilan-ac"))}>İlan aç</Button>
          </KartBos>
        ) : null}
        {!bos && (ilanlar.length > SAYFA || dahaVar) ? (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-sm text-muted-foreground">{aktifSayfa + 1} / {dahaVar ? `${sayfaAdet}+` : sayfaAdet}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={aktifSayfa === 0} onClick={() => setSayfaNo(aktifSayfa - 1)}>Önceki</Button>
              <Button size="sm" variant="outline" disabled={!dahaVar && aktifSayfa + 1 >= sayfaAdet} onClick={sonrakiSayfa}>Sonraki</Button>
            </div>
          </div>
        ) : null}
      </ListCard>
    </ListeSayfa>
  );
}
