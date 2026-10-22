import { createClient } from "@/lib/supabase/client";
import { oturumKullanicisi } from "@/lib/oturum-kullanici";

// Görev açma ve başvuru doğrulanmış hesap ister.
// Kuralı veritabanı (aktif_kullanici_mi) zorlar; burası kullanıcıya
// işlemden önce anlaşılır bir uyarı göstermek için var.
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

// İşleme devam edilebiliyorsa true döner. Değilse uyarı penceresini açıp false döner.
// Durum okunamazsa işlemi engellemez; son kararı veritabanı verir.
// Pencere (DogrulamaDiyalogu) AppShell'de durur ve bu olayı dinler.
export async function dogrulamaKapisi() {
  const durum = await dogrulamaDurumu();
  if (durum === null || durum === "onaylandi") return true;

  // Onaydan sonra kullanıcı işlemi başlattığı sayfaya (ör. ilan detayı) döner.
  const donus = window.location.pathname + window.location.search;
  window.dispatchEvent(new CustomEvent("dogrulama-gerekli", { detail: { durum, donus } }));
  return false;
}
