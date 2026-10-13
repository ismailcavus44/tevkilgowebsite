"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "cn";
import { Button as OnayButonu } from "@/components/Button";
import { Field } from "@/components/Field";
import { useKategoriler } from "@/components/uygulama/ortak";
import { ListCard, ListeSayfa, Toolbar } from "@/components/list-layout";
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
  const [sekme, setSekme] = useState("tercih");
  const [hata, setHata] = useState("");
  const [bilgi, setBilgi] = useState("");
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
    setHata("");
    setBilgi("");
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
        setHata("İl seçin");
        return;
      }
      const { error: bolgeHata } = await supabase.rpc("bolge_guncelle", { p_il: il, p_adliyeler: bolge.filter(Boolean) });
      if (bolgeHata) throw bolgeHata;
      setBilgi("Profil bilgileriniz güncellendi");
    } catch (error) {
      setHata(hataMesaji(error));
    } finally {
      setKaydediyor(false);
    }
  }

  async function epostaKaydet() {
    const adres = eposta.trim().toLowerCase();
    if (!/\S+@\S+\.\S+/.test(adres)) {
      setBilgi("");
      setHata("Geçerli bir e-posta adresi girin");
      return;
    }
    setHata("");
    setBilgi("");
    setEpostaKayit(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("users").update({ email: adres }).eq("id", user.id);
      if (error) throw error;
      setVeri((once) => ({ ...once, email: adres }));
      setBilgi("Profil bilgileriniz güncellendi");
    } catch (error) {
      setHata(hataMesaji(error));
    } finally {
      setEpostaKayit(false);
    }
  }

  async function fotoSec(dosya) {
    if (!dosya || !veri) return;
    setHata("");
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
      setBilgi("Profil fotoğrafı güncellendi");
    } catch (error) {
      setHata(error.message === "Kullanıcı oturumu bulunamadı" ? error.message : (error.message?.includes("Fotoğraf") ? error.message : hataMesaji(error) || "Fotoğraf yüklenirken bir hata oluştu"));
    }
  }

  async function hesabiSil() {
    if (silOnay !== "SİL" || siliyor) return;
    setSiliyor(true);
    setHata("");
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
      setHata(hataMesaji(error));
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
      setHata("En fazla 3 adliye seçebilirsiniz");
      return;
    }
    setHata("");
    setBolge([...bolge, kod]);
  }

  const kimlik = [veri?.baro, veri?.tbb_sicil ? `Sicil ${veri.tbb_sicil}` : ""].filter(Boolean).join(" · ");
  const adliyeYazi = bolge.map((kod) => adliyeSecenek.find((satir) => satir.kod === kod)?.ad || kod).filter(Boolean).join(", ");

  if (!veri && !hata) {
    return (
      <ListeSayfa>
        <div className="h-24 animate-pulse rounded-lg bg-muted" aria-busy="true" />
      </ListeSayfa>
    );
  }

  return (
    <ListeSayfa>
      <div className="mb-6 flex flex-col items-start gap-3 md:flex-row md:items-center">
        <label className="group relative size-14 shrink-0 cursor-pointer overflow-hidden rounded-full">
          {veri?.fotograf_url ? (
            <img src={veri.fotograf_url} alt="" className="size-14 object-cover" />
          ) : (
            <span className="flex size-14 items-center justify-center bg-primary text-lg font-semibold text-primary-foreground">
              {(veri?.ad_soyad || "?").slice(0, 1)}
            </span>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">Değiştir</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => fotoSec(e.target.files?.[0])} />
        </label>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{veri?.ad_soyad}</p>
          {kimlik ? <p className="truncate text-sm text-muted-foreground">{kimlik}</p> : null}
          <p className="text-[13px] text-muted-foreground">Düzeltme için <Link href="/app/destek?yeni=1" className="underline underline-offset-4">Bize Yazın</Link></p>
        </div>
      </div>
      {hata ? <p role="alert" className="mb-4 text-sm text-destructive">{hata}</p> : null}
      {bilgi ? <p className="mb-4 text-sm text-muted-foreground">{bilgi}</p> : null}
      <Toolbar
        sekmeler={[
          { value: "tercih", label: "Görev tercihleri", adet: 0 },
          { value: "iletisim", label: "İletişim", adet: 0 },
          { value: "hesap", label: "Hesap", adet: 0 },
        ]}
        sekme={sekme}
        onSekme={setSekme}
      />
      {sekme === "tercih" ? (
        <div id="bolge">
          <ListCard>
            <div className="space-y-4 p-4">
              <div className="flex flex-nowrap gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {kategoriSecenekleri.map((k) => {
                  const secili = kategoriler.includes(k.value);
                  return (
                    <button key={k.value} type="button" aria-pressed={secili} onClick={() => kategoriDegistir(k.value)} className={cn("h-8 shrink-0 cursor-pointer rounded-full border px-3 text-sm", secili ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background")}>
                      {k.label}
                    </button>
                  );
                })}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <span className="text-sm font-medium">İl</span>
                  <Select value={il || null} onValueChange={(deger) => { setIl(deger || ""); setBolge([]); }}>
                    <SelectTrigger className="h-9 w-full rounded-md bg-white text-sm">
                      <SelectValue>{(deger) => sehirler.find((s) => s.slug === deger)?.name || (sehirler.length ? "İl seçin" : "İller yükleniyor...")}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {sehirler.map((s) => <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <AdliyeSecimi il={il} yazi={adliyeYazi} secenekler={adliyeSecenek} secili={bolge} onDegistir={adliyeDegistir} />
              </div>
            </div>
          </ListCard>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Bölge 24 saatte bir değiştirilebilir</p>
            <Button type="button" disabled={kaydediyor} onClick={tercihKaydet}>{kaydediyor ? "Kaydediliyor…" : "Kaydet"}</Button>
          </div>
        </div>
      ) : null}
      {sekme === "iletisim" ? (
        <ListCard>
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            <div className="grid content-start gap-1.5">
              <span className="text-sm font-medium">Telefon</span>
              <div className="flex h-9 flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-sm">{veri?.telefon || "—"}</span>
                <Link href="/app/destek?yeni=1" className="text-sm text-muted-foreground underline-offset-4 hover:underline">Değişiklik için Bize Yazın</Link>
              </div>
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="profil-eposta" className="text-sm font-medium">E-posta</label>
              <div className="flex items-center gap-2">
                <Input id="profil-eposta" type="email" value={eposta} autoComplete="email" className="h-9 rounded-md bg-white text-sm" onChange={(e) => setEposta(e.target.value)} />
                <Button type="button" disabled={epostaKayit} onClick={epostaKaydet}>{epostaKayit ? "Kaydediliyor…" : "Kaydet"}</Button>
              </div>
            </div>
          </div>
        </ListCard>
      ) : null}
      {sekme === "hesap" ? (
        <div className="flex w-full flex-col items-stretch gap-3 md:w-[200px] [&_button]:h-11">
          <Button type="button" variant="outline" className="w-full bg-white" onClick={async () => {
            await createClient().auth.signOut();
            router.replace("/giris");
            router.refresh();
          }}>
            Çıkış Yap
          </Button>
          <Button type="button" variant="outline" className="w-full border-destructive bg-white text-destructive hover:bg-destructive/10" onClick={() => { setSilOnay(""); setSil(true); }}>
            Hesabımı sil
          </Button>
        </div>
      ) : null}

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

function AdliyeSecimi({ il, yazi, secenekler, secili, onDegistir }) {
  return (
    <div className="grid gap-1.5">
      <span className="text-sm font-medium">Adliyeler</span>
      <Popover>
        <PopoverTrigger type="button" disabled={!il} className="flex h-9 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-white px-3 text-left text-sm disabled:cursor-not-allowed disabled:opacity-50">
          <span className={cn("truncate", !yazi && "text-muted-foreground")}>{yazi || (il ? "Adliye seçin" : "Önce il seçin")}</span>
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
    </div>
  );
}
