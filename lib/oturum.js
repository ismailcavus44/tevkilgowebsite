import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Date.now() önizleme sırasında rotayı bloklar. Aynı an, performans saatiyle.
function simdiMs() {
  return performance.timeOrigin + performance.now();
}

// Doğrulama durumunu döndürür. Uygulama alanı bunu kapı olarak kullanmaz, bkz. uygulamaKapisi.
// oturum yok -> giriş; users satırı yok/hata -> kimlik; askıda -> askida;
// baro bilgilerine düzeltme istenmiş (reddedildi) -> kimlik (düzeltme formu); diğer durumlar -> uygulama.
// Kimlik kartı istenmez: kontrol bekleyen hesap da uygulamayı tam kullanır.
export async function oturumDurumu() {
  // Supabase oturum süresi için Date.now() kullanır. Önce isteğe bağlanmazsak
  // Next.js önizlemeyi bloklar.
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { rota: "/giris", user: null, profil: null };

  const { data, error } = await supabase
    .from("users")
    .select("ad_soyad, baro, tbb_sicil, dogrulama_durumu, red_nedeni, revize_son_tarih, kalici_yasak, yasak_bitis, yasak_nedeni")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return { rota: "/app/kimlik", user, profil: null };

  const askida =
    data.kalici_yasak === true || (data.yasak_bitis && new Date(data.yasak_bitis).getTime() > simdiMs());

  if (askida) return { rota: "/app/askida", user, profil: data };
  if (data.dogrulama_durumu === "reddedildi") return { rota: "/app/kimlik", user, profil: data };
  return { rota: "/app", user, profil: data };
}

export async function durumKapisi(beklenen) {
  const durum = await oturumDurumu();
  if (durum.rota !== beklenen) redirect(durum.rota);
  return durum;
}

// Uygulama onaysız kullanıcıya da açık. Yalnızca oturumu olmayan ve askıdaki
// kullanıcı dışarı alınır. Düzeltme istenmiş hesabın görev açması ve başvurusunu
// veritabanı (aktif_kullanici_mi, ilan_acabilir_mi) engeller.
export async function uygulamaKapisi() {
  const durum = await oturumDurumu();
  if (!durum.user || durum.rota === "/app/askida") redirect(durum.rota);
  return durum;
}
