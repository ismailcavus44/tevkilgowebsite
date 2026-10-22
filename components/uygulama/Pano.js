"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Briefcase, CalendarBlank, CalendarCheck, CaretRight, ChatCircleText, Hourglass, ListBullets, MagnifyingGlass, Megaphone, PaperPlaneTilt, Plus, Question, Star, UserCheck, UsersThree } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modlar } from "@/components/uygulama/Modlar";
import { kategoriAd, puanlamaKayitlari, useKategoriler } from "@/components/uygulama/ortak";
import { basvurulmamisIlanSayisi } from "@/lib/acik-ilanlar";
import { dogrulamaUyari, dogrulananHesapMi } from "@/lib/dogrulama-kontrol";
import { hataMesaji } from "@/lib/hata-mesaji";
import { createClient } from "@/lib/supabase/client";
import { bugunAraligi, gunBasligi, gunEkle, saatYazi, ymdIstanbul } from "@/lib/tarih";
import { StatusBadge, durumAnahtari } from "@/components/uygulama/StatusBadge";
import { useOzellikler } from "@/components/uygulama/Ozellikler";

export function Pano() {
  useKategoriler();
  const router = useRouter();
  const { modlarAktif } = useOzellikler();
  const [ad, setAd] = useState("");
  const [fotograf, setFotograf] = useState(null);
  const [gorevSayisi, setGorevSayisi] = useState(0);
  const [ustlenilen, setUstlenilen] = useState(0);
  const [acikSayi, setAcikSayi] = useState(0);
  const [bugunSayi, setBugunSayi] = useState(0);
  const [yaklasan, setYaklasan] = useState([]);
  const [adliyeSayisi, setAdliyeSayisi] = useState(0);
  const [adliyeAdlari, setAdliyeAdlari] = useState({});
  const [basvurulan, setBasvurulan] = useState(null);
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(true);
  const [simdi, setSimdi] = useState(0);
  const [kayitlar, setKayitlar] = useState([]);
  const [yeniBes, setYeniBes] = useState([]);
  const [toplamaDk, setToplamaDk] = useState(5);
  const [profil, setProfil] = useState(null);
  const [bekleyenPuan, setBekleyenPuan] = useState([]);
  const [musait, setMusait] = useState([]);

  const yukle = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: userData, error: kullaniciHatasi } = await supabase
      .from("users")
      .select("ad_soyad, adliyeler, fotograf_url, il")
      .eq("id", user.id)
      .single();
    if (kullaniciHatasi) throw kullaniciHatasi;
    setFotograf(userData?.fotograf_url || null);
    setAd(userData?.ad_soyad || user.user_metadata?.ad_soyad || "");
    const bugun = bugunAraligi();
    const yirmiDort = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const [olusturan, secilen, acik, bugunAdet, yakin, puanlama] = await Promise.all([
      supabase.from("gorevlerim").select("id", { count: "exact", head: true }).eq("rol", "olusturan"),
      supabase.from("gorevlerim").select("id", { count: "exact", head: true }).eq("rol", "basvuran").eq("basvuru_durumu", "secildi"),
      basvurulmamisIlanSayisi(supabase, userData?.adliyeler || []),
      supabase.from("acik_gorevler").select("id", { count: "exact", head: true }).gte("tarih_saat", bugun.gte).lt("tarih_saat", bugun.lt),
      supabase.from("acik_gorevler").select("*").lt("tarih_saat", yirmiDort).order("tarih_saat", { ascending: true }).limit(3),
      supabase.rpc("puanlama_bekleyen_gorevlerim"),
    ]);
    const sorguHatasi = bugunAdet.error || yakin.error || olusturan.error || secilen.error || puanlama.error;
    if (sorguHatasi) throw sorguHatasi;
    setGorevSayisi(olusturan.count || 0);
    setUstlenilen(secilen.count || 0);
    setAcikSayi(acik || 0);
    setBugunSayi(bugunAdet.count || 0);
    setAdliyeSayisi((userData?.adliyeler || []).length);
    setYaklasan(yakin.data || []);
    setBekleyenPuan(puanlamaKayitlari(puanlama.data));
    const kodlar = [...new Set((yakin.data || []).map((ilan) => ilan.adliye).filter(Boolean))];
    if (kodlar.length) {
      const { data: adlar } = await supabase.from("adliyeler").select("kod, ad").in("kod", kodlar);
      setAdliyeAdlari(Object.fromEntries((adlar || []).map((satir) => [satir.kod, satir.ad])));
    }
    setSimdi(Date.now());
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
      const [liste, ayar, bes, hesap, musaitSonuc] = await Promise.all([
        supabase.from("gorevlerim").select("*").order("tarih_saat", { ascending: true }),
        supabase.from("app_ayarlar").select("deger").eq("anahtar", "basvuru_toplama_dakika").maybeSingle(),
        supabase.from("acik_gorevler").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("users").select("*").eq("id", user.id).maybeSingle(),
        supabase.rpc("aktif_modlar", { p_il: userData?.il || null, p_adliye: null }),
      ]);
      if (liste.error) throw liste.error;
      if (bes.error) throw bes.error;
      if (musaitSonuc.error) throw musaitSonuc.error;
      const sayi = Number(ayar.data?.deger);
      if (Number.isFinite(sayi) && sayi >= 0) setToplamaDk(sayi);
      setKayitlar(liste.data || []);
      setYeniBes(bes.data || []);
      setProfil(hesap.data || null);
      const simdiMs = Date.now();
      const musaitListe = (musaitSonuc.data || []).filter((kisi) => kisi?.bitis && new Date(kisi.bitis).getTime() > simdiMs).slice(0, 5);
      setMusait(musaitListe);
      const kodlar2 = [...new Set([...(liste.data || []), ...(bes.data || []), ...musaitListe].map((satir) => satir.adliye).filter(Boolean))];
      if (kodlar2.length) {
        const { data: adlar } = await supabase.from("adliyeler").select("kod, ad").in("kod", kodlar2);
        setAdliyeAdlari((onceki) => ({ ...onceki, ...Object.fromEntries((adlar || []).map((satir) => [satir.kod, satir.ad])) }));
      }
    }
  }, []);

  useEffect(() => {
    let iptal = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pano sunucudan gelir
    yukle()
      .catch((error) => { if (!iptal) setHata(hataMesaji(error)); })
      .finally(() => { if (!iptal) setYukleniyor(false); });
    return () => { iptal = true; };
  }, [yukle]);

  useEffect(() => {
    const yenile = () => { yukle().catch((error) => setHata(hataMesaji(error))); };
    window.addEventListener("ilanlar-yenile", yenile);
    return () => window.removeEventListener("ilanlar-yenile", yenile);
  }, [yukle]);

  async function basvur(gorev) {
    if (!(await dogrulananHesapMi())) return dogrulamaUyari(router);

    setBasvurulan(gorev.id);
    setHata("");
    try {
      const { error } = await createClient().rpc("gorev_basvur", { p_task_id: gorev.id });
      if (error) throw error;
      toast.success("Başvurunuz iletildi");
      window.dispatchEvent(new Event("ilanlar-yenile"));
    } catch (error) {
      const mesaj = hataMesaji(error);
      toast.error(mesaj);
      setHata(mesaj);
    } finally {
      setBasvurulan(null);
    }
  }

  const adParca = (ad || "").trim().split(" ")[0];
  const tarih = simdi ? new Date(simdi).toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long", timeZone: "Europe/Istanbul" }) : "";

  return (
    <>
    <div className="-mx-4 h-full overflow-y-auto bg-canvas md:hidden">
      <div className="space-y-6 px-4 pt-5 pb-28">
        <PuanSeridi liste={bekleyenPuan} />
        <header className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            {tarih ? <p className="text-[13px] font-medium text-muted-foreground">{tarih}</p> : null}
            <h1 className="truncate text-[26px] leading-tight font-bold tracking-tight">{adParca ? `Merhaba, ${adParca}` : "Merhaba"}</h1>
          </div>
          <Link href="/app/profil" aria-label="Profil" className="inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy text-white ring-2 ring-white shadow-sm">
            {fotograf ? (
              <img src={fotograf} alt="" className="size-12 object-cover" />
            ) : (
              <span className="text-base font-semibold">{(ad || "?").slice(0, 1)}</span>
            )}
          </Link>
        </header>
        {hata ? <p role="alert" className="rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-[14px] text-danger">{hata}</p> : null}

        <Link href="/app/ilanlar" className="relative block overflow-hidden rounded-2xl bg-navy p-5 text-white shadow-[0_12px_30px_-12px_rgb(30_58_95/0.6)] active:scale-[0.99]">
          <span aria-hidden="true" className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-white/[0.06]" />
          <span aria-hidden="true" className="pointer-events-none absolute -right-4 -bottom-16 size-32 rounded-full bg-accent-gold/20" />
          <span className="relative flex items-end justify-between gap-4">
            <span>
              <span className="block text-[13px] font-medium text-on-ink">Bölgende açık ilan</span>
              <span className="mt-1 block text-[44px] leading-none font-bold tabular-nums">{yukleniyor ? "–" : acikSayi}</span>
              <span className="mt-2 block text-[13px] text-on-ink">
                {yukleniyor ? "\u00a0" : bugunSayi === 0 ? "Bugün için ilan yok" : `${bugunSayi} tanesi bugün`}
              </span>
            </span>
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15">
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </span>
          </span>
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <Sayac href="/app/gorevlerim" ikon={Briefcase} etiket="Oluşturduğum" deger={yukleniyor ? "–" : gorevSayisi} />
          <Sayac href="/app/basvurularim" ikon={UserCheck} etiket="Üstlendiğim" deger={yukleniyor ? "–" : ustlenilen} />
        </div>

        {modlarAktif ? <div id="modlar" className="scroll-mt-16"><Modlar kartlar /></div> : null}

        {yaklasan.length > 0 ? (
          <section>
            <BolumBasligi baslik="Yaklaşan İlanlar" href="/app/ilanlar" />
            <ul className="overflow-hidden rounded-2xl border border-line bg-surface">
              {yaklasan.map((ilan) => (
                <li key={ilan.id} className="border-b border-line last:border-b-0">
                  <IlanSatiri ilan={ilan} simdi={simdi} adliye={adliyeSayisi > 1 ? (adliyeAdlari[ilan.adliye] || ilan.adliye) : ""} mesgul={basvurulan === ilan.id} onBasvur={() => basvur(ilan)} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <BolumBasligi baslik="Hızlı Erişim" />
          <nav className="overflow-hidden rounded-2xl border border-line bg-surface">
            {modlarAktif ? <Erisim href="/app/avukat-ara" ikon={MagnifyingGlass} baslik="Müsait Meslektaşlar" alt="İlinizde modu açık avukatlar" /> : null}
            <Erisim href="/app/ilanlar" ikon={ListBullets} baslik="İlanlar" alt="Bölgenizdeki açık ilanlar" />
            <Erisim href="/app/destek" ikon={ChatCircleText} baslik="Destek" alt="Soru, şikayet ve önerileriniz" />
            <Erisim href="/app/sss" ikon={Question} baslik="Nasıl kullanılır?" alt="Sık sorulan sorular" son />
          </nav>
        </section>
      </div>
    </div>
    <MasaPano
      ad={ad}
      simdi={simdi}
      yukleniyor={yukleniyor}
      hata={hata}
      kayitlar={kayitlar}
      yeniBes={yeniBes}
      toplamaDk={toplamaDk}
      profil={profil}
      adliyeAdlari={adliyeAdlari}
      bekleyenPuan={bekleyenPuan}
      musait={musait}
      acikSayi={acikSayi}
      bugunSayi={bugunSayi}
    />
    </>
  );
}

function MasaPano({ ad, simdi, yukleniyor, hata, kayitlar, yeniBes, toplamaDk, profil, adliyeAdlari, bekleyenPuan, musait, acikSayi, bugunSayi }) {
  const { modlarAktif } = useOzellikler();
  const soyad = (ad || "").trim().split(/\s+/).filter(Boolean).slice(-1)[0];
  const saat = simdi ? Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Istanbul", hour: "2-digit", hourCycle: "h23" }).format(new Date(simdi))) : 9;
  const selam = saat < 12 ? "Günaydın" : saat < 18 ? "İyi günler" : "İyi akşamlar";
  const tarih = simdi ? new Date(simdi).toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long", timeZone: "Europe/Istanbul" }) : "";
  const bugun = simdi ? ymdIstanbul(new Date(simdi)) : "";
  const hafta = kayitlar.filter((gorev) => {
    if (!gorev.tarih_saat || !bugun) return false;
    const gun = istanbulParcaGun(gorev.tarih_saat);
    return gun >= bugun && gun <= gunEkle(bugun, 6);
  });
  const gruplar = [];
  hafta.forEach((gorev) => {
    const gun = istanbulParcaGun(gorev.tarih_saat);
    const son = gruplar[gruplar.length - 1];
    if (son && son.gun === gun) son.data.push(gorev);
    else gruplar.push({ gun, baslik: gunBasligi(gorev.tarih_saat), data: [gorev] });
  });
  const bugunGorev = kayitlar.filter((gorev) => istanbulParcaGun(gorev.tarih_saat) === bugun).length;
  const secim = kayitlar.filter((gorev) => durumAnahtari(gorev, toplamaDk, simdi) === "secim");
  const bekleyen = kayitlar.filter((gorev) => gorev.rol === "basvuran" && gorev.basvuru_durumu === "bekliyor").length;
  const ort = profil?.puan_ortalama;
  const puan = ort != null && Number(ort) > 0 ? Number(ort).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "—";
  const deger = (n) => (yukleniyor ? "–" : n);
  const ilanAc = () => window.dispatchEvent(new Event("ilan-ac"));

  return (
    <div className="-mx-8 hidden h-full overflow-y-auto bg-background md:block">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-8 py-8">
        <PuanSeridi liste={bekleyenPuan} />
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            {tarih ? <p className="text-[13px] font-medium text-muted-foreground">{tarih}</p> : null}
            <h1 className="text-[28px] leading-tight font-bold tracking-tight">{soyad ? `${selam}, Av. ${soyad}` : selam}</h1>
          </div>
          <Button type="button" className="h-10 gap-2 rounded-xl bg-navy px-4 font-semibold text-white shadow-[0_6px_16px_-6px_rgb(30_58_95/0.6)] hover:bg-ink" onClick={ilanAc}>
            <Plus size={16} weight="bold" />
            İlan Aç
          </Button>
        </header>
        {hata ? <p role="alert" className="rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger">{hata}</p> : null}

        {secim.length ? (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-accent-gold/40 bg-[#fbf6e7] px-5 py-3.5">
            <p className="flex items-center gap-2.5 text-sm font-medium">
              <Hourglass size={18} weight="fill" className="text-accent-gold" aria-hidden="true" />
              {secim.length} ilanınızda başvurular toplandı, seçim yapabilirsiniz
            </p>
            <Link href={`/app/gorevlerim/${secim[0].id}`} className="inline-flex h-9 shrink-0 items-center rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-ink">Seçim yap</Link>
          </div>
        ) : null}

        <div className="grid grid-cols-3 gap-4 lg:grid-cols-5">
          <Sayac vurgu href="/app/ilanlar" ikon={Megaphone} etiket={yukleniyor || bugunSayi === 0 ? "Bölgende açık ilan" : `Açık ilan · ${bugunSayi} bugün`} deger={deger(acikSayi)} />
          <Sayac href="/app/gorevlerim?gun=bugun" ikon={CalendarCheck} etiket="Bugünkü görevler" deger={deger(bugunGorev)} />
          <Sayac href="/app/gorevlerim?sekme=secim" ikon={Hourglass} etiket="Seçim bekleyen" deger={deger(secim.length)} />
          <Sayac href="/app/basvurularim?sekme=bekliyor" ikon={PaperPlaneTilt} etiket="Bekleyen başvuru" deger={deger(bekleyen)} />
          <Sayac href="/app/profil" ikon={Star} etiket="Puanınız" deger={yukleniyor ? "–" : puan} />
        </div>

        <div className={modlarAktif ? "grid items-start gap-4 lg:grid-cols-3" : "grid items-start gap-4"}>
          <div className={modlarAktif ? "flex flex-col gap-4 lg:col-span-2" : "flex flex-col gap-4"}>
            <ListeKarti baslik="Bölgendeki Yeni İlanlar" href="/app/ilanlar">
              {yukleniyor ? <SatirIskelet /> : null}
              {!yukleniyor && !yeniBes.length ? (
                <BosKart ikon={Megaphone} baslik="Bölgenizde açık ilan yok" aciklama="Yeni ilan açıldığında burada listelenir.">
                  <Button className="h-9 gap-1.5 bg-navy text-white hover:bg-ink" onClick={ilanAc}>
                    <Plus size={14} weight="bold" />
                    İlan Aç
                  </Button>
                </BosKart>
              ) : null}
              <ul className="divide-y divide-border">
                {yeniBes.map((ilan) => (
                  <li key={ilan.id}>
                    <Link href={`/app/ilanlar/${ilan.id}`} className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/50">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{adliyeAdlari[ilan.adliye] || ilan.adliye}</span>
                        <span className="block truncate text-[13px] text-muted-foreground">{kategoriAd(ilan.kategori)} · {saatYazi(ilan.tarih_saat)}</span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-sm font-semibold tabular-nums">{new Intl.NumberFormat("tr-TR").format(Number(ilan.ucret) || 0)} ₺</span>
                        <span className="block text-[12px] text-muted-foreground">{ilanSag(ilan, simdi)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </ListeKarti>
            <ListeKarti baslik="Ajandam" alt="Önümüzdeki 7 gün">
              {yukleniyor ? <SatirIskelet /> : null}
              {!yukleniyor && !gruplar.length ? (
                <BosKart ikon={CalendarBlank} baslik="Yaklaşan göreviniz yok" aciklama="Üstlendiğiniz ve oluşturduğunuz görevler burada görünür.">
                  <Button nativeButton={false} variant="outline" className="h-9 bg-white" render={<Link href="/app/ilanlar" />}>İlanlara göz at</Button>
                </BosKart>
              ) : null}
              {gruplar.map((grup) => (
                <div key={grup.gun}>
                  <p className="bg-muted/40 px-5 py-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{grup.baslik}</p>
                  <ul className="divide-y divide-border">
                    {grup.data.map((gorev) => (
                      <li key={`${gorev.rol}-${gorev.id}`}>
                        <Link href={gorev.rol === "basvuran" ? `/app/basvurularim/${gorev.id}` : `/app/gorevlerim/${gorev.id}`} className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/50">
                          <span className="w-14 shrink-0 rounded-md bg-navy/[0.07] py-1 text-center text-sm font-semibold text-navy tabular-nums">{saatYazi(gorev.tarih_saat, true)}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{adliyeAdlari[gorev.adliye] || gorev.adliye}</span>
                            <span className="block truncate text-[13px] text-muted-foreground">{kategoriAd(gorev.kategori)}</span>
                          </span>
                          <StatusBadge durum={durumAnahtari(gorev, toplamaDk, simdi)} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </ListeKarti>
          </div>
          {modlarAktif ? <div id="modlar" className="flex scroll-mt-20 flex-col gap-4">
            <Modlar kartlar />
            <ListeKarti baslik="Müsait Meslektaşlar" href="/app/avukat-ara">
              {yukleniyor ? <SatirIskelet /> : null}
              {!yukleniyor && !musait.length ? (
                <BosKart ikon={UsersThree} baslik="Şu an müsait meslektaş yok" aciklama="Modu açık avukatlar burada görünür." />
              ) : null}
              <ul className="divide-y divide-border">
                {musait.map((kisi) => (
                  <li key={kisi.oturum_id || `${kisi.kullanici_id}-${kisi.adliye}`} className="flex items-center gap-3 px-5 py-3">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy/10 text-[13px] font-semibold text-navy">
                      {kisi.fotograf_url ? <img src={kisi.fotograf_url} alt="" className="size-9 object-cover" /> : (kisi.ad_soyad || "?").slice(0, 1)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{kisi.ad_soyad}</span>
                      <span className="block truncate text-xs text-muted-foreground">{adliyeAdlari[kisi.adliye] || kisi.adliye}</span>
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${kisi.tip === "gece" ? "bg-navy text-white" : "bg-success-soft text-success"}`}>{kisi.tip === "gece" ? "Gece" : "Adliye"}</span>
                  </li>
                ))}
              </ul>
            </ListeKarti>
          </div> : null}
        </div>
      </div>
    </div>
  );
}

function SatirIskelet() {
  return (
    <div className="space-y-3 p-5" aria-busy="true">
      <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
    </div>
  );
}

function BosKart({ ikon: Ikon, baslik, aciklama, children }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <span className="inline-flex size-11 items-center justify-center rounded-full bg-navy/[0.07] text-navy">
        <Ikon size={20} aria-hidden="true" />
      </span>
      <p className="mt-3 text-sm font-semibold">{baslik}</p>
      {aciklama ? <p className="mt-1 max-w-xs text-[13px] text-muted-foreground">{aciklama}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

function ListeKarti({ baslik, alt, href, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-[15px] font-semibold">{baslik}</h2>
          {alt ? <p className="text-xs text-muted-foreground">{alt}</p> : null}
        </div>
        {href ? <Link href={href} className="inline-flex items-center gap-1 text-[13px] font-semibold text-navy hover:underline">Tümünü gör<CaretRight size={12} weight="bold" /></Link> : null}
      </div>
      {children}
    </section>
  );
}

function ilanSag(ilan, simdi) {
  const kalan = simdi ? new Date(ilan.tarih_saat).getTime() - simdi : 0;
  if (kalan > 0) {
    const dk = Math.ceil(kalan / 60000);
    if (dk < 60) return `${dk} dk`;
    const sa = Math.floor(dk / 60);
    if (sa < 48) return `${sa} sa`;
    return `${Math.floor(sa / 24)} gün`;
  }
  return `${ilan.basvuru_sayisi || 0} başvuru`;
}

function PuanSeridi({ liste }) {
  if (!liste?.length) return null;
  const id = liste[0].id || liste[0].task_id;
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-accent-gold/40 bg-[#fbf6e7] px-4 py-3">
      <p className="text-sm font-medium">{liste.length} görev değerlendirmenizi bekliyor</p>
      {id ? <Link href={`/app/gorevlerim/${id}`} className="inline-flex h-8 shrink-0 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground">Değerlendir</Link> : null}
    </div>
  );
}

function istanbulParcaGun(iso) {
  return ymdIstanbul(new Date(iso));
}

function IlanSatiri({ ilan, simdi, adliye, mesgul, onBasvur }) {
  const kalan = new Date(ilan.tarih_saat).getTime() - simdi;
  const acil = kalan > 0 && kalan < 3 * 60 * 60 * 1000;
  const yarin = ymdIstanbul(new Date(ilan.tarih_saat)) === gunEkle(ymdIstanbul(), 1);
  const saat = `${yarin ? "Yarın " : ""}${saatYazi(ilan.tarih_saat, true)}`;
  const ucret = new Intl.NumberFormat("tr-TR").format(Number(ilan.ucret) || 0);
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Link href={`/app/ilanlar/${ilan.id}`} className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-[14px] font-semibold">{kategoriAd(ilan.kategori)}</span>
          <span className="shrink-0 text-[14px] font-semibold">{ucret} ₺</span>
        </span>
        <span className="mt-1 block text-[13px] text-muted">
          {saat}
          {acil ? " · Acil" : ""}
          {` · ${ilan.basvuru_sayisi || 0}/10`}
          {adliye ? ` · ${adliye}` : ""}
        </span>
      </Link>
      {ilan.basvurdum ? (
        <span className="text-[13px] font-medium text-muted">Başvuruldu</span>
      ) : (
        <button type="button" disabled={mesgul} onClick={onBasvur} className="text-[14px] font-semibold text-navy disabled:text-muted">
          {mesgul ? "..." : "Başvur"}
        </button>
      )}
    </div>
  );
}

function Sayac({ href, ikon: Ikon, etiket, deger, vurgu }) {
  return (
    <Link href={href} className={vurgu
      ? "flex flex-col gap-3 rounded-2xl bg-navy p-4 text-white shadow-[0_10px_28px_-12px_rgb(30_58_95/0.6)] transition-colors hover:bg-ink"
      : "flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-navy/20 hover:bg-muted/40 active:bg-muted"}>
      <span className="flex items-center justify-between">
        <span className={`inline-flex size-9 items-center justify-center rounded-full ${vurgu ? "bg-white/15 text-white" : "bg-navy/[0.07] text-navy"}`}>
          <Ikon size={18} aria-hidden="true" />
        </span>
        <CaretRight size={16} aria-hidden="true" className={vurgu ? "text-on-ink" : "text-muted-foreground"} />
      </span>
      <span>
        <span className="block text-[26px] leading-none font-bold tabular-nums">{deger}</span>
        <span className={`mt-1 block truncate text-[13px] ${vurgu ? "text-on-ink" : "text-muted-foreground"}`}>{etiket}</span>
      </span>
    </Link>
  );
}

function BolumBasligi({ baslik, href }) {
  return (
    <div className="mb-2.5 flex items-center justify-between px-1">
      <h2 className="text-[17px] font-semibold">{baslik}</h2>
      {href ? <Link href={href} className="text-[13px] font-semibold text-navy">Tümünü gör</Link> : null}
    </div>
  );
}

function Erisim({ href, ikon: Ikon, baslik, alt, son }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-3.5 active:bg-muted ${son ? "" : "border-b border-line"}`}>
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-navy/[0.07] text-navy">
        <Ikon size={18} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">{baslik}</span>
        <span className="block truncate text-[13px] text-muted-foreground">{alt}</span>
      </span>
      <CaretRight size={16} aria-hidden="true" className="text-muted-foreground" />
    </Link>
  );
}
