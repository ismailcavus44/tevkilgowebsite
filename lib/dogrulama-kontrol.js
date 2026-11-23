import { createClient } from "@/lib/supabase/client";
import { oturumKullanicisi } from "@/lib/oturum-kullanici";

// Kimlik kartı istenmez. Kayıt olan her hesap ilan açar ve göreve başvurur; yönetim ad soyad,
// baro ve TBB sicil numarasını sonradan baro levhasından elle kontrol eder.
// Bilgileri levhayla uyuşmayan hesaba düzeltme talebi gider (dogrulama_durumu = 'reddedildi');
// düzeltilene kadar ilan açma ve başvuru kapalıdır. Kuralları veritabanı zorlar; buradaki
// kapılar kullanıcıya işlemden önce anlaşılır bir uyarı göstermek için var.

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

function diyalogAc(sebep) {
  // Düzeltmeden sonra kullanıcı işlemi başlattığı sayfaya (ör. ilan detayı) döner.
  const donus = window.location.pathname + window.location.search;
  window.dispatchEvent(new CustomEvent("dogrulama-gerekli", { detail: { donus, sebep } }));
}

// İlan açmadan önce. Okuma hatasında işlemi engellemez.
export async function ilanKapisi() {
  const durum = await dogrulamaDurumu();
  if (durum !== "reddedildi") return true;
  diyalogAc("ilan");
  return false;
}

// Göreve başvurmadan önce. Okuma hatasında işlemi engellemez.
// Pencere (DogrulamaDiyalogu) AppShell'de durur ve bu olayı dinler.
export async function dogrulamaKapisi() {
  const durum = await dogrulamaDurumu();
  if (durum !== "reddedildi") return true;
  diyalogAc("basvuru");
  return false;
}
