"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { tr } from "react-day-picker/locale";
import { cn } from "cn";
import { FormHatasi } from "@/components/FormHatasi";
import { kategoriAd, kategoriBilgisi, useKategoriler } from "@/components/uygulama/ortak";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dogrulamaKapisi } from "@/lib/dogrulama-kontrol";
import { hataMesaji } from "@/lib/hata-mesaji";
import { oturumKullanicisi } from "@/lib/oturum-kullanici";
import { createClient } from "@/lib/supabase/client";
import { enErkenSaat, istanbulAn, istanbulParcalari, ymdIstanbul } from "@/lib/tarih";

const ALAN = "h-9! w-full rounded-md border border-input bg-white px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";
const TETIK = `${ALAN} flex cursor-pointer items-center justify-between gap-2 py-0 text-left data-placeholder:text-muted-foreground`;

export function IlanFormu({ duzenleId, kaynakId, onBitti, onVazgec, sheet = false, formId, onHazir, onYukleniyor }) {
  const { secenekler: kategoriSecenekleri } = useKategoriler();
  const router = useRouter();
  const [sehirler, setSehirler] = useState([]);
  const [adliyeler, setAdliyeler] = useState([]);
  const [form, setForm] = useState({ sehir: "", adliye: "", kategori: "", tarih: "", saat: "", ucret: "", not: "" });
  const [sehirAd, setSehirAd] = useState("");
  const [minUcret, setMinUcret] = useState(null);
  const [sablonlar, setSablonlar] = useState([]);
  const [hatalar, setHatalar] = useState({});
  const [hata, setHata] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const yukleId = duzenleId || kaynakId;
  const [hazir, setHazir] = useState(!yukleId);
  const [anMs, setAnMs] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    let iptal = false;
    Promise.all([
      createClient().from("cities").select("slug, name").order("name", { ascending: true }),
      createClient().from("adliyeler").select("kod, ad, il_kod, sira, teyit_bekliyor").eq("aktif", true).order("sira", { ascending: true }),
    ]).then(([sehir, adliye]) => {
      if (iptal) return;
      setSehirler(sehir.data || []);
      setAdliyeler(adliye.data || []);
    });
    return () => {
      iptal = true;
    };
  }, []);

  useEffect(() => {
    const yaz = () => setAnMs(Date.now());
    const baslangic = setTimeout(yaz, 0);
    const zaman = setInterval(yaz, 30000);
    return () => {
      clearTimeout(baslangic);
      clearInterval(zaman);
    };
  }, []);

  useEffect(() => {
    if (!yukleId) return undefined;
    let iptal = false;
    createClient()
      .from("gorevlerim")
      .select("*")
      .eq("id", yukleId)
      .eq("rol", "olusturan")
      .maybeSingle()
      .then(({ data, error }) => {
        if (iptal) return;
        if (error) setHata(hataMesaji(error));
        else if (data) {
          // Yeniden yayınlarken eski tarih geçmişte kalır; tarih/saat yeniden seçilir.
          const parca = duzenleId ? istanbulParcalari(data.tarih_saat) : { tarih: "", saat: "" };
          setForm({
            sehir: data.sehir || "",
            adliye: data.adliye || "",
            kategori: data.kategori || "",
            tarih: parca.tarih,
            saat: parca.saat,
            ucret: data.ucret != null ? String(data.ucret) : "",
            not: data.gorev_notu || "",
          });
          setSehirAd(data.il || data.sehir || "");
        }
        setHazir(true);
      });
    return () => {
      iptal = true;
    };
  }, [yukleId, duzenleId]);

  useEffect(() => {
    if (!form.kategori) return undefined;
    let iptal = false;
    const supabase = createClient();
    Promise.all([
      supabase.from("ucret_tarifeleri").select("min_ucret").eq("kategori", form.kategori).eq("aktif", true).maybeSingle(),
      supabase.from("gorev_sablonlari").select("id, baslik, metin, sira").eq("kategori", form.kategori).order("sira", { ascending: true }),
    ]).then(([tarife, sablon]) => {
      if (iptal) return;
      if (sablon.error) setHata(hataMesaji(sablon.error));
      setMinUcret(tarife.data?.min_ucret ?? null);
      setSablonlar(sablon.data || []);
    });
    return () => {
      iptal = true;
    };
  }, [form.kategori]);

  const adliyeSecenek = adliyeler.filter((satir) => satir.il_kod === form.sehir);
  const bugun = anMs ? ymdIstanbul(new Date(anMs)) : "";
  const sinir = anMs && form.tarih === bugun ? enErkenSaat(new Date(anMs)) : null;
  const saatAlti = sinir?.uygun ? sinir.saat : "";

  function alan(ad, deger) {
    setForm((onceki) => ({ ...onceki, [ad]: deger, ...(ad === "sehir" ? { adliye: "" } : {}) }));
    if (ad === "sehir") {
      setSehirAd(sehirler.find((s) => s.slug === deger)?.name || deger);
    }
  }

  const notZorunlu = Boolean(kategoriBilgisi(form.kategori)?.not_zorunlu);

  function dogrula() {
    const yeni = {};
    if (!form.sehir) yeni.sehir = "Şehir seçimi gerekli";
    if (!form.adliye) yeni.adliye = "Adliye seçimi gerekli";
    if (!form.kategori) yeni.kategori = "Kategori seçimi gerekli";
    else if (notZorunlu && !form.not.trim()) yeni.not = "Bu iş türünde yapılacak işi yazmanız gerekiyor";
    const bugunIstanbul = ymdIstanbul();
    if (!form.tarih) yeni.tarih = "Tarih seçimi gerekli";
    else if (form.tarih < bugunIstanbul) yeni.tarih = "Tarih bugünden önce olamaz";
    if (!form.saat) yeni.saat = "Saat seçimi gerekli";
    else if (form.tarih === bugunIstanbul) {
      const sinirSaat = enErkenSaat();
      if (!sinirSaat.uygun || form.saat < sinirSaat.saat) yeni.saat = "Görev saati geçmiş bir zaman olamaz";
    }
    if (!duzenleId) {
      if (!form.ucret.trim()) yeni.ucret = "Ücret gerekli";
      else if (Number.isNaN(Number(form.ucret)) || Number(form.ucret) <= 0) yeni.ucret = "Geçerli bir ücret girin";
      else if (minUcret != null && Number(form.ucret) < Number(minUcret)) yeni.ucret = `Asgari ücret: ${minUcret} ₺`;
    }
    setHatalar(yeni);
    return Object.keys(yeni).length === 0;
  }

  useEffect(() => {
    if (!sheet || !hazir) return;
    onHazir?.(true);
    const form = formRef.current;
    const kaydir = form?.closest("[data-sheet-scroll]");
    if (kaydir) kaydir.scrollTop = 0;
    form?.querySelector("button:not([disabled]), input:not([disabled]), textarea:not([disabled])")?.focus();
  }, [sheet, hazir, onHazir]);

  async function gonder(event) {
    event.preventDefault();
    if (yukleniyor) return;
    setHata("");
    setMesaj("");
    if (!dogrula()) return;
    if (!duzenleId && !(await dogrulamaKapisi())) return;
    setYukleniyor(true);
    onYukleniyor?.(true);
    try {
      const supabase = createClient();
      const user = await oturumKullanicisi(supabase);
      if (!user) throw new Error("Oturumunuz yenilenemedi. Sayfayı yenileyip tekrar deneyin.");
      const kayit = {
        sehir: form.sehir,
        adliye: form.adliye,
        kategori: form.kategori,
        tarih_saat: istanbulAn(form.tarih, form.saat),
        ...(duzenleId ? {} : { ucret: Number(form.ucret) }),
        gorev_notu: form.not.trim() || null,
        il: sehirAd || form.sehir,
      };
      if (duzenleId) {
        const { error } = await supabase.from("tasks").update(kayit).eq("id", duzenleId).eq("olusturucu_id", user.id);
        if (error) throw error;
        setMesaj("Görev güncellendi");
        router.refresh();
        onBitti?.();
      } else {
        const { error } = await supabase.from("tasks").insert({ ...kayit, olusturucu_id: user.id });
        if (error) throw error;
        setMesaj("Görev başarıyla oluşturuldu");
        router.push("/app/gorevlerim");
        router.refresh();
        onBitti?.();
      }
    } catch (error) {
      console.error(error);
      // 42501: tasks_insert_own kuralı reddetti; hesap onaylı değil veya askıda.
      setHata(error?.code === "42501"
        ? "Görev açmak için hesabınızın onaylanmış olması gerekir."
        : hataMesaji(error));
    } finally {
      setYukleniyor(false);
      onYukleniyor?.(false);
    }
  }

  if (!hazir) return <p className="text-sm text-muted-foreground">Yükleniyor...</p>;

  const sehirSecenek = sehirler.map((s) => ({ value: s.slug, label: s.name }));
  const adliyeListe = adliyeSecenek.map((s) => ({ value: s.kod, label: `${s.ad}${s.teyit_bekliyor ? " (teyit bekleniyor)" : ""}` }));

  return (
    <form ref={formRef} id={formId} onSubmit={gonder} className={sheet ? "flex min-h-0 flex-col" : "flex min-h-0 flex-col max-md:flex-1"}>
      <div className={sheet ? "space-y-4 p-6" : "-mx-1 max-h-[70vh] space-y-4 overflow-y-auto px-1 max-md:mx-0 max-md:max-h-none max-md:flex-1 max-md:overscroll-contain max-md:px-5 max-md:py-4"}>
        <FormHatasi>{hata}</FormHatasi>
        <FormHatasi tur="bilgi">{mesaj}</FormHatasi>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Secim etiket="Şehir" placeholder="Şehir seçin" ara="Şehir ara" deger={form.sehir} hata={hatalar.sehir} secenekler={sehirSecenek} onSec={(deger) => alan("sehir", deger)} />
          <Secim etiket="Adliye" placeholder="Adliye seçin" ara="Adliye ara" deger={form.adliye} hata={hatalar.adliye} disabled={!form.sehir} secenekler={adliyeListe} onSec={(deger) => alan("adliye", deger)} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TarihSec deger={form.tarih} hata={hatalar.tarih} bugun={bugun} onSec={(deger) => alan("tarih", deger)} />
          <AlanSelect etiket="Saat" placeholder="Saat" value={form.saat} hata={hatalar.saat} onChange={(deger) => alan("saat", deger)}>
            {saatSecenek(saatAlti, form.saat).map((saat) => <SelectItem key={saat} value={saat}>{saat}</SelectItem>)}
          </AlanSelect>
        </div>
        <AlanSelect etiket="İş türü" placeholder="İş türü seçin" value={form.kategori} hata={hatalar.kategori} etiketle={kategoriAd} onChange={(deger) => alan("kategori", deger)}>
          {kategoriSecenekleri.map((k) => <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>)}
        </AlanSelect>
        <div className="grid gap-1.5">
          <label htmlFor="ilan-ucret" className="text-sm font-medium">Ücret</label>
          <div className="relative">
            <Input id="ilan-ucret" inputMode="decimal" value={form.ucret} placeholder="0" disabled={Boolean(duzenleId)} aria-invalid={hatalar.ucret ? true : undefined} className={cn(ALAN, "pr-8")} onChange={(e) => alan("ucret", e.target.value)} />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">₺</span>
          </div>
          {hatalar.ucret ? <p className="text-xs text-destructive">{hatalar.ucret}</p> : null}
          {duzenleId ? <p className="text-xs text-muted-foreground">Ücret ilan açıldıktan sonra değiştirilemez.</p> : null}
          {!duzenleId && !hatalar.ucret && form.kategori && minUcret != null ? <p className="text-xs text-muted-foreground">Asgari ücret: {minUcret} ₺</p> : null}
        </div>
        {form.kategori && sablonlar.length ? (
          <SablonSec sablonlar={sablonlar} onSec={(metin) => alan("not", form.not?.trim() ? `${form.not.trim()}\n${metin}` : metin)} />
        ) : null}
        <div className="grid gap-1.5">
          <label htmlFor="ilan-not" className="text-sm font-medium">{notZorunlu ? "Yapılacak iş" : "Açıklama"}</label>
          <textarea id="ilan-not" value={form.not} maxLength={2000} placeholder={notZorunlu ? "Örn. Keşfe katılınacaktır." : "Görev ile ilgili detaylar..."} aria-invalid={hatalar.not ? true : undefined} className="min-h-24 w-full resize-none rounded-md border border-input bg-white px-3 py-2 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm" onChange={(e) => alan("not", e.target.value)} />
          {hatalar.not ? <p className="text-xs text-destructive">{hatalar.not}</p> : null}
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs text-muted-foreground">Müvekkil veya taraf adı, T.C. kimlik no, esas no gibi bilgileri yazmayın.</p>
            <span className="shrink-0 text-xs text-muted-foreground">{form.not.length}/2000</span>
          </div>
        </div>
      </div>
      {sheet ? null : <div className="mt-4 flex items-center justify-end gap-2 border-t bg-white pt-4 max-md:mt-0 max-md:grid max-md:shrink-0 max-md:grid-cols-2 max-md:gap-3 max-md:px-5 max-md:pt-3 max-md:pb-[max(0.75rem,env(safe-area-inset-bottom))] max-md:[&_button]:h-11 max-md:[&_button]:w-full max-md:[&_button[type=submit]]:col-start-2">
        {onVazgec ? <Button type="button" variant="outline" className="h-9" onClick={onVazgec}>Vazgeç</Button> : null}
        <Button type="submit" className="h-9" disabled={yukleniyor}>
          {yukleniyor ? "Kaydediliyor…" : duzenleId ? "Güncelle" : "İlanı yayınla"}
        </Button>
      </div>}
    </form>
  );
}

function saatSecenek(alti, secili) {
  const liste = [];
  for (let saat = 0; saat < 24; saat += 1) {
    for (let dakika = 0; dakika < 60; dakika += 15) {
      const yazi = `${String(saat).padStart(2, "0")}:${String(dakika).padStart(2, "0")}`;
      if (!alti || yazi >= alti) liste.push(yazi);
    }
  }
  if (secili && !liste.includes(secili) && (!alti || secili >= alti)) {
    liste.push(secili);
    liste.sort();
  }
  return liste;
}

function gunYmd(gun) {
  return ymdIstanbul(new Date(gun.getFullYear(), gun.getMonth(), gun.getDate(), 12));
}

function tarihEtiket(ymd) {
  if (!ymd) return "";
  const [yil, ay, gun] = ymd.split("-").map(Number);
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(yil, ay - 1, gun));
}

function Secim({ etiket, placeholder, ara, deger, hata, disabled, secenekler, onSec }) {
  const [acik, setAcik] = useState(false);
  const tetik = useRef(null);
  const liste = useRef(null);
  const yazi = secenekler.find((s) => s.value === deger)?.label;

  useEffect(() => {
    if (!acik) return undefined;
    const kare = requestAnimationFrame(() => {
      liste.current?.querySelector("[data-checked='true']")?.scrollIntoView({ block: "nearest" });
    });
    return () => cancelAnimationFrame(kare);
  }, [acik]);

  function sec(value) {
    onSec(value);
    setAcik(false);
    requestAnimationFrame(() => tetik.current?.focus());
  }

  return (
    <div className="grid min-w-0 gap-1.5">
      <span className="text-sm font-medium">{etiket}</span>
      <Popover open={acik} onOpenChange={(sonraki) => { if (!disabled) setAcik(sonraki); }}>
        <PopoverTrigger ref={tetik} type="button" disabled={disabled} className={cn(TETIK, !yazi && "text-muted-foreground")}>
          <span className="min-w-0 flex-1 truncate">{yazi || placeholder}</span>
          <ChevronDownIcon className={cn("pointer-events-none size-4 shrink-0 text-muted-foreground transition-transform", acik && "rotate-180")} />
        </PopoverTrigger>
        <PopoverContent className="w-(--anchor-width) p-0" align="start">
          <Command>
            <CommandInput placeholder={ara} />
            <CommandList ref={liste}>
              <CommandEmpty>Sonuç yok</CommandEmpty>
              <CommandGroup>
                {secenekler.map((s) => (
                  <CommandItem key={s.value} value={`${s.label} ${s.value}`} data-checked={s.value === deger || undefined} className="cursor-pointer" onSelect={() => sec(s.value)}>
                    {s.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {hata ? <p className="text-xs text-destructive">{hata}</p> : null}
    </div>
  );
}

function AlanSelect({ etiket, placeholder, value, hata, disabled, onChange, etiketle, children }) {
  const [acik, setAcik] = useState(false);
  return (
    <div className="grid min-w-0 gap-1.5">
      <span className="text-sm font-medium">{etiket}</span>
      <Select open={acik} onOpenChange={setAcik} value={value || null} disabled={disabled} onValueChange={(deger) => { onChange(deger || ""); setAcik(false); }}>
        <SelectTrigger className={TETIK}>
          {etiketle ? (
            <SelectValue placeholder={placeholder}>{(deger) => (deger ? etiketle(deger) : placeholder)}</SelectValue>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
      {hata ? <p className="text-xs text-destructive">{hata}</p> : null}
    </div>
  );
}

function TarihSec({ deger, hata, bugun, onSec }) {
  const [acik, setAcik] = useState(false);
  const tetik = useRef(null);
  return (
    <div className="grid min-w-0 gap-1.5">
      <span className="text-sm font-medium">Tarih</span>
      <Popover open={acik} onOpenChange={setAcik}>
        <PopoverTrigger ref={tetik} type="button" className={cn(TETIK, "justify-start gap-2", !deger && "text-muted-foreground")}>
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{deger ? tarihEtiket(deger) : "Tarih seçin"}</span>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={deger ? new Date(`${deger}T12:00:00+03:00`) : undefined}
            onSelect={(gun) => {
              if (!gun) return;
              onSec(gunYmd(gun));
              setAcik(false);
              requestAnimationFrame(() => tetik.current?.focus());
            }}
            disabled={(gun) => Boolean(bugun) && gunYmd(gun) < bugun}
            locale={tr}
          />
        </PopoverContent>
      </Popover>
      {hata ? <p className="text-xs text-destructive">{hata}</p> : null}
    </div>
  );
}

function SablonSec({ sablonlar, onSec }) {
  const [acik, setAcik] = useState(false);
  return (
    <div className="grid gap-1.5">
      <span className="text-sm font-medium">Şablondan doldur</span>
      <Select open={acik} onOpenChange={setAcik} onValueChange={(id) => {
        const sablon = sablonlar.find((item) => item.id === id);
        setAcik(false);
        if (sablon) onSec(sablon.metin);
      }}>
        <SelectTrigger className={TETIK}>
          <SelectValue placeholder="Şablon seçin" />
        </SelectTrigger>
        <SelectContent>
          {sablonlar.map((sablon) => <SelectItem key={sablon.id} value={sablon.id}>{sablon.baslik}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
