"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChatCircleText, PaperPlaneTilt } from "@phosphor-icons/react";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { DataTable } from "@/components/DataTable";
import { KartBos, ListCard, ListeSayfa, PageHeader, Toolbar } from "@/components/list-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { hataMesaji } from "@/lib/hata-mesaji";
import { createClient } from "@/lib/supabase/client";
import { kisaTarihSaat, saatYazi, ymdIstanbul } from "@/lib/tarih";

const KONULAR = [
  { value: "soru", label: "Soru" },
  { value: "sikayet", label: "Şikayet" },
  { value: "oneri", label: "Öneri" },
];
const ETIKET = Object.fromEntries(KONULAR.map((k) => [k.value, k.label]));

const KOLONLAR = [
  {
    accessorKey: "konu",
    header: "Tür",
    cell: ({ row }) => <TurRozeti konu={row.original.konu} />,
  },
  {
    accessorKey: "mesaj",
    header: "Mesaj",
    meta: { className: "max-w-md" },
    cell: ({ row }) => <span className="block truncate">{ilkSatir(row.original.mesaj)}</span>,
  },
  {
    accessorKey: "durum",
    header: "Durum",
    cell: ({ row }) => <DurumRozeti durum={row.original.durum} />,
  },
  {
    accessorKey: "created_at",
    header: "Tarih",
    cell: ({ row }) => kisaTarihSaat(row.original.son_mesaj_at || row.original.created_at),
  },
];

export function Destek({ baslangicAcik = false }) {
  const [konu, setKonu] = useState("soru");
  const [mesaj, setMesaj] = useState("");
  const [email, setEmail] = useState("");
  const [talepler, setTalepler] = useState(null);
  const [hata, setHata] = useState("");
  const [formHata, setFormHata] = useState("");
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [acik, setAcik] = useState(baslangicAcik);
  const [sekme, setSekme] = useState("tumu");
  const [seciliId, setSeciliId] = useState(null);

  const yukle = useCallback(async () => {
    await Promise.resolve();
    const supabase = createClient();
    const { data: oturum } = await supabase.auth.getUser();
    setEmail(oturum?.user?.email || "");
    const { data, error } = await supabase
      .from("destek_talepleri")
      .select("id, konu, mesaj, durum, created_at, son_mesaj_at")
      .order("son_mesaj_at", { ascending: false });
    if (error) throw error;
    setTalepler(data || []);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- liste sunucudan gelir
    yukle().catch((error) => setHata(hataMesaji(error)));
  }, [yukle]);

  async function gonder(event) {
    event.preventDefault();
    const metin = mesaj.trim();
    if (metin.length < 10) return setFormHata("Mesaj en az 10 karakter olmalı.");
    setGonderiliyor(true);
    setFormHata("");
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc("destek_talep_ac", { p_konu: konu, p_mesaj: metin });
      if (error) throw error;
      setMesaj("");
      setKonu("soru");
      setAcik(false);
      toast.success("Mesajınız iletildi");
      await yukle();
    } catch (error) {
      toast.error(hataMesaji(error));
    } finally {
      setGonderiliyor(false);
    }
  }

  const liste = (talepler || []).filter((talep) => {
    if (sekme === "acik") return talep.durum === "acik";
    if (sekme === "cevaplandi") return talep.durum === "cevaplandi";
    return true;
  });
  const acikSayi = (talepler || []).filter((talep) => talep.durum === "acik").length;
  const cevapSayi = (talepler || []).filter((talep) => talep.durum === "cevaplandi").length;
  const bos = Boolean(talepler) && !liste.length;
  const secili = (talepler || []).find((talep) => talep.id === seciliId) || null;

  return (
    <ListeSayfa>
      <PageHeader
        baslik="Destek"
        aciklama="Soru, şikayet ve önerileriniz"
        eylem={<Button className="h-9" onClick={() => { setFormHata(""); setAcik(true); }}>Yeni talep</Button>}
      />
      <Toolbar
        sekmeler={[
          { value: "tumu", label: "Tümü", adet: talepler?.length || 0 },
          { value: "acik", label: "Açık", adet: acikSayi },
          { value: "cevaplandi", label: "Cevaplandı", adet: cevapSayi },
        ]}
        sekme={sekme}
        onSekme={setSekme}
      />
      {hata ? <p role="alert" className="mb-4 text-sm text-destructive">{hata}</p> : null}
      <ListCard>
        <DataTable columns={KOLONLAR} data={bos ? [] : liste} yukleniyor={talepler === null} secili={(talep) => talep.id === seciliId} onRow={(talep) => setSeciliId(talep.id)} />
        {bos && !talepler.length ? (
          <KartBos ikon={ChatCircleText} baslik="Henüz talebiniz yok">
            <Button size="sm" onClick={() => { setFormHata(""); setAcik(true); }}>Yeni talep</Button>
          </KartBos>
        ) : null}
        {bos && talepler.length ? <KartBos baslik="Bu sekmede talep yok" /> : null}
      </ListCard>
      <TalepModali acik={acik} konu={konu} mesaj={mesaj} email={email} hata={formHata} gonderiliyor={gonderiliyor} onKonu={setKonu} onMesaj={(deger) => { setFormHata(""); setMesaj(deger); }} onKapat={() => setAcik(false)} onGonder={gonder} />
      <Sheet open={Boolean(secili)} onOpenChange={(sonraki) => { if (!sonraki) setSeciliId(null); }}>
        <SheetContent side="right" showCloseButton={false} className="h-dvh w-full max-w-none gap-0 bg-background p-0 data-[side=right]:h-dvh data-[side=right]:w-full data-[side=right]:max-w-none md:h-full md:data-[side=right]:w-[480px] md:data-[side=right]:max-w-[480px]">
          {secili ? <TalepSheet key={secili.id} talep={secili} onYeni={() => { setSeciliId(null); setFormHata(""); setAcik(true); }} onGonderildi={yukle} /> : null}
        </SheetContent>
      </Sheet>
    </ListeSayfa>
  );
}

function TalepModali({ acik, konu, mesaj, email, hata, gonderiliyor, onKonu, onMesaj, onKapat, onGonder }) {
  return (
    <Dialog open={acik} onOpenChange={(sonraki) => { if (!sonraki) onKapat(); }}>
      <DialogContent className="gap-4 bg-white p-6 md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Yeni talep</DialogTitle>
        </DialogHeader>
        <form onSubmit={onGonder} className="flex flex-col">
          <div className="space-y-4">
            <div className="grid gap-1.5">
              <span className="text-sm font-medium">Tür</span>
              <div className="inline-flex h-8 w-fit items-center rounded-md bg-muted p-0.5">
                {KONULAR.map((secenek) => (
                  <button
                    key={secenek.value}
                    type="button"
                    onClick={() => onKonu(secenek.value)}
                    className={cn("h-7 cursor-pointer rounded-sm px-3 text-sm", konu === secenek.value ? "bg-background font-medium text-foreground shadow-sm" : "text-muted-foreground")}
                  >
                    {secenek.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="destek-mesaj" className="text-sm font-medium">Mesaj</label>
              <textarea id="destek-mesaj" rows={4} value={mesaj} placeholder="Mesajınızı yazın" className="w-full resize-none rounded-md border border-input bg-white px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" onChange={(e) => onMesaj(e.target.value)} />
              {hata ? <p className="text-xs text-destructive">{hata}</p> : null}
            </div>
            {email ? <p className="text-sm text-muted-foreground">Cevap {epostaMaske(email)} adresine de iletilir</p> : null}
          </div>
          <div className="mt-4 flex justify-end border-t bg-white pt-4 max-md:sticky max-md:bottom-0 max-md:flex-col max-md:[&_button]:h-11 max-md:[&_button]:w-full">
            <Button type="submit" disabled={gonderiliyor}>{gonderiliyor ? "Gönderiliyor…" : "Gönder"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TalepSheet({ talep, onYeni, onGonderildi }) {
  const [kayitlar, setKayitlar] = useState([]);
  const [ekler, setEkler] = useState([]);
  const [taslak, setTaslak] = useState("");
  const [bugun, setBugun] = useState("");
  const kaydir = useRef(null);
  const yazi = useRef(null);
  const duruyor = useRef(true);
  const kapali = talep.durum === "kapandi";
  const mesajlar = kayitlar.concat(ekler);

  useEffect(() => {
    duruyor.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- gün ayracı için bugünün tarihi
    setBugun(ymdIstanbul());
    let iptal = false;
    sohbetiYukle(talep.id)
      .then((gelen) => { if (!iptal) setKayitlar(gelen); })
      .catch((error) => { if (!iptal) toast.error(hataMesaji(error)); });
    return () => {
      iptal = true;
      duruyor.current = false;
    };
  }, [talep.id]);

  useLayoutEffect(() => {
    const kutu = kaydir.current;
    if (kutu) kutu.scrollTop = kutu.scrollHeight;
  }, [mesajlar.length, talep.id]);

  async function yolla(metin, eskiId) {
    const govde = metin.trim();
    if (!govde) return;
    const id = eskiId || `yerel-${Date.now()}`;
    setEkler((liste) => {
      const kayit = { id, taraf: "kullanici", metin: govde, durum: "gonderiliyor", zaman: new Date().toISOString() };
      return liste.some((m) => m.id === id) ? liste.map((m) => (m.id === id ? { ...m, ...kayit } : m)) : [...liste, kayit];
    });
    if (!eskiId) {
      setTaslak("");
      if (yazi.current) yazi.current.style.height = "auto";
    }
    try {
      const { error } = await createClient().rpc("destek_mesaj_gonder", { p_talep_id: talep.id, p_mesaj: govde });
      if (error) throw error;
      const gelen = await sohbetiYukle(talep.id);
      if (!duruyor.current) return;
      setKayitlar(gelen);
      setEkler((liste) => liste.filter((m) => m.id !== id));
      await onGonderildi();
    } catch (error) {
      if (!duruyor.current) return;
      toast.error(hataMesaji(error));
      setEkler((liste) => liste.map((m) => (m.id === id ? { ...m, durum: "hata" } : m)));
    }
  }

  function tus(event) {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    yolla(taslak);
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <header className="flex items-center gap-3 border-b px-4 py-3">
        <img src="/icon.png" alt="" className="size-8 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">TevkilGO Destek</p>
          <p className="truncate text-xs text-muted-foreground">{ETIKET[talep.konu] || talep.konu} · {saatYazi(talep.created_at)}</p>
        </div>
        <DurumRozeti durum={talep.durum} />
        <SheetClose className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
          <XIcon className="size-4" />
          <span className="sr-only">Kapat</span>
        </SheetClose>
      </header>
      <div ref={kaydir} className="min-h-0 flex-1 overflow-y-auto bg-muted/40">
        <div className="flex min-h-full flex-col justify-end px-4 py-4">
          <Sohbet mesajlar={mesajlar} bugun={bugun} onTekrar={(m) => yolla(m.metin, m.id)} />
        </div>
      </div>
      {kapali ? (
        <div className="flex shrink-0 items-center justify-between gap-3 border-t bg-muted/60 px-4 py-3" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
          <span className="text-sm text-muted-foreground">Bu talep kapandı</span>
          <button type="button" className="cursor-pointer text-sm text-foreground underline underline-offset-4" onClick={onYeni}>Yeni talep</button>
        </div>
      ) : (
        <form className="sticky bottom-0 flex shrink-0 items-end gap-2 border-t bg-white px-3 py-2" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }} onSubmit={(event) => { event.preventDefault(); yolla(taslak); }}>
          <textarea
            ref={yazi}
            rows={1}
            value={taslak}
            placeholder="Mesaj yazın…"
            className="max-h-24 min-h-11 flex-1 resize-none bg-transparent px-2 py-2 text-base outline-none placeholder:text-muted-foreground md:text-sm"
            onChange={(event) => {
              setTaslak(event.target.value);
              event.target.style.height = "auto";
              event.target.style.height = `${Math.min(event.target.scrollHeight, 96)}px`;
            }}
            onKeyDown={tus}
          />
          <button type="submit" disabled={!taslak.trim()} aria-label="Gönder" className="mb-0.5 inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">
            <PaperPlaneTilt size={16} weight="fill" />
          </button>
        </form>
      )}
    </div>
  );
}

function Sohbet({ mesajlar, bugun, onTekrar }) {
  const gruplar = grupla(mesajlar);
  let oncekiGun = "";
  return gruplar.map((grup) => {
    const gun = grup.mesajlar.map((m) => m.zaman).find(Boolean);
    const etiket = gun ? gunAyrac(gun, bugun) : "";
    const ayir = etiket && etiket !== oncekiGun;
    if (etiket) oncekiGun = etiket;
    return (
      <div key={grup.mesajlar[0].id} className="mt-3 first:mt-0">
        {ayir ? <p className="mb-3 text-center"><span className="inline-flex rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">{etiket}</span></p> : null}
        <div className={cn("flex flex-col", grup.taraf === "kullanici" ? "items-end" : "items-start")}>
          {grup.mesajlar.map((mesaj, index) => {
            const son = index === grup.mesajlar.length - 1;
            return <Balon key={mesaj.id} mesaj={mesaj} son={son} ilk={index === 0} onTekrar={() => onTekrar(mesaj)} />;
          })}
        </div>
      </div>
    );
  });
}

function Balon({ mesaj, son, ilk, onTekrar }) {
  const kullanici = mesaj.taraf === "kullanici";
  const soluk = mesaj.durum === "gonderiliyor";
  return (
    <div className={cn("flex max-w-[75%] items-end gap-2", kullanici ? "ml-auto" : "mr-auto", !ilk && "mt-0.5")}>
      {!kullanici ? (son ? <img src="/icon.png" alt="" className="size-6 shrink-0 rounded-md" /> : <span className="size-6 shrink-0" />) : null}
      <div className={cn("min-w-0", kullanici && "text-right")}>
        <div className={cn(
          "whitespace-pre-wrap px-3 py-2 text-sm",
          kullanici ? "rounded-2xl rounded-br-md bg-primary text-primary-foreground" : "rounded-2xl rounded-bl-md border bg-white",
          soluk && "opacity-60",
        )}>
          {mesaj.metin}
        </div>
        {son ? (
          mesaj.durum === "hata" ? (
            <button type="button" className="mt-1 cursor-pointer text-xs text-destructive" onClick={onTekrar}>Tekrar dene</button>
          ) : mesaj.durum === "gonderiliyor" || mesaj.zaman ? (
            <p className="mt-1 text-xs text-muted-foreground">{mesaj.durum === "gonderiliyor" ? "gönderiliyor" : saatYazi(mesaj.zaman, true)}</p>
          ) : null
        ) : null}
      </div>
    </div>
  );
}

async function sohbetiYukle(talepId) {
  const { data, error } = await createClient()
    .from("destek_mesajlari")
    .select("id, gonderen, mesaj, created_at")
    .eq("talep_id", talepId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map((satir) => ({
    id: satir.id,
    taraf: satir.gonderen === "admin" ? "admin" : "kullanici",
    metin: satir.mesaj,
    zaman: satir.created_at,
    durum: "tamam",
  }));
}

function grupla(mesajlar) {
  const gruplar = [];
  mesajlar.forEach((mesaj) => {
    const son = gruplar[gruplar.length - 1];
    if (son && son.taraf === mesaj.taraf) son.mesajlar.push(mesaj);
    else gruplar.push({ taraf: mesaj.taraf, mesajlar: [mesaj] });
  });
  return gruplar;
}

function gunAyrac(iso, bugun) {
  const ymd = ymdIstanbul(new Date(iso));
  if (bugun && ymd === bugun) return "Bugün";
  const tarih = new Date(`${ymd}T12:00:00+03:00`);
  const gun = new Intl.DateTimeFormat("tr-TR", { day: "numeric", timeZone: "Europe/Istanbul" }).format(tarih);
  const ay = new Intl.DateTimeFormat("tr-TR", { month: "long", timeZone: "Europe/Istanbul" }).format(tarih);
  return `${gun} ${ay}`;
}

function TurRozeti({ konu }) {
  return <Badge variant="outline">{ETIKET[konu] || konu}</Badge>;
}

function DurumRozeti({ durum }) {
  if (durum === "kapandi") {
    return <Badge variant="secondary" className="bg-muted text-muted-foreground">Kapandı</Badge>;
  }
  if (durum === "cevaplandi") {
    return <Badge variant="secondary" className="border-green-600 bg-transparent text-green-700">Cevaplandı</Badge>;
  }
  return <Badge variant="secondary" className="border-transparent bg-blue-100 text-blue-800">Yanıt bekleniyor</Badge>;
}

function ilkSatir(metin) {
  return String(metin || "").split("\n")[0];
}

function epostaMaske(adres) {
  const [yerel, alan] = String(adres).split("@");
  if (!yerel || !alan) return adres;
  return `${yerel.slice(0, 2)}...@${alan}`;
}
