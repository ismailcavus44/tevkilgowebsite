import { createClient } from "@supabase/supabase-js";
import { cacheLife } from "next/cache";

// İl sayfaları herkese açık ve statik üretilir. Çerez gerekmediği için oturumsuz istemci kullanılır.
// Yalnızca anonim okumaya açık tablolar okunur; iş kuralı burada yazılmaz.
function istemci() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function ilVerisi(kod) {
  "use cache";
  cacheLife("days");

  const supabase = istemci();
  const [adliyeler, barolar] = await Promise.all([
    // Varlığı henüz teyit edilmemiş adliyeler herkese açık sayfada gösterilmez
    supabase
      .from("adliyeler")
      .select("kod, ad, sira")
      .eq("il_kod", kod)
      .eq("teyit_bekliyor", false)
      .order("sira"),
    supabase.from("barolar").select("kod, ad, sira").eq("il_kod", kod).order("sira"),
  ]);

  for (const sonuc of [adliyeler, barolar]) {
    if (sonuc.error) throw sonuc.error;
  }
  if (!adliyeler.data.length) return null;

  return { adliyeler: adliyeler.data, barolar: barolar.data };
}

// 81 ilin adı ve teyitli adliye sayısı, il adına göre sıralı
export async function ilAdliyeSayilari() {
  "use cache";
  cacheLife("days");

  const { data, error } = await istemci().from("adliyeler").select("il_kod, il_ad").eq("teyit_bekliyor", false);
  if (error) throw error;

  const sayilar = new Map();
  for (const satir of data) {
    const onceki = sayilar.get(satir.il_kod);
    sayilar.set(satir.il_kod, { kod: satir.il_kod, ad: satir.il_ad, adliye: (onceki?.adliye || 0) + 1 });
  }
  return [...sayilar.values()].sort((a, b) => a.ad.localeCompare(b.ad, "tr"));
}

// Sitedeki "81 il · 83 baro · 593 adliye" gibi özet sayılar; teyit bekleyen adliyeler sayılmaz
export async function genelSayilar() {
  "use cache";
  cacheLife("days");

  const supabase = istemci();
  const [adliyeler, barolar] = await Promise.all([
    supabase.from("adliyeler").select("il_kod").eq("teyit_bekliyor", false),
    supabase.from("barolar").select("kod", { count: "exact", head: true }),
  ]);
  if (adliyeler.error) throw adliyeler.error;
  if (barolar.error) throw barolar.error;

  return {
    il: new Set(adliyeler.data.map((satir) => satir.il_kod)).size,
    adliye: adliyeler.data.length,
    baro: barolar.count,
  };
}
