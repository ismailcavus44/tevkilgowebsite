import { createClient } from "@/lib/supabase/client";

export function acikIlanFiltrele(sorgu, { adliyeFiltre = [], kategori = "", aralik = null, basvurdum } = {}) {
  if (adliyeFiltre.length === 1) sorgu = sorgu.eq("adliye", adliyeFiltre[0]);
  else if (adliyeFiltre.length > 1) sorgu = sorgu.in("adliye", adliyeFiltre);
  if (kategori) sorgu = sorgu.eq("kategori", kategori);
  if (aralik) sorgu = sorgu.gte("tarih_saat", aralik.gte).lt("tarih_saat", aralik.lt);
  if (basvurdum === true || basvurdum === false) sorgu = sorgu.eq("basvurdum", basvurdum);
  return sorgu;
}

export async function basvurulmamisIlanSayisi(supabase = createClient(), adliyeler) {
  const courts = Array.isArray(adliyeler) ? adliyeler : await kullaniciAdliyeleri(supabase);
  if (!courts.length) return 0;
  const { count, error } = await acikIlanFiltrele(
    supabase.from("acik_gorevler").select("id", { count: "exact", head: true }),
    { basvurdum: false },
  );
  if (error) throw error;
  return count || 0;
}

async function kullaniciAdliyeleri(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase.from("users").select("adliyeler").eq("id", user.id).single();
  if (error) throw error;
  return data?.adliyeler || [];
}
