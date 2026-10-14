"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, CaretDown, Check, SignOut, Star, Trash, X } from "@phosphor-icons/react";
import { toast } from "sonner";
import { cn } from "cn";
import { Button as OnayButonu } from "@/components/Button";
import { Field } from "@/components/Field";
import { useKategoriler } from "@/components/uygulama/ortak";
import { ListeSayfa, PageHeader } from "@/components/list-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { hataMesaji } from "@/lib/hata-mesaji";
import { createClient } from "@/lib/supabase/client";

const SILME = "Profil → Hesabımı Sil. İleri tarihli atanmış bir göreviniz varken veya hesabınız askıdayken silemezsiniz. Silindiğinde açık ilanlarınız iptal edilir, ad, telefon, baro, sicil ve fotoğraf gibi kişisel bilgileriniz silinir; puan ve şikayet kayıtları kimliğiniz olmadan saklanır.";

async function klasoruSil(supabase, bucket, klasor) {
  const { data, error } = await supabase.storage.from(bucket).list(klasor);
  if (error) throw error;
  const yollar = (data || []).filter((dosya) => dosya?.name).map((dosya) => `${klasor}/${dosya.name}`);
  if (!yollar.length) return;
  const { error: silHatasi } = await supabase.storage.from(bucket).remove(yollar);
  if (silHatasi) throw silHatasi;
}

export function Profil() {
  const { secenekler: kategoriSecenekleri } = useKategoriler();
  const router = useRouter();
  const [veri, setVeri] = useState(null);
  const [eposta, setEposta] = useState("");
  const [kategoriler, setKategoriler] = useState([]);
  const [sehirler, setSehirler] = useState([]);
  const [adliyeler, setAdliyeler] = useState([]);
  const [il, setIl] = useState("");
  const [bolge, setBolge] = useState([]);
  const [hata, setHata] = useState("");
  const [kaydediyor, setKaydediyor] = useState(false);
  const [epostaKayit, setEpostaKayit] = useState(false);
  const [sil, setSil] = useState(false);
  const [silOnay, setSilOnay] = useState("");
  const [siliyor, setSiliyor] = useState(false);

  useEffect(() => {
    let iptal = false;
    const supabase = createClient();
    Promise.all([
      supabase.auth.getUser(),
      supabase.from("cities").select("slug, name").order("name", { ascending: true }),
      supabase.from("adliyeler").select("kod, ad, il_kod, sira, teyit_bekliyor").eq("aktif", true).order("sira", { ascending: true }),
    ]).then(async ([oturum, sehir, adliye]) => {
      if (iptal) return;
      setSehirler(sehir.data || []);
      setAdliyeler(adliye.data || []);
      const uid = oturum.data.user?.id;
      if (!uid) return;
      const { data, error } = await supabase.from("users").select("*").eq("id", uid).maybeSingle();
      if (iptal) return;
      if (error) setHata(hataMesaji(error));
      else if (data) {
        setVeri(data);
        setEposta(data.email || "");
        setKategoriler(Array.isArray(data.kategoriler) ? data.kategoriler : []);
        setIl(data.il || "");
        setBolge(Array.isArray(data.adliyeler) ? data.adliyeler.slice(0, 3) : []);
      }
    });
    return () => { iptal = true; };
  }, []);

  const adliyeSecenek = adliyeler.filter((satir) => satir.il_kod === il);

  async function tercihKaydet() {
    setKaydediyor(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("users").update({
        kategoriler,
        fotograf_url: veri?.fotograf_url || null,
      }).eq("id", user.id);
      if (error) throw error;
      if (!il) {
        toast.error("İl seçin");
        return;
      }
      const { error: bolgeHata } = await supabase.rpc("bolge_guncelle", { p_il: il, p_adliyeler: bolge.filter(Boolean) });
      if (bolgeHata) throw bolgeHata;
      toast.success("Profil bilgileriniz güncellendi");
    } catch (error) {
      toast.error(hataMesaji(error));
    } finally {
      setKaydediyor(false);
    }
  }

  async function epostaKaydet() {
    const adres = eposta.trim().toLowerCase();
    if (!/\S+@\S+\.\S+/.test(adres)) {
      toast.error("Geçerli bir e-posta adresi girin");
      return;
    }
    setEpostaKayit(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("users").update({ email: adres }).eq("id", user.id);
      if (error) throw error;
      setVeri((once) => ({ ...once, email: adres }));
      toast.success("Profil bilgileriniz güncellendi");
    } catch (error) {
      toast.error(hataMesaji(error));
    } finally {
      setEpostaKayit(false);
    }
  }

  async function fotoSec(dosya) {
    if (!dosya || !veri) return;
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Kullanıcı oturumu bulunamadı");
      const onceki = veri.fotograf_url;
      if (onceki && onceki.includes("/storage/v1/object/public/avatars/")) {
        const marker = "/storage/v1/object/public/avatars/";
        const yol = onceki.slice(onceki.indexOf(marker) + marker.length);
        if (yol) await supabase.storage.from("avatars").remove([yol]);
      }
      const ext = (dosya.name.split(".").pop() || "jpg").toLowerCase();
      const contentType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
      const filePath = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, dosya, { contentType });
      if (uploadError) throw uploadError;
      const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const { error } = await supabase.from("users").update({ fotograf_url: publicData.publicUrl }).eq("id", user.id);
      if (error) throw error;
      setVeri((once) => ({ ...once, fotograf_url: publicData.publicUrl }));
      toast.success("Profil fotoğrafı güncellendi");
    } catch (error) {
      toast.error(error.message === "Kullanıcı oturumu bulunamadı" ? error.message : (error.message?.includes("Fotoğraf") ? error.message : hataMesaji(error) || "Fotoğraf yüklenirken bir hata oluştu"));
    }
  }

  async function hesabiSil() {
    if (silOnay !== "SİL" || siliyor) return;
    setSiliyor(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Oturum gerekli");
      await klasoruSil(supabase, "kimlikler", user.id);
      await klasoruSil(supabase, "avatars", user.id);
      const { data, error } = await supabase.functions.invoke("hesap-sil");
      if (error || data?.error) {
        let mesaj = error?.message || data?.error;
        if (error?.context && typeof error.context.json === "function") {
          try {
            const body = await error.context.json();
            if (body?.error) mesaj = body.error;
          } catch (okuma) {
            mesaj = okuma.message || mesaj;
          }
        }
        throw new Error(mesaj || "Bir hata oluştu, lütfen tekrar deneyin.");
      }
      await supabase.auth.signOut();
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(hataMesaji(error));
      setSiliyor(false);
    }
  }

  function kategoriDegistir(kod) {
    setKategoriler((onceki) => (onceki.includes(kod) ? onceki.filter((k) => k !== kod) : [...onceki, kod]));
  }

  function adliyeDegistir(kod) {
    if (bolge.includes(kod)) {
      setBolge(bolge.filter((k) => k !== kod));
      return;
    }
    if (bolge.length >= 3) {
      toast.error("En fazla 3 adliye seçebilirsiniz");
      return;
    }
    setBolge([...bolge, kod]);
  }

  const kimlik = [veri?.baro, veri?.tbb_sicil ? `Sicil ${veri.tbb_sicil}` : ""].filter(Boolean).join(" · ");
  const puan = Number(veri?.puan_ortalama);

  if (!veri && !hata) {
    return (
      <ListeSayfa>
        <div className="mx-auto w-full max-w-3xl space-y-4" aria-busy="true">
          <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      </ListeSayfa>
    );
  }

  return (
    <ListeSayfa>
      <div className="mx-auto w-full max-w-3xl">
        <PageHeader baslik="Profil" aciklama="Hesap bilgileriniz ve görev tercihleriniz" />
        {hata ? <p role="alert" className="mb-4 rounded-lg border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger">{hata}</p> : null}

        <div className="space-y-5">
          <section className="flex flex-col gap-4 rounded-xl border bg-background p-5 sm:flex-row sm:items-center">
            <label className="group relative size-20 shrink-0 cursor-pointer" title="Fotoğrafı değiştir">
              <span className="block size-20 overflow-hidden rounded-full ring-1 ring-border">
                {veri?.fotograf_url ? (
                  <img src={veri.fotograf_url} alt="" className="size-20 object-cover" />
                ) : (
                  <span className="flex size-20 items-center justify-center bg-navy text-2xl font-semibold text-white">
                    {(veri?.ad_soyad || "?").slice(0, 1)}
                  </span>
                )}
              </span>
              <span className="absolute -right-0.5 -bottom-0.5 flex size-8 items-center justify-center rounded-full border-2 border-background bg-navy text-white transition-colors group-hover:bg-ink">
                <Camera size={15} weight="fill" />
              </span>
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Profil fotoğrafını değiştir" onChange={(e) => fotoSec(e.target.files?.[0])} />
            </label>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xl font-semibold">{veri?.ad_soyad}</p>
              {kimlik ? <p className="truncate text-sm text-muted-foreground">{kimlik}</p> : null}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
                {Number.isFinite(puan) && puan > 0 ? (
                  <span className="inline-flex items-center gap-1 font-medium text-foreground">
                    <Star size={14} weight="fill" className="text-accent-gold" />
                    {puan.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}
                  </span>
                ) : null}
                <span className="text-muted-foreground">
                  Bilgilerinizde hata mı var? <Link href="/app/destek?yeni=1" className="font-medium text-navy underline-offset-4 hover:underline">Bize yazın</Link>
                </span>
              </div>
            </div>
          </section>

          <Bolum id="bolge" baslik="Görev Tercihleri" aciklama="İlgilendiğiniz iş türleri ve çalıştığınız bölge">
            <div className="space-y-5 p-5">
              <div className="space-y-2.5">
                <p className="text-sm font-medium">İş türleri</p>
                <div className="flex flex-wrap gap-2">
                  {kategoriSecenekleri.map((k) => {
                    const secili = kategoriler.includes(k.value);
                    return (
                      <button key={k.value} type="button" aria-pressed={secili} onClick={() => kategoriDegistir(k.value)} className={cn("inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors", secili ? "border-navy bg-navy text-white" : "border-input bg-background text-foreground hover:border-navy/40 hover:bg-muted")}>
                        {secili ? <Check size={14} weight="bold" /> : null}
                        {k.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid content-start gap-1.5">
                  <span className="text-sm font-medium">İl</span>
                  <Select value={il || null} onValueChange={(deger) => { setIl(deger || ""); setBolge([]); }}>
                    <SelectTrigger className="h-10 w-full rounded-lg bg-white text-sm">
                      <SelectValue>{(deger) => sehirler.find((s) => s.slug === deger)?.name || (sehirler.length ? "İl seçin" : "İller yükleniyor...")}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {sehirler.map((s) => <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <AdliyeSecimi il={il} secenekler={adliyeSecenek} secili={bolge} onDegistir={adliyeDegistir} />
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 border-t bg-muted/40 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13px] text-muted-foreground">Bölge 24 saatte bir değiştirilebilir.</p>
              <Button type="button" className="h-10 px-5 sm:h-9" disabled={kaydediyor} onClick={tercihKaydet}>{kaydediyor ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}</Button>
            </div>
          </Bolum>

          <Bolum baslik="İletişim" aciklama="Size ulaşılacak bilgiler">
            <div className="divide-y">
              <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">Telefon</p>
                  <p className="text-sm text-muted-foreground">{veri?.telefon || "—"}</p>
                </div>
                <Link href="/app/destek?yeni=1" className="text-[13px] font-medium text-navy underline-offset-4 hover:underline">Değiştirmek için bize yazın</Link>
              </div>
              <div className="grid gap-1.5 px-5 py-4">
                <label htmlFor="profil-eposta" className="text-sm font-medium">E-posta</label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input id="profil-eposta" type="email" value={eposta} autoComplete="email" className="h-10 rounded-lg bg-white text-sm" onChange={(e) => setEposta(e.target.value)} />
                  <Button type="button" variant="outline" className="h-10 shrink-0 bg-white px-5" disabled={epostaKayit || eposta.trim().toLowerCase() === (veri?.email || "")} onClick={epostaKaydet}>{epostaKayit ? "Kaydediliyor…" : "Güncelle"}</Button>
                </div>
              </div>
            </div>
          </Bolum>

          <Bolum baslik="Hesap">
            <div className="divide-y">
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-sm font-medium">Oturumu kapat</p>
                  <p className="text-[13px] text-muted-foreground">Bu cihazdaki oturumunuz sonlanır.</p>
                </div>
                <Button type="button" variant="outline" className="h-9 shrink-0 bg-white" onClick={async () => {
                  await createClient().auth.signOut();
                  router.replace("/giris");
                  router.refresh();
                }}>
                  <SignOut size={16} />
                  Çıkış Yap
                </Button>
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-destructive">Hesabı sil</p>
                  <p className="text-[13px] text-muted-foreground">Hesabınız ve kişisel bilgileriniz kalıcı olarak silinir.</p>
                </div>
                <Button type="button" variant="outline" className="h-9 shrink-0 border-destructive/40 bg-white text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => { setSilOnay(""); setSil(true); }}>
                  <Trash size={16} />
                  Sil
                </Button>
              </div>
            </div>
          </Bolum>
        </div>
      </div>

      {sil ? (
        <div role="dialog" className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
          <div className="w-full max-w-md space-y-4 rounded-card bg-surface p-6">
            <h2 className="text-[17px] font-semibold">Hesabımı Sil</h2>
            <p className="text-[14px] leading-relaxed">Hesabınız ve kişisel bilgileriniz silinir, geri alınamaz.</p>
            <p className="text-[14px] leading-relaxed">{SILME}</p>
            <Field label="Onaylamak için SİL yazın" id="sil-onay" value={silOnay} onChange={(e) => setSilOnay(e.target.value)} autoCapitalize="characters" />
            <OnayButonu type="button" className="w-full bg-danger hover:bg-danger" disabled={silOnay !== "SİL" || siliyor} onClick={hesabiSil}>
              {siliyor ? "Siliniyor…" : "Hesabımı Sil"}
            </OnayButonu>
            <OnayButonu type="button" variant="secondary" className="w-full" onClick={() => setSil(false)}>Vazgeç</OnayButonu>
          </div>
        </div>
      ) : null}
    </ListeSayfa>
  );
}

function Bolum({ id, baslik, aciklama, children }) {
  return (
    <section id={id} className="scroll-mt-6 overflow-hidden rounded-xl border bg-background">
      <div className="border-b px-5 py-4">
        <h2 className="text-base font-semibold">{baslik}</h2>
        {aciklama ? <p className="text-[13px] text-muted-foreground">{aciklama}</p> : null}
      </div>
      {children}
    </section>
  );
}

function AdliyeSecimi({ il, secenekler, secili, onDegistir }) {
  const ad = (kod) => secenekler.find((satir) => satir.kod === kod)?.ad || kod;
  return (
    <div className="grid content-start gap-1.5">
      <span className="flex items-baseline justify-between text-sm font-medium">
        Adliyeler
        <span className="text-xs font-normal text-muted-foreground">{secili.length}/3</span>
      </span>
      <Popover>
        <PopoverTrigger type="button" disabled={!il} className="flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-input bg-white px-3 text-left text-sm disabled:cursor-not-allowed disabled:opacity-50">
          <span className="truncate text-muted-foreground">{il ? (secili.length >= 3 ? "En fazla 3 adliye" : "Adliye ekleyin") : "Önce il seçin"}</span>
          <CaretDown size={16} className="shrink-0 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent className="w-(--anchor-width) p-2" align="start">
          <div className="max-h-60 space-y-1 overflow-y-auto">
            {secenekler.map((satir) => (
              <label key={satir.kod} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                <input type="checkbox" checked={secili.includes(satir.kod)} onChange={() => onDegistir(satir.kod)} className="size-4 accent-primary" />
                <span>{satir.ad}{satir.teyit_bekliyor ? " (teyit bekliyor)" : ""}</span>
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {secili.length ? (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {secili.map((kod) => (
            <span key={kod} className="inline-flex h-7 items-center gap-1 rounded-full bg-navy/[0.07] pr-1 pl-3 text-[13px] font-medium text-navy">
              {ad(kod)}
              <button type="button" aria-label={`${ad(kod)} kaldır`} onClick={() => onDegistir(kod)} className="flex size-5 cursor-pointer items-center justify-center rounded-full hover:bg-navy/10">
                <X size={12} weight="bold" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
