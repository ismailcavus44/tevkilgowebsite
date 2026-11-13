import { createClient } from "@/lib/supabase/client";
import { oturumKullanicisi } from "@/lib/oturum-kullanici";

// Göreve başvuru doğrulanmış hesap ister (aktif_kullanici_mi).
// Görev (ilan) açma onaysız hesaba da açıktır; kimlik onaylanana kadar en fazla
// ONAYSIZ_ILAN_SINIRI açık ilan (ilan_acabilir_mi). Kuralları veritabanı zorlar;
// buradaki kapılar kullanıcıya işlemden önce anlaşılır bir uyarı göstermek için var.
export const ONAYSIZ_ILAN_SINIRI = 2;

export async function dogrulamaDurumu() {
  const supabase = createClient();
  const user = await oturumKullanicisi(supabase);
  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("dogrulama_durumu")
    .eq("id", user.id)
    .maybeSingle();
  if (error || !data) return null;
  return data.dogrulama_durumu;
}

function diyalogAc(durum, sebep) {
  // Onaydan sonra kullanıcı işlemi başlattığı sayfaya (ör. ilan detayı) döner.
  const donus = window.location.pathname + window.location.search;
  window.dispatchEvent(new CustomEvent("dogrulama-gerekli", { detail: { durum, donus, sebep } }));
}

// İlan açmadan önce: onaylı hesap serbest; onay bekleyen hesap sınırın altındaysa serbest.
// Kimliği reddedilmiş hesap kimlik yüklemeye yönlendirilir. Okuma hatasında işlemi engellemez.
export async function ilanKapisi() {
  const durum = await dogrulamaDurumu();
  if (durum === null || durum === "onaylandi") return true;
  if (durum === "reddedildi") {
    diyalogAc(durum, "ilan");
    return false;
  }

  const supabase = createClient();
  const user = await oturumKullanicisi(supabase);
  if (!user) return true;
  const { count, error } = await supabase
    .from("tasks")
    .select("id", { count: "exact", head: true })
    .eq("olusturucu_id", user.id)
    .eq("durum", "acik");
  if (error || count === null) return true;
  if (count < ONAYSIZ_ILAN_SINIRI) return true;

  diyalogAc(durum, "sinir");
  return false;
}

// Göreve başvurmadan önce:
// İşleme devam edilebiliyorsa true döner. Değilse uyarı penceresini açıp false döner.
// Durum okunamazsa işlemi engellemez; son kararı veritabanı verir.
// Pencere (DogrulamaDiyalogu) AppShell'de durur ve bu olayı dinler.
export async function dogrulamaKapisi() {
  const durum = await dogrulamaDurumu();
  if (durum === null || durum === "onaylandi") return true;

  diyalogAc(durum, "basvuru");
  return false;
}
