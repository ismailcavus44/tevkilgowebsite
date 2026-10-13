"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bell as BellPhosphor, BellSimple } from "@phosphor-icons/react";
import { Bell, CheckCircle, ChevronRight, Clock, Megaphone, UserPlus, Zap } from "lucide-react";
import { cn } from "cn";
import { KartBos, ListCard, ListeSayfa, PageHeader, Toolbar } from "@/components/list-layout";
import { Button } from "@/components/ui/button";
import { hataMesaji } from "@/lib/hata-mesaji";
import { createClient } from "@/lib/supabase/client";
import { gunEkle, saatYazi, tarihAraligi, ymdIstanbul } from "@/lib/tarih";
import { Iskelet, KaydirSonu } from "@/components/uygulama/ortak";
import { modBildirimiMi, useOzellikler } from "@/components/uygulama/Ozellikler";

function bildirimYolu(satir, rol) {
  if (satir.tip === "degerlendirme_bekliyor" && satir.task_id) return `/app/gorevlerim/${satir.task_id}`;
  if (satir.tip === "destek_cevap") return "/app/destek";
  if (!satir.task_id) return null;
  if (rol === "olusturan") return `/app/gorevlerim/${satir.task_id}`;
  if (rol === "basvuran") return `/app/basvurularim/${satir.task_id}`;
  return `/app/ilanlar/${satir.task_id}`;
}

const Ctx = createContext(null);
const BOYUT = 30;
const SIRA = ["BUGÜN", "DÜN", "BU HAFTA", "DAHA ESKİ"];
const IKON = {
  suresi_doldu: Clock,
  secildin: CheckCircle,
  yeni_basvuru: UserPlus,
  basvurular_hazir: UserPlus,
  sicil_guncelleme: Megaphone,
  destek_cevap: Megaphone,
};

function bildirimIkonu(tip) {
  if (IKON[tip]) return IKON[tip];
  if (tip && (tip.includes("mod") || tip.includes("bakiye"))) return Zap;
  if (tip && (tip.includes("admin") || tip.includes("sistem") || tip.includes("duyuru"))) return Megaphone;
  return Bell;
}

function goreliZaman(iso, simdi) {
  if (!iso || !simdi) return "";
  const tarih = new Date(iso);
  const farkDk = Math.floor((simdi - tarih.getTime()) / 60000);
  const gun = ymdIstanbul(tarih);
  const bugun = ymdIstanbul(new Date(simdi));
  if (gun === bugun) {
    if (farkDk < 1) return "az önce";
    if (farkDk < 60) return `${farkDk} dk önce`;
    return `${Math.floor(farkDk / 60)} sa önce`;
  }
  if (gun === gunEkle(bugun, -1)) return `dün ${saatYazi(iso, true)}`;
  const parca = saatYazi(iso).split(" ");
  return parca.length > 1 ? `${parca.slice(0, -1).join(" ")}` : saatYazi(iso);
}

function hedefVar(satir) {
  return Boolean(satir.task_id) || satir.tip === "destek_cevap";
}

export function BildirimSatiri({ satir, simdi, onClick }) {
  const Ikon = bildirimIkonu(satir.tip);
  return (
    <button type="button" onClick={onClick} className={cn("flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left hover:bg-muted/40", !satir.okundu && "bg-primary/5")}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Ikon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start gap-2">
          {!satir.okundu ? <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" /> : null}
          <span className="min-w-0 flex-1 text-sm font-medium">{satir.baslik}</span>
          <span className="shrink-0 text-xs text-muted-foreground">{goreliZaman(satir.created_at, simdi)}</span>
        </span>
        {satir.govde ? <span className="mt-0.5 line-clamp-2 block text-sm text-muted-foreground">{satir.govde}</span> : null}
      </span>
      {hedefVar(satir) ? <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground" /> : null}
    </button>
  );
}

export function BildirimSaglayici({ children }) {
  const [okunmamis, setOkunmamis] = useState(0);
  const [satir, setSatir] = useState(null);
  const [okunduNesil, setOkunduNesil] = useState(0);

  const tumunuOkundu = useCallback(async () => {
    const { error } = await createClient().from("bildirimler").update({ okundu: true }).eq("okundu", false);
    if (error) throw error;
    setOkunmamis(0);
    setOkunduNesil((n) => n + 1);
  }, []);

  const yenileSayi = useCallback(async () => {
    const { count, error } = await createClient()
      .from("bildirimler")
      .select("id", { count: "exact", head: true })
      .eq("okundu", false);
    if (!error) setOkunmamis(count || 0);
  }, []);

  useEffect(() => {
    let iptal = false;
    let kapat = () => {};
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || iptal) return;
      await yenileSayi();
      const kanal = supabase
        .channel(`bildirimler-${user.id}`)
        .on("postgres_changes", {
          event: "INSERT",
          schema: "public",
          table: "bildirimler",
          filter: `kullanici_id=eq.${user.id}`,
        }, (payload) => {
          if (payload.new) {
            setSatir(payload.new);
            yenileSayi();
          }
        })
        .subscribe();
      kapat = () => supabase.removeChannel(kanal);
    })();
    return () => {
      iptal = true;
      kapat();
    };
  }, [yenileSayi]);

  return <Ctx.Provider value={{ okunmamis, setOkunmamis, satir, yenileSayi, tumunuOkundu, okunduNesil }}>{children}</Ctx.Provider>;
}

export function useBildirim() {
  return useContext(Ctx);
}

export function BildirimKutusu({ acik, onKapat }) {
  const baglam = useBildirim();
  const { modlarAktif } = useOzellikler();
  const router = useRouter();
  const sayi = baglam?.okunmamis || 0;
  const [satirlar, setSatirlar] = useState(null);
  const [simdi, setSimdi] = useState(0);
  const [islem, setIslem] = useState(false);

  useEffect(() => {
    if (!acik) return undefined;
    let iptal = false;
    createClient()
      .from("bildirimler")
      .select("id, tip, baslik, govde, task_id, okundu, created_at")
      .order("created_at", { ascending: false })
      .range(0, 7)
      .then(({ data, error }) => {
        if (iptal || error) return;
        const gelen = data || [];
        setSatirlar(modlarAktif ? gelen : gelen.filter((satir) => !modBildirimiMi(satir.tip)));
        setSimdi(Date.now());
      });
    return () => { iptal = true; };
  }, [acik, sayi, baglam?.okunduNesil, modlarAktif]);

  async function git(satir) {
    onKapat?.();
    if (!satir.okundu) {
      await createClient().from("bildirimler").update({ okundu: true }).eq("id", satir.id);
      baglam?.yenileSayi();
    }
    if (satir.tip === "degerlendirme_bekliyor" && satir.task_id) {
      router.push(`/app/gorevlerim/${satir.task_id}`);
      return;
    }
    const rolSorgu = satir.task_id ? await createClient().from("gorevlerim").select("rol").eq("id", satir.task_id) : null;
    const yol = bildirimYolu(satir, rolSorgu?.data?.[0]?.rol);
    if (yol) router.push(yol);
  }

  async function tumunu() {
    if (islem || !baglam?.tumunuOkundu) return;
    setIslem(true);
    try {
      await baglam.tumunuOkundu();
      setSatirlar((onceki) => (onceki || []).map((satir) => ({ ...satir, okundu: true })));
      toast.success("Tüm bildirimler okundu");
    } catch (error) {
      toast.error(hataMesaji(error));
    } finally {
      setIslem(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm font-medium">Bildirimler</p>
        <button type="button" className="text-xs text-muted-foreground disabled:opacity-40" disabled={!sayi || islem} onClick={tumunu}>Tümünü okundu işaretle</button>
      </div>
      <ul className="max-h-96 overflow-y-auto">
        {!satirlar ? <li className="px-4 py-6 text-sm text-muted-foreground">Yükleniyor</li> : null}
        {satirlar && !satirlar.length ? <li className="px-4 py-6 text-sm text-muted-foreground">Bildirimin yok</li> : null}
        {(satirlar || []).map((satir) => (
          <li key={satir.id} className="border-b border-border last:border-b-0">
            <BildirimSatiri satir={satir} simdi={simdi} onClick={() => git(satir)} />
          </li>
        ))}
      </ul>
      <div className="border-t">
        <Link href="/app/bildirimler" onClick={() => onKapat?.()} className="block px-4 py-2.5 text-center text-sm font-medium text-primary hover:bg-muted/40">Tümünü gör</Link>
      </div>
    </>
  );
}

export function BildirimPaneli() {
  const baglam = useBildirim();
  const sayi = baglam?.okunmamis || 0;

  return (
    <Link href="/app/bildirimler" aria-label={sayi ? `Bildirimler, ${sayi} okunmamış` : "Bildirimler"} className="relative inline-flex size-11 items-center justify-center rounded-md">
      <BellPhosphor size={20} weight="regular" />
      {sayi > 0 ? <span className="absolute top-1 right-1 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] font-semibold leading-4 text-primary-foreground">{sayi > 99 ? "99+" : sayi}</span> : null}
    </Link>
  );
}

export function BildirimZili() {
  const baglam = useBildirim();
  const sayi = baglam?.okunmamis || 0;
  return (
    <Link href="/app/bildirimler" aria-label={sayi ? `Bildirimler, ${sayi} okunmamış` : "Bildirimler"} className="relative inline-flex h-11 w-11 items-center justify-center rounded-control text-ink">
      <BellPhosphor size={22} />
      {sayi > 0 ? (
        <span className="absolute right-1 top-1 min-w-4 rounded-full bg-danger px-1 text-center text-[10px] font-semibold leading-4 text-white">
          {sayi > 99 ? "99+" : sayi}
        </span>
      ) : null}
    </Link>
  );
}

function bolumAdi(iso) {
  const ymd = ymdIstanbul(new Date(iso));
  const bugun = ymdIstanbul();
  if (ymd === bugun) return "BUGÜN";
  if (ymd === gunEkle(bugun, -1)) return "DÜN";
  const hafta = tarihAraligi("hafta");
  const an = new Date(iso).getTime();
  if (an >= new Date(hafta.gte).getTime() && an < new Date(hafta.lt).getTime()) return "BU HAFTA";
  return "DAHA ESKİ";
}

export function BildirimListesi() {
  const router = useRouter();
  const baglam = useBildirim();
  const [sekme, setSekme] = useState("tumu");
  const [liste, setListe] = useState(null);
  const [dahaVar, setDahaVar] = useState(false);
  const [hata, setHata] = useState("");
  const [simdi, setSimdi] = useState(0);
  const sayfa = useRef(0);
  const kilit = useRef(false);

  const sayfaGetir = useCallback(async (aktif, from) => {
    let sorgu = createClient()
      .from("bildirimler")
      .select("id, tip, baslik, govde, task_id, okundu, created_at")
      .order("created_at", { ascending: false });
    if (aktif === "okunmamis") sorgu = sorgu.eq("okundu", false);
    const { data, error } = await sorgu.range(from, from + BOYUT - 1);
    if (error) throw error;
    return data || [];
  }, []);

  useEffect(() => {
    let iptal = false;
    sayfa.current = 0;
    sayfaGetir(sekme, 0)
      .then((satirlar) => {
        if (iptal) return;
        sayfa.current = satirlar.length;
        setDahaVar(satirlar.length === BOYUT);
        setListe(satirlar);
        setSimdi(Date.now());
      })
      .catch((error) => { if (!iptal) setHata(hataMesaji(error)); });
    return () => { iptal = true; };
  }, [sekme, sayfaGetir, baglam?.okunduNesil]);

  function devam() {
    if (kilit.current || !dahaVar) return;
    kilit.current = true;
    sayfaGetir(sekme, sayfa.current)
      .then((satirlar) => {
        sayfa.current += satirlar.length;
        setDahaVar(satirlar.length === BOYUT);
        setListe((onceki) => [...(onceki || []), ...satirlar]);
      })
      .catch((error) => setHata(hataMesaji(error)))
      .finally(() => { kilit.current = false; });
  }

  const { modlarAktif } = useOzellikler();
  const gelen = baglam?.satir;
  const gorunen = useMemo(() => {
    if (!liste) return null;
    const taban = !gelen || (sekme === "okunmamis" && gelen.okundu) || liste.some((item) => item.id === gelen.id) ? liste : [gelen, ...liste];
    return modlarAktif ? taban : taban.filter((satir) => !modBildirimiMi(satir.tip));
  }, [liste, gelen, sekme, modlarAktif]);

  const bolumler = useMemo(() => {
    const gruplar = {};
    (gorunen || []).forEach((satir) => {
      const ad = bolumAdi(satir.created_at);
      if (!gruplar[ad]) gruplar[ad] = [];
      gruplar[ad].push(satir);
    });
    return SIRA.filter((ad) => gruplar[ad]?.length).map((ad) => ({ baslik: ad, data: gruplar[ad] }));
  }, [gorunen]);

  async function ac(satir) {
    try {
      if (!satir.okundu) {
        const { error } = await createClient().from("bildirimler").update({ okundu: true }).eq("id", satir.id);
        if (error) throw error;
        setListe((onceki) => (
          sekme === "okunmamis"
            ? (onceki || []).filter((item) => item.id !== satir.id)
            : (onceki || []).map((item) => (item.id === satir.id ? { ...item, okundu: true } : item))
        ));
        baglam?.yenileSayi();
      }
    } catch (error) {
      setHata(hataMesaji(error));
      return;
    }
    if (satir.tip === "degerlendirme_bekliyor" && satir.task_id) {
      router.push(`/app/gorevlerim/${satir.task_id}`);
      return;
    }
    const rolSorgu = satir.task_id ? await createClient().from("gorevlerim").select("rol").eq("id", satir.task_id) : null;
    const yol = bildirimYolu(satir, rolSorgu?.data?.[0]?.rol);
    if (yol) router.push(yol);
  }

  async function tumunu() {
    try {
      await baglam?.tumunuOkundu();
      setListe((onceki) => (sekme === "okunmamis" ? [] : (onceki || []).map((satir) => ({ ...satir, okundu: true }))));
      toast.success("Tüm bildirimler okundu");
    } catch (error) {
      setHata(hataMesaji(error));
    }
  }

  const okunmamis = baglam?.okunmamis || 0;

  return (
    <ListeSayfa kaydir>
      <PageHeader baslik="Bildirimler" />
      <Toolbar
        sekmeler={[
          { value: "tumu", label: "Tümü", adet: 0 },
          { value: "okunmamis", label: "Okunmamış", adet: okunmamis },
        ]}
        sekme={sekme}
        onSekme={setSekme}
      >
        <Button variant="ghost" className="h-9" disabled={!okunmamis} onClick={tumunu}>Tümünü okundu işaretle</Button>
      </Toolbar>
      {hata ? <p role="alert" className="mb-4 text-sm text-destructive">{hata}</p> : null}
      <ListCard>
        {!gorunen && !hata ? <div className="p-4"><Iskelet /></div> : null}
        {gorunen && !gorunen.length && sekme === "tumu" ? (
          <KartBos ikon={BellSimple} baslik="Bildirimin yok" aciklama="Başvurular, seçimler ve görev hatırlatmaları burada görünecek." />
        ) : null}
        {gorunen && !gorunen.length && sekme === "okunmamis" ? (
          <KartBos ikon={BellSimple} baslik="Okunmamış bildirimin yok">
            <button type="button" className="text-sm font-medium text-primary" onClick={() => setSekme("tumu")}>Tümünü göster</button>
          </KartBos>
        ) : null}
        {bolumler.map((bolum) => (
          <section key={bolum.baslik}>
            <h2 className="border-t bg-muted/40 px-4 py-2 text-xs uppercase text-muted-foreground first:border-t-0">{bolum.baslik}</h2>
            <ul className="divide-y">
              {bolum.data.map((satir) => (
                <li key={satir.id}>
                  <BildirimSatiri satir={satir} simdi={simdi} onClick={() => ac(satir)} />
                </li>
              ))}
            </ul>
          </section>
        ))}
        <KaydirSonu aktif={Boolean(gorunen?.length) && dahaVar} onGor={devam} />
      </ListCard>
    </ListeSayfa>
  );
}

export function BildirimDetay({ id }) {
  const [satir, setSatir] = useState(null);
  const [hata, setHata] = useState("");
  useEffect(() => {
    let iptal = false;
    createClient()
      .from("bildirimler")
      .select("id, baslik, govde, okundu")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (iptal) return;
        if (error) setHata(hataMesaji(error));
        else setSatir(data);
      });
    return () => { iptal = true; };
  }, [id]);
  return (
    <div className="pointer-events-auto h-full overflow-y-auto bg-canvas px-5 py-8 md:px-8">
      {!satir && !hata ? <Iskelet satir={2} /> : null}
      {hata ? <p className="text-danger">{hata}</p> : null}
      {satir ? (
        <>
          <h1 className="text-[20px] font-semibold">{satir.baslik}</h1>
          <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed">{satir.govde}</p>
          <Link href="/app/bildirimler" className="mt-6 inline-block text-[14px] text-navy md:hidden">Geri</Link>
        </>
      ) : null}
    </div>
  );
}
