"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star } from "@phosphor-icons/react";
import { Banknote, Calendar, Copy, MessageCircle, Phone, RotateCcw, Users, XIcon } from "lucide-react";
import { Button } from "@/components/Button";
import { Button as UiButton } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { Field } from "@/components/Field";
import { FormHatasi } from "@/components/FormHatasi";
import { IlanFormu } from "@/components/uygulama/IlanFormu";
import { Iskelet, kategoriAd, useKategoriler } from "@/components/uygulama/ortak";
import { StatusBadge, durumAnahtari } from "@/components/uygulama/StatusBadge";
import { hataMesaji } from "@/lib/hata-mesaji";
import { createClient } from "@/lib/supabase/client";
import { saatYazi, tarihGun, tarihSaat } from "@/lib/tarih";

function sureYazi(ms) {
  const toplam = Math.max(0, Math.ceil(ms / 1000));
  const dakika = Math.floor(toplam / 60);
  const saniye = toplam % 60;
  return `${String(dakika).padStart(2, "0")}:${String(saniye).padStart(2, "0")}`;
}

function gunYazi(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", timeZone: "Europe/Istanbul" });
}

function haftaGunu(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("tr-TR", { weekday: "long", timeZone: "Europe/Istanbul" });
}

function whatsappNumara(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `90${digits.slice(1)}`;
  else if (digits.length === 10 && digits.startsWith("5")) digits = `90${digits}`;
  return digits;
}

export function GorevDetay({ id }) {
  useKategoriler();
  const router = useRouter();
  const [gorev, setGorev] = useState(null);
  const [kaynak, setKaynak] = useState(null);
  const [basvuranlar, setBasvuranlar] = useState([]);
  const [toplaniyor, setToplaniyor] = useState(false);
  const [dakika, setDakika] = useState(5);
  const [kalanMs, setKalanMs] = useState(0);
  const [karsi, setKarsi] = useState(null);
  const [adliyeAd, setAdliyeAd] = useState("");
  const [verilenPuan, setVerilenPuan] = useState(null);
  const [puan, setPuan] = useState(0);
  const [yorum, setYorum] = useState("");
  const [sikayet, setSikayet] = useState(false);
  const [aciklama, setAciklama] = useState("");
  const [duzenle, setDuzenle] = useState(false);
  const [formHazir, setFormHazir] = useState(false);
  const [kaydediyor, setKaydediyor] = useState(false);
  const kaydir = useRef(null);
  const formHazirOl = useCallback(() => setFormHazir(true), []);
  const [onay, setOnay] = useState(null);
  const [iptalOnay, setIptalOnay] = useState(false);
  const [geriOnay, setGeriOnay] = useState(false);
  const [puanAc, setPuanAc] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [mesgul, setMesgul] = useState(false);
  const [hata, setHata] = useState("");
  const [acikBasvuru, setAcikBasvuru] = useState(null);
  const [simdi, setSimdi] = useState(0);
  const yukle = useCallback(async (sessiz) => {
    if (!id) return;
    await Promise.resolve();
    if (!sessiz) setYukleniyor(true);
    setHata("");
    setSimdi(Date.now());
    setKarsi(null);
    setBasvuranlar([]);
    setToplaniyor(false);
    const supabase = createClient();
    try {
      const { data: mine, error } = await supabase.from("gorevlerim").select("*").eq("id", id);
      if (error) throw error;
      const row = (mine || [])[0];
      let adliyeKod = row?.adliye;
      if (row) {
        setKaynak("gorevlerim");
        setGorev(row);
        if (row.durum === "tamamlandi") {
          const { data: puanSatir, error: puanHata } = await supabase.rpc("gorev_puanim", { p_task_id: id });
          if (puanHata) throw puanHata;
          const kayit = Array.isArray(puanSatir) ? puanSatir[0] : puanSatir;
          setVerilenPuan(kayit && (kayit.iptal || kayit.puan != null) ? kayit : null);
        } else setVerilenPuan(null);
        const taraf = row.rol === "olusturan" || row.basvuru_durumu === "secildi";
        if (row.rol === "olusturan" && row.durum === "acik") {
          let toplamaDakika = 5;
          const { data: ayar } = await supabase.from("app_ayarlar").select("deger").eq("anahtar", "basvuru_toplama_dakika").maybeSingle();
          const sayi = Number(ayar?.deger);
          if (Number.isFinite(sayi) && sayi >= 0) toplamaDakika = sayi;
          setDakika(toplamaDakika);
          const bitis = new Date(row.created_at).getTime() + toplamaDakika * 60000;
          const kalan = bitis - Date.now();
          if (kalan > 0) {
            setToplaniyor(true);
            setKalanMs(kalan);
          } else {
            const { data: list, error: listError } = await supabase.rpc("gorev_basvuranlari", { p_task_id: id });
            if (listError) throw listError;
            setBasvuranlar(list || []);
          }
        }
        if (taraf && (row.durum === "atandi" || row.durum === "tamamlandi")) {
          const [partySonuc, kimSonuc, oturumSonuc] = await Promise.all([
            supabase.rpc("karsi_taraf", { p_task_id: id }),
            supabase.from("tasks").select("olusturucu_id, ustlenen_id").eq("id", id).maybeSingle(),
            supabase.auth.getUser(),
          ]);
          if (partySonuc.error) throw partySonuc.error;
          const kisi = Array.isArray(partySonuc.data) ? partySonuc.data[0] : partySonuc.data;
          const uid = oturumSonuc.data?.user?.id;
          const kim = kimSonuc.data;
          const karsiId = kim && uid ? (kim.olusturucu_id === uid ? kim.ustlenen_id : kim.olusturucu_id) : null;
          setKarsi(kisi ? { ...kisi, id: karsiId } : kisi);
        }
        const { data: openBasvuru, error: acikHata } = await supabase.from("acik_gorevler").select("basvurdum, basvuru_id").eq("id", id).maybeSingle();
        if (acikHata) throw acikHata;
        setAcikBasvuru(openBasvuru || null);
      } else {
        const { data: open, error: openError } = await supabase.from("acik_gorevler").select("*").eq("id", id).maybeSingle();
        if (openError) throw openError;
        setKaynak(open ? "acik" : null);
        setGorev(open);
        setAcikBasvuru(open || null);
        setVerilenPuan(null);
        adliyeKod = open?.adliye;
      }
      if (adliyeKod) {
        const { data } = await supabase.from("adliyeler").select("ad").eq("kod", adliyeKod).maybeSingle();
        setAdliyeAd(data?.ad || adliyeKod);
      }
    } catch (error) {
      setHata(hataMesaji(error));
      setGorev(null);
      setAcikBasvuru(null);
      setKaynak(null);
    } finally {
      setYukleniyor(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- görev sunucudan gelir
    yukle();
  }, [yukle]);

  useEffect(() => {
    if (!toplaniyor || !gorev?.created_at) return undefined;
    const bitis = new Date(gorev.created_at).getTime() + dakika * 60000;
    let iptal = false;
    let listeYukleniyor = false;
    let hataGosterildi = false;
    const tick = async () => {
      const kalan = bitis - Date.now();
      if (kalan > 0) {
        setKalanMs(kalan);
        return;
      }
      setKalanMs(0);
      if (listeYukleniyor || iptal) return;
      listeYukleniyor = true;
      const { data: list, error: listError } = await createClient().rpc("gorev_basvuranlari", { p_task_id: id });
      listeYukleniyor = false;
      if (iptal) return;
      if (listError) {
        if (String(listError.message || "").toLowerCase().includes("toplan")) return;
        if (!hataGosterildi) {
          hataGosterildi = true;
          setHata(hataMesaji(listError));
        }
        return;
      }
      setBasvuranlar(list || []);
      setToplaniyor(false);
    };
    const zaman = setInterval(tick, 1000);
    return () => {
      iptal = true;
      clearInterval(zaman);
    };
  }, [toplaniyor, gorev?.created_at, dakika, id]);

  async function calistir(action) {
    setMesgul(true);
    setHata("");
    try {
      await action();
      await yukle(true);
      window.dispatchEvent(new Event("ilanlar-yenile"));
    } catch (error) {
      const mesaj = hataMesaji(error);
      toast.error(mesaj);
      setHata(mesaj);
    } finally {
      setMesgul(false);
    }
  }

  async function tamamla() {
    setMesgul(true);
    setHata("");
    try {
      const { error } = await createClient().rpc("gorev_tamamla", { p_task_id: id });
      if (error) throw error;
      setPuan(0);
      setYorum("");
      setPuanAc(true);
      await yukle();
    } catch (error) {
      setHata(hataMesaji(error));
    } finally {
      setMesgul(false);
    }
  }

  useEffect(() => {
    if (!duzenle || !kaydir.current) return;
    kaydir.current.scrollTop = 0;
  }, [duzenle]);

  function yenidenYayinla() {
    // Panel kapanınca form listenin üstünde açılır; yayınlanınca zaten listeye dönülür.
    router.push("/app/gorevlerim");
    window.dispatchEvent(new CustomEvent("ilan-ac", { detail: { kaynakId: id } }));
  }

  function duzenlemeyiAc() {
    setFormHazir(false);
    setKaydediyor(false);
    setDuzenle(true);
  }

  const sahip = kaynak === "gorevlerim" && gorev?.rol === "olusturan";
  const basvurdu = acikBasvuru?.basvurdum === true || acikBasvuru?.basvurdum === "true";
  const taraf = sahip || gorev?.basvuru_durumu === "secildi";
  const tarihGecti = Boolean(simdi && gorev?.tarih_saat && new Date(gorev.tarih_saat).getTime() < simdi);

  const yenidenYayinlanabilir = Boolean(sahip && (gorev?.durum === "suresi_doldu" || gorev?.durum === "iptal"));
  const rozetDurum = gorev ? (toplaniyor ? "toplaniyor" : durumAnahtari(gorev, dakika, 0)) : "acik";
  const surec = gorev ? surecAdimlari(gorev, { toplaniyor, verilenPuan }) : [];
  const aksiyonVar = Boolean(gorev && (
    (acikBasvuru && !sahip)
    || (sahip && gorev.durum === "acik")
    || (sahip && gorev.durum === "atandi")
    || (sahip && gorev.durum === "tamamlandi" && !verilenPuan)
    || (taraf && (gorev.durum === "atandi" || gorev.durum === "tamamlandi"))
    || yenidenYayinlanabilir
  ));

  return (
    <div className="pointer-events-auto flex h-full min-h-0 flex-col bg-background">
      <div ref={kaydir} data-sheet-scroll className="min-h-0 flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 flex items-start gap-3 border-b bg-background px-6 py-4">
          <div className="min-w-0 flex-1">
            {duzenle ? <h2 className="text-lg font-semibold">Görevi düzenle</h2> : gorev ? (
              <div className="space-y-2">
                <StatusBadge durum={rozetDurum} className={PANEL_ROZET[rozetDurum]} />
                <div>
                  <h2 className="text-xl leading-tight font-semibold">{adliyeAd || gorev.adliye}</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">{kategoriAd(gorev.kategori)}</p>
                </div>
              </div>
            ) : <h2 className="text-lg font-semibold">Görev</h2>}
          </div>
          <SheetClose className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
            <XIcon className="size-4" />
            <span className="sr-only">Kapat</span>
          </SheetClose>
        </header>
        {yukleniyor ? <div className="p-6"><Iskelet satir={2} /></div> : null}
        {!yukleniyor && !gorev ? <p className="p-6 text-sm text-muted-foreground">{hata || "Görev bulunamadı"}</p> : null}
        {gorev && duzenle ? (
          <IlanFormu
            sheet
            formId="gorev-duzenle"
            duzenleId={id}
            onHazir={formHazirOl}
            onYukleniyor={setKaydediyor}
            onBitti={() => { setDuzenle(false); toast.success("Görev güncellendi"); yukle(); }}
          />
        ) : null}
        {gorev && !duzenle ? (
          <div className="divide-y divide-border">
            {hata ? <div className="px-6 py-3"><FormHatasi>{hata}</FormHatasi></div> : null}
            {sahip && gorev.durum === "atandi" && tarihGecti ? <div className="px-6 py-3"><TamamlaUyarisi /></div> : null}
            <section className="px-6 py-5">
              <div className="grid grid-cols-2 divide-x divide-border">
                <div className="min-w-0 pr-4">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Calendar className="size-3.5" aria-hidden="true" />Tarih ve saat</p>
                  <p className="mt-1 text-lg leading-tight font-semibold tabular-nums">{gunYazi(gorev.tarih_saat)}</p>
                  <p className="text-sm text-muted-foreground tabular-nums">{haftaGunu(gorev.tarih_saat)} · {saatYazi(gorev.tarih_saat, true)}</p>
                </div>
                <div className="min-w-0 pl-4">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Banknote className="size-3.5" aria-hidden="true" />Ücret</p>
                  <p className="mt-1 text-lg leading-tight font-semibold tabular-nums">{Number(gorev.ucret).toLocaleString("tr-TR")} ₺</p>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="size-3.5" aria-hidden="true" />{gorev.basvuru_sayisi || 0}/10 başvuru</p>
                </div>
              </div>
              <DurumNotu gorev={gorev} durum={rozetDurum} sahip={sahip} />
            </section>
            {gorev.gorev_notu ? (
              <section className="px-6 py-5">
                <BolumBaslik>Yapılacak iş</BolumBaslik>
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{gorev.gorev_notu}</p>
              </section>
            ) : null}
            <section className="px-6 py-5">
              <BolumBaslik>Süreç</BolumBaslik>
              <ol className="mt-3">
                {surec.map((adim, index) => (
                  <li key={`${adim.ad}-${index}`} className="relative flex gap-3 pb-3 last:pb-0">
                    {index < surec.length - 1 ? <span className="absolute top-2 bottom-0 left-[4px] w-px bg-border" aria-hidden="true" /> : null}
                    <span className={`relative z-10 mt-1 size-2.5 shrink-0 rounded-full ${NOKTA[adim.durum]}`} aria-hidden="true" />
                    <span className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
                      <span className={`text-sm ${YAZI[adim.durum]}`}>{adim.ad}</span>
                      {adim.tarih ? <span className="shrink-0 text-xs text-muted-foreground">{adim.tarih}</span> : null}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
            {sahip && gorev.durum === "acik" && toplaniyor ? (
              <section className="space-y-1 p-6">
                <p className="text-sm font-medium">Başvurular {new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit" }).format(new Date(new Date(gorev.created_at).getTime() + dakika * 60000))}’te açılacak</p>
                <p className="text-lg font-semibold tabular-nums">{sureYazi(kalanMs)}</p>
                <p className="text-sm text-muted-foreground">Şu ana kadar {gorev.basvuru_sayisi || 0} başvuru geldi</p>
                <p className="text-sm leading-relaxed text-muted-foreground">Adil bir seçim için başvurular ilk {dakika} dakika boyunca toplanır. Bu sürede başvuranları göremezsiniz; süre dolunca hepsi aynı anda listelenir.</p>
              </section>
            ) : null}
            {sahip && gorev.durum === "acik" && !toplaniyor ? (
              <section className="space-y-3 p-6">
                <BolumBaslik>Başvuranlar ({basvuranlar.length})</BolumBaslik>
                {basvuranlar.length === 0 ? (
                  <div className="rounded-lg border px-4 py-8 text-center text-sm text-muted-foreground">Henüz başvuru yok</div>
                ) : basvuranlar.map((item) => (
                  <BasvuranKarti key={item.basvuru_id} item={item} disabled={mesgul} onSec={() => setOnay(item.basvuru_id)} />
                ))}
              </section>
            ) : null}
            {taraf && (gorev.durum === "atandi" || gorev.durum === "tamamlandi") && karsi ? (
              <section className="px-6 py-5">
                <BolumBaslik>{sahip ? "Seçilen meslektaş" : "İlan sahibi"}</BolumBaslik>
                <div className="mt-3 rounded-xl border p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{basHarfler(karsi.ad_soyad)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{karsi.ad_soyad}</p>
                      <p className="truncate text-[13px] text-muted-foreground">{[karsi.baro, karsi.tbb_sicil ? `Sicil ${karsi.tbb_sicil}` : null].filter(Boolean).join(" · ")}</p>
                    </div>
                    {karsi.puan_ortalama != null ? (
                      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold">
                        <Star size={14} weight="fill" className="text-accent-gold" />
                        {Number(karsi.puan_ortalama).toLocaleString("tr-TR", { maximumFractionDigits: 1 })}
                      </span>
                    ) : null}
                  </div>
                  {karsi.telefon ? (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <UiButton variant="outline" className="h-9" nativeButton={false} render={<a href={`tel:${karsi.telefon}`} />}><Phone className="size-4" />Ara</UiButton>
                      <UiButton variant="outline" className="h-9" nativeButton={false} render={<a href={`https://wa.me/${whatsappNumara(karsi.telefon)}`} target="_blank" rel="noopener noreferrer" />}><MessageCircle className="size-4" />WhatsApp</UiButton>
                      <UiButton variant="outline" className="h-9" onClick={() => { navigator.clipboard?.writeText(karsi.telefon || ""); toast.success("Telefon kopyalandı"); }}><Copy className="size-4" />Kopyala</UiButton>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}
            {sahip && gorev.durum === "tamamlandi" && verilenPuan ? (
              <section className="p-6 text-sm">
                {verilenPuan.iptal ? <p>Bu değerlendirme yönetim tarafından kaldırıldı</p> : (
                  <>
                    <p className="font-medium">{verilenPuan.puan} yıldız verdiniz{verilenPuan.duzeltildi ? " (düzeltildi)" : ""}</p>
                    {verilenPuan.yorum ? <p className="mt-1 text-muted-foreground">{verilenPuan.yorum}</p> : null}
                  </>
                )}
              </section>
            ) : null}
            {!sahip && taraf && gorev.durum === "tamamlandi" && verilenPuan ? (
              <section className="p-6 text-sm">
                {verilenPuan.iptal ? <p>Bu değerlendirme yönetim tarafından kaldırıldı</p> : (
                  <>
                    <p className="font-medium">Bu görevden aldığınız puan: {verilenPuan.puan} ★{verilenPuan.duzeltildi ? " (düzeltildi)" : ""}</p>
                    {verilenPuan.yorum ? <p className="mt-1 text-muted-foreground">{verilenPuan.yorum}</p> : null}
                  </>
                )}
              </section>
            ) : null}
          </div>
        ) : null}
      </div>
      {duzenle ? (
        <div className="flex items-center justify-end gap-2 border-t bg-background p-4 max-md:flex-col max-md:[&_button]:h-11 max-md:[&_button]:w-full" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
          <UiButton type="button" variant="outline" className="h-9" disabled={kaydediyor} onClick={() => setDuzenle(false)}>Vazgeç</UiButton>
          <UiButton type="submit" form="gorev-duzenle" className="h-9" disabled={!formHazir || kaydediyor}>{kaydediyor ? "Kaydediliyor…" : "Kaydet"}</UiButton>
        </div>
      ) : gorev && aksiyonVar ? (
        <div className="sticky bottom-0 flex flex-wrap gap-2 border-t bg-background p-4 max-md:[&_button]:min-h-11" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
          {acikBasvuru && !sahip ? (
            basvurdu ? (
              <Button type="button" variant="secondary" disabled={mesgul} onClick={() => setGeriOnay(true)}>Başvuruyu geri çek</Button>
            ) : (
              <Button type="button" disabled={mesgul} onClick={() => calistir(async () => {
                const { error } = await createClient().rpc("gorev_basvur", { p_task_id: id });
                if (error) throw error;
                toast.success("Başvurunuz iletildi");
              })}>Başvur</Button>
            )
          ) : null}
          {yenidenYayinlanabilir ? (
            <Button type="button" className="flex-1 gap-2" onClick={yenidenYayinla}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Yeniden yayınla
            </Button>
          ) : null}
          {sahip && gorev.durum === "acik" && (gorev.basvuru_sayisi || 0) === 0 ? <Button type="button" variant="secondary" onClick={duzenlemeyiAc}>Düzenle</Button> : null}
          {sahip && gorev.durum === "acik" ? <Button type="button" variant="secondary" className="text-danger" disabled={mesgul} onClick={() => setIptalOnay(true)}>İptal et</Button> : null}
          {sahip && gorev.durum === "atandi" ? <Button type="button" disabled={mesgul} onClick={tamamla}>Tamamlandı olarak işaretle</Button> : null}
          {sahip && gorev.durum === "tamamlandi" && !verilenPuan ? <Button type="button" onClick={() => setPuanAc(true)}>Değerlendir</Button> : null}
          {taraf && (gorev.durum === "atandi" || gorev.durum === "tamamlandi") ? <Button type="button" variant="secondary" className="text-danger" onClick={() => setSikayet(true)}>Şikayet et</Button> : null}
        </div>
      ) : null}

      {onay ? (
        <Onay
          baslik="Bu meslektaşı seçiyor musun?"
          metin="Seçim sonrası diğer başvurular otomatik reddedilir ve bu işlem geri alınamaz."
          onay="Seç"
          yan
          mesgul={mesgul}
          onKapat={() => { if (!mesgul) setOnay(null); }}
          onOnayla={() => {
            const basvuruId = onay;
            calistir(async () => {
              const { error } = await createClient().rpc("gorev_sec", { p_basvuru_id: basvuruId });
              if (error) throw error;
              toast.success("Meslektaş seçildi");
              setOnay(null);
            });
          }}
        />
      ) : null}

      {geriOnay ? (
        <Onay
          baslik="Başvuruyu geri çek"
          metin="Başvurun geri çekilir. Aynı ilana yeniden başvurabilirsin."
          onay="Geri çek"
          onKapat={() => setGeriOnay(false)}
          onOnayla={() => {
            setGeriOnay(false);
            calistir(async () => {
              const { error } = await createClient().rpc("basvuru_geri_cek", { p_basvuru_id: acikBasvuru?.basvuru_id });
              if (error) throw error;
            });
          }}
        />
      ) : null}

      {puanAc ? (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="w-full max-w-md space-y-3 rounded-card bg-surface p-6 shadow-float">
            <h2 className="text-[17px] font-semibold">Değerlendir</h2>
            <FormHatasi>{hata}</FormHatasi>
            <Yildizlar deger={puan} onSec={setPuan} />
            <Field label="Yorum" id="puan-yorum-masa" multiline rows={3} value={yorum} placeholder="İsteğe bağlı" onChange={(e) => setYorum(e.target.value)} />
            <p className="text-[13px] leading-relaxed text-muted">
              Meslektaşınız görevi yerine getirmediyse{" "}
              <button type="button" className="font-medium text-navy underline" onClick={() => { setPuanAc(false); setSikayet(true); }}>Şikayet et</button>
            </p>
            <Button type="button" className="w-full" disabled={mesgul || puan < 1} onClick={() => {
              calistir(async () => {
                const { error } = await createClient().rpc("gorev_puanla", { p_task_id: id, p_puan: puan, p_yorum: yorum.trim() || null });
                if (error) throw error;
                setPuan(0);
                setYorum("");
                setPuanAc(false);
              });
            }}>Değerlendir</Button>
            <Button type="button" variant="secondary" className="w-full" onClick={() => setPuanAc(false)}>Vazgeç</Button>
          </div>
        </div>
      ) : null}

      {iptalOnay ? (
        <Onay
          baslik="İlanı iptal et"
          metin="İptal edilen ilana yeni başvuru alınmaz."
          onay="İptal et"
          onKapat={() => setIptalOnay(false)}
          onOnayla={() => {
            setIptalOnay(false);
            calistir(async () => {
              const { error } = await createClient().rpc("gorev_iptal", { p_task_id: id });
              if (error) throw error;
            });
          }}
        />
      ) : null}

      {sikayet ? (
        <div role="dialog" className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
          <form
            className="w-full max-w-md space-y-4 rounded-card bg-surface p-6"
            onSubmit={(event) => {
              event.preventDefault();
              calistir(async () => {
                const { error } = await createClient().rpc("sikayet_et", { p_task_id: id, p_aciklama: aciklama.trim() });
                if (error) throw error;
                setSikayet(false);
                setAciklama("");
              });
            }}
          >
            <h2 className="text-[17px] font-semibold">Şikayet Et</h2>
            <Field label="Açıklama" id="sikayet" multiline rows={4} value={aciklama} placeholder="Ne olduğunu yazın" onChange={(e) => setAciklama(e.target.value)} />
            <Button type="submit" className="w-full" disabled={mesgul || !aciklama.trim()}>Gönder</Button>
            <Button type="button" variant="secondary" className="w-full" onClick={() => setSikayet(false)}>Vazgeç</Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

const PANEL_ROZET = {
  acik: "border-transparent bg-blue-100 text-blue-800",
  atandi: "border-transparent bg-green-100 text-green-800",
  suresi_doldu: "border-transparent bg-warning-soft text-warning",
  iptal: "border-transparent bg-danger-soft text-danger",
  tamamlandi: "border-green-600 bg-transparent text-green-700",
};

const NOKTA = {
  tamam: "bg-foreground",
  aktif: "border-2 border-foreground bg-background ring-2 ring-foreground/20",
  gelecek: "bg-muted-foreground/30",
  gri: "bg-muted-foreground/40",
};

const YAZI = {
  tamam: "text-foreground",
  aktif: "font-medium text-foreground",
  gelecek: "text-muted-foreground",
  gri: "text-muted-foreground",
};

function surecAdimlari(gorev, { toplaniyor, verilenPuan }) {
  const adimlar = [
    { ad: "İlan açıldı", tamam: true, tarih: gorev.created_at ? tarihSaat(gorev.created_at) : "" },
    { ad: "Başvurular toplandı", tamam: !toplaniyor && (gorev.basvuru_sayisi || 0) > 0 },
    { ad: "Meslektaş seçildi", tamam: gorev.durum === "atandi" || gorev.durum === "tamamlandi" },
    { ad: "Görev tamamlandı", tamam: gorev.durum === "tamamlandi" },
    { ad: "Puanlandı", tamam: Boolean(verilenPuan && !verilenPuan.iptal) },
  ];
  if (gorev.durum === "iptal" || gorev.durum === "suresi_doldu") {
    const olan = adimlar.filter((adim) => adim.tamam).map((adim) => ({ ...adim, durum: "tamam" }));
    olan.push({ ad: gorev.durum === "iptal" ? "İptal edildi" : "Süresi doldu", durum: "gri", tarih: gorev.durum === "suresi_doldu" && gorev.tarih_saat ? tarihSaat(gorev.tarih_saat) : "" });
    return olan;
  }
  const aktif = adimlar.findIndex((adim) => !adim.tamam);
  return adimlar.map((adim, index) => ({
    ...adim,
    durum: adim.tamam ? "tamam" : index === aktif ? "aktif" : "gelecek",
  }));
}

function BolumBaslik({ children }) {
  return <h3 className="text-sm font-semibold">{children}</h3>;
}

function DurumNotu({ gorev, durum, sahip }) {
  const basvuru = gorev.basvuru_sayisi || 0;
  let metin = null;
  let ton = "bilgi";
  if (durum === "suresi_doldu") {
    ton = "uyari";
    metin = sahip
      ? (basvuru ? "Görev tarihi geçti ve bir meslektaş seçilmedi. Aynı bilgilerle yeniden yayınlayabilirsiniz." : "Bu ilana başvuru gelmeden görev tarihi geçti. Aynı bilgilerle yeniden yayınlayabilirsiniz.")
      : "Bu görevin tarihi geçti.";
  } else if (durum === "iptal") {
    ton = "uyari";
    metin = sahip ? "Bu ilanı iptal ettiniz. İsterseniz aynı bilgilerle yeniden yayınlayabilirsiniz." : "İlan sahibi bu ilanı iptal etti.";
  } else if (durum === "secim" && sahip) {
    metin = `${basvuru} başvuru geldi. Aşağıdan bir meslektaş seçin.`;
  } else if (durum === "reddedildi") {
    ton = "uyari";
    metin = "Bu görev için başka bir meslektaş seçildi.";
  } else if (durum === "bekliyor") {
    metin = "Başvurunuz iletildi. İlan sahibi seçim yaptığında bildirim alacaksınız.";
  }
  if (!metin) return null;
  return (
    <p className={`mt-4 rounded-lg px-3.5 py-2.5 text-[13px] leading-relaxed ${ton === "uyari" ? "bg-warning-soft text-warning" : "bg-primary/[0.06] text-primary"}`}>
      {metin}
    </p>
  );
}

function TamamlaUyarisi() {
  return (
    <p className="rounded-control border border-line border-l-2 border-l-gold bg-surface px-3 py-2 text-[13px] leading-relaxed">
      Görev tamamlandıysa işaretleyip meslektaşınızı değerlendirin.
    </p>
  );
}

function Yildizlar({ deger, onSec }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button key={value} type="button" aria-label={`${value} yıldız`} onClick={() => onSec(value)} className="p-1">
          <Star size={28} weight={value <= deger ? "fill" : "regular"} className={value <= deger ? "text-[#C4A265]" : "text-muted"} />
        </button>
      ))}
    </div>
  );
}

function basHarfler(ad) {
  const harfler = String(ad || "")
    .split(/\s+/)
    .map((parca) => parca.replace(/[^0-9A-Za-zĞÜŞİÖÇğüşıöç]/g, ""))
    .filter(Boolean)
    .slice(0, 2)
    .map((parca) => parca[0].toLocaleUpperCase("tr-TR"));
  return harfler.join("") || "?";
}

function BasvuranKarti({ item, disabled, onSec }) {
  const puanVar = Number(item.puan_sayisi) > 0;
  const puan = Number(item.puan_ortalama).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const uyelik = tarihGun(item.uyelik_baslangic);
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">{basHarfler(item.maskeli_ad)}</span>
          <span className="truncate font-semibold">{item.maskeli_ad}</span>
        </div>
        <p className="mt-1.5 truncate text-sm text-muted-foreground">{item.baro}{uyelik ? ` · Üye: ${uyelik}` : ""}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {puanVar ? (
            <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-xs">
              <Star size={14} weight="fill" className="text-amber-400" />
              <span className="font-semibold">{puan}</span>
              <span className="text-muted-foreground">({item.puan_sayisi} değerlendirme)</span>
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Yeni üye</span>
          )}
          <span className="inline-flex items-center rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground">{item.tamamlanan_sayisi || 0} görev tamamladı</span>
        </div>
      </div>
      <UiButton type="button" size="sm" className="w-full md:w-auto" disabled={disabled} onClick={onSec}>Seç</UiButton>
    </div>
  );
}

function Onay({ baslik, metin, onay, onOnayla, onKapat, mesgul = false, yan = false }) {
  return (
    <div role="dialog" className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
      <div className="w-full max-w-md space-y-4 rounded-card bg-surface p-6 shadow-float">
        <h2 className="text-[17px] font-semibold">{baslik}</h2>
        <p className="text-[14px] leading-relaxed">{metin}</p>
        {yan ? (
          <div className="flex justify-end gap-2">
            <UiButton type="button" variant="outline" disabled={mesgul} onClick={onKapat}>Vazgeç</UiButton>
            <UiButton type="button" disabled={mesgul} onClick={onOnayla}>{mesgul ? "Seçiliyor…" : onay}</UiButton>
          </div>
        ) : (
          <>
            <Button type="button" className="w-full" disabled={mesgul} onClick={onOnayla}>{onay}</Button>
            <Button type="button" variant="secondary" className="w-full" disabled={mesgul} onClick={onKapat}>Vazgeç</Button>
          </>
        )}
      </div>
    </div>
  );
}
