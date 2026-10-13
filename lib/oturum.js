import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Date.now() önizleme sırasında rotayı bloklar. Aynı an, performans saatiyle.
function simdiMs() {
  return performance.timeOrigin + performance.now();
}

// Mobildeki lib/oturum.js oturumRotasi() ile aynı karar:
// oturum yok -> giriş; users satırı yok/hata -> doğrulama; askıda -> askida;
// onaylandi -> uygulama; diğer durumlar -> doğrulama (web'de yuklendi ayrı ekran).
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
    .select("dogrulama_durumu, red_nedeni, kalici_yasak, yasak_bitis, yasak_nedeni")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return { rota: "/app/kimlik", user, profil: null };

  const askida =
    data.kalici_yasak === true || (data.yasak_bitis && new Date(data.yasak_bitis).getTime() > simdiMs());

  if (askida) return { rota: "/app/askida", user, profil: data };
  if (data.dogrulama_durumu === "onaylandi") return { rota: "/app", user, profil: data };
  if (data.dogrulama_durumu === "yuklendi") return { rota: "/app/bekliyor", user, profil: data };
  return { rota: "/app/kimlik", user, profil: data };
}

export async function durumKapisi(beklenen) {
  const durum = await oturumDurumu();
  if (durum.rota !== beklenen) redirect(durum.rota);
  return durum;
}
