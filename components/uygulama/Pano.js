"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, CaretRight, ChatCircleText, ListBullets, MagnifyingGlass, Plus, Question, UserCheck } from "@phosphor-icons/react";
import { toast } from "sonner";
import { SectionCards } from "@/components/section-cards";
import { Badge } from "@/components/ui/badge";
import { Modlar } from "@/components/uygulama/Modlar";
import { kategoriAd, puanlamaKayitlari, useKategoriler } from "@/components/uygulama/ortak";
import { basvurulmamisIlanSayisi } from "@/lib/acik-ilanlar";
import { hataMesaji } from "@/lib/hata-mesaji";
import { createClient } from "@/lib/supabase/client";
import { bugunAraligi, gunBasligi, gunEkle, saatYazi, ymdIstanbul } from "@/lib/tarih";
import { StatusBadge, durumAnahtari } from "@/components/uygulama/StatusBadge";
import { useOzellikler } from "@/components/uygulama/Ozellikler";

export function Pano() {
  useKategoriler();
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

  return (
    <>
    <div className="h-full overflow-y-auto bg-canvas md:hidden">
      <div className="space-y-4 py-6">
        <PuanSeridi liste={bekleyenPuan} />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[22px] font-semibold">{adParca ? `Merhaba, ${adParca}` : "Merhaba"}</p>
          <div className="flex items-center gap-2">
            <Link href="/app/destek" aria-label="Destek" className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface">
              <ChatCircleText size={22} aria-hidden="true" />
            </Link>
            <Link href="/app/profil" aria-label="Profil" className="inline-flex size-10 items-center justify-center overflow-hidden rounded-full border border-line bg-surface">
              {fotograf ? (
                <img src={fotograf} alt="" className="size-10 object-cover" />
              ) : (
                <span className="text-[14px] font-semibold">{(ad || "?").slice(0, 1)}</span>
              )}
            </Link>
          </div>
        </div>
        {hata ? <p role="alert" className="text-[14px] text-danger">{hata}</p> : null}
        {modlarAktif ? <div id="modlar" className="scroll-mt-16"><Modlar gomulu /></div> : null}
        <Link href="/app/ilanlar" className="flex items-center gap-3 rounded-card border border-line bg-surface px-4 py-3">
          <span className="text-[28px] font-semibold text-navy">{yukleniyor ? "–" : acikSayi}</span>
          <span>
            <span className="block text-[15px] font-semibold">Bölgende açık ilan</span>
            <span className="block text-[13px] text-muted">
              {yukleniyor ? "–" : bugunSayi === 0 ? "Bugün için ilan yok" : `${bugunSayi} tanesi bugün`}
            </span>
          </span>
        </Link>
        {yaklasan.length > 0 ? (
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[13px] font-semibold text-muted">Yaklaşan İlanlar</h2>
              <Link href="/app/ilanlar" className="text-[13px] font-semibold text-navy">Tümünü gör</Link>
            </div>
            <ul className="overflow-hidden rounded-card border border-line bg-surface">
              {yaklasan.map((ilan) => (
                <li key={ilan.id} className="border-b border-line last:border-b-0">
                  <IlanSatiri ilan={ilan} simdi={simdi} adliye={adliyeSayisi > 1 ? (adliyeAdlari[ilan.adliye] || ilan.adliye) : ""} mesgul={basvurulan === ilan.id} onBasvur={() => basvur(ilan)} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <button type="button" onClick={() => window.dispatchEvent(new Event("ilan-ac"))} className="flex w-full items-center gap-3 rounded-card bg-navy/10 p-4 text-left">
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-navy">Yeni görev oluştur</span>
            <span className="mt-1 block text-[13px] leading-relaxed">Adliye, tarih ve ücreti belirleyip meslektaşlarınıza iletin.</span>
          </span>
          <span className="inline-flex size-10 items-center justify-center rounded-control bg-surface text-navy">
            <Plus size={22} weight="bold" aria-hidden="true" />
          </span>
        </button>
        <Sayac href="/app/gorevlerim" ikon={Briefcase} etiket="Oluşturduğum görevler" deger={yukleniyor ? "–" : gorevSayisi} />
        <Sayac href="/app/basvurularim" ikon={UserCheck} etiket="Üstlendiğim görevler" deger={yukleniyor ? "–" : ustlenilen} />
        <h2 className="text-[13px] font-semibold text-muted">Hızlı erişim</h2>
        <nav className="overflow-hidden rounded-card border border-line bg-surface">
          {modlarAktif ? <Erisim href="/app/avukat-ara" ikon={MagnifyingGlass} baslik="Müsait meslektaşlar" alt="İlinizde modu açık avukatlar" /> : null}
          <Erisim href="/app/ilanlar" ikon={ListBullets} baslik="İlanlar" alt="Bölgenizdeki açık ilanlar" />
          <Erisim href="/app/sss" ikon={Question} baslik="Nasıl kullanılır?" alt="Sık sorulan sorular" son />
        </nav>
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
    />
    </>
  );
}

function MasaPano({ ad, simdi, yukleniyor, hata, kayitlar, yeniBes, toplamaDk, profil, adliyeAdlari, bekleyenPuan, musait }) {
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

  return (
    <div className="hidden h-full overflow-y-auto bg-background md:block">
      <div className="-mx-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8">
          <PuanSeridi liste={bekleyenPuan} />
          <div>
            <h1 className="text-2xl font-semibold">{soyad ? `${selam}, Av. ${soyad}` : selam}</h1>
            {tarih ? <p className="text-sm text-muted-foreground">{tarih}</p> : null}
          </div>
          {hata ? <p role="alert" className="text-sm text-destructive">{hata}</p> : null}
          <SectionCards yukleniyor={yukleniyor} bugun={bugunGorev} secim={secim.length} bekleyen={bekleyen} puan={ort} />
          {secim.length ? (
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border border-l-2 border-l-accent-gold bg-card px-4 py-3 shadow-none">
              <p className="text-sm">{secim.length} ilanınızda başvurular toplandı, seçim yapabilirsiniz</p>
              <Link href={`/app/gorevlerim/${secim[0].id}`} className="inline-flex h-8 shrink-0 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground">Seçim yap</Link>
            </div>
          ) : null}
          <div className={modlarAktif ? "grid items-start gap-4 lg:grid-cols-3" : "grid items-start gap-4"}>
            <div className={modlarAktif ? "flex flex-col gap-4 lg:col-span-2" : "flex flex-col gap-4"}>
              <ListeKarti baslik="Ajandam">
                {yukleniyor ? <p className="px-4 py-2.5 text-sm text-muted-foreground">Yükleniyor…</p> : null}
                {!yukleniyor && !gruplar.length ? (
                  <p className="px-4 py-2.5 text-sm text-muted-foreground">
                    Yaklaşan göreviniz yok.{" "}
                    <Link href="/app/ilanlar" className="text-foreground underline underline-offset-2">İlanlara göz at</Link>
                  </p>
                ) : null}
                {gruplar.map((grup) => (
                  <div key={grup.gun}>
                    <p className="px-4 pt-3 pb-1 text-xs uppercase text-muted-foreground">{grup.baslik}</p>
                    <ul className="divide-y divide-border">
                      {grup.data.map((gorev) => (
                        <li key={`${gorev.rol}-${gorev.id}`}>
                          <Link href={gorev.rol === "basvuran" ? `/app/basvurularim/${gorev.id}` : `/app/gorevlerim/${gorev.id}`} className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-muted/50">
                            <span className="w-12 shrink-0 text-sm tabular-nums">{saatYazi(gorev.tarih_saat, true)}</span>
                            <span className="min-w-0 truncate text-sm font-medium">{adliyeAdlari[gorev.adliye] || gorev.adliye}</span>
                            <span className="hidden min-w-0 truncate text-sm text-muted-foreground sm:inline">{kategoriAd(gorev.kategori)}</span>
                            <span className="ml-auto shrink-0"><StatusBadge durum={durumAnahtari(gorev, toplamaDk, simdi)} /></span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </ListeKarti>
              <ListeKarti baslik="Bölgendeki yeni ilanlar" href="/app/ilanlar">
                {yukleniyor ? <p className="px-4 py-2.5 text-sm text-muted-foreground">Yükleniyor…</p> : null}
                {!yukleniyor && !yeniBes.length ? <p className="px-4 py-2.5 text-sm text-muted-foreground">Bölgenizde açık ilan yok.</p> : null}
                <ul className="divide-y divide-border">
                  {yeniBes.map((ilan) => (
                    <li key={ilan.id}>
                      <Link href={`/app/ilanlar/${ilan.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50">
                        <span className="w-24 shrink-0 text-sm tabular-nums">{saatYazi(ilan.tarih_saat)}</span>
                        <span className="min-w-0 truncate text-sm font-medium">{adliyeAdlari[ilan.adliye] || ilan.adliye}</span>
                        <span className="hidden min-w-0 truncate text-sm text-muted-foreground sm:inline">{kategoriAd(ilan.kategori)}</span>
                        <span className="ml-auto shrink-0 text-sm text-muted-foreground">{ilanSag(ilan, simdi)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </ListeKarti>
            </div>
            {modlarAktif ? <div id="modlar" className="flex scroll-mt-20 flex-col gap-4">
              <Modlar kartlar />
              <ListeKarti baslik="Müsait meslektaşlar" href="/app/avukat-ara">
                {yukleniyor ? <p className="px-4 py-2.5 text-sm text-muted-foreground">Yükleniyor…</p> : null}
                {!yukleniyor && !musait.length ? <p className="px-4 py-2.5 text-sm text-muted-foreground">Şu an müsait meslektaş yok.</p> : null}
                <ul className="divide-y divide-border">
                  {musait.map((kisi) => (
                    <li key={kisi.oturum_id || `${kisi.kullanici_id}-${kisi.adliye}`} className="flex items-center gap-3 px-4 py-2.5">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{kisi.ad_soyad}</span>
                        <span className="block truncate text-xs text-muted-foreground">{adliyeAdlari[kisi.adliye] || kisi.adliye}</span>
                      </span>
                      <Badge variant="secondary">{kisi.tip === "gece" ? "Gece" : "Adliye"}</Badge>
                    </li>
                  ))}
                </ul>
              </ListeKarti>
            </div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListeKarti({ baslik, href, children }) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-none">
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        <h2 className="text-sm font-medium">{baslik}</h2>
        {href ? <Link href={href} className="text-sm text-muted-foreground">Tümünü gör</Link> : null}
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
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border border-l-2 border-l-accent-gold bg-card px-4 py-3 shadow-none">
      <p className="text-sm">{liste.length} görev değerlendirmenizi bekliyor</p>
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

function Sayac({ href, ikon: Ikon, etiket, deger }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-card border border-line bg-surface p-4">
      <Ikon size={22} aria-hidden="true" className="text-navy" />
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] text-muted">{etiket}</span>
        <span className="block text-[22px] font-semibold">{deger}</span>
      </span>
      <CaretRight size={18} aria-hidden="true" className="text-muted" />
    </Link>
  );
}

function Erisim({ href, ikon: Ikon, baslik, alt, son }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-3 ${son ? "" : "border-b border-line"}`}>
      <Ikon size={22} aria-hidden="true" className="text-navy" />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">{baslik}</span>
        <span className="block text-[13px] text-muted">{alt}</span>
      </span>
      <CaretRight size={18} aria-hidden="true" className="text-muted" />
    </Link>
  );
}
