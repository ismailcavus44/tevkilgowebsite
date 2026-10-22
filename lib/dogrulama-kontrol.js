import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

// Görev açma ve başvuru doğrulanmış hesap ister.
// Kuralı veritabanı (aktif_kullanici_mi) zorlar; burası kullanıcıya
// işlemden önce anlaşılır bir uyarı göstermek için var.
export async function dogrulamaDurumu() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("dogrulama_durumu")
    .eq("id", user.id)
    .maybeSingle();
  if (error || !data) return null;
  return data.dogrulama_durumu;
}

// İşleme devam edilebiliyorsa true döner. Değilse uyarıyı gösterip false döner.
// Durum okunamazsa işlemi engellemez; son kararı veritabanı verir.
export async function dogrulamaKapisi(router) {
  const durum = await dogrulamaDurumu();
  if (durum === null || durum === "onaylandi") return true;

  if (durum === "yuklendi") {
    toast.info("Kimlik kartınız inceleniyor. Onaylandığında bu işlemi yapabilirsiniz.");
    return false;
  }

  // Onaydan sonra kullanıcı işlemi başlattığı sayfaya (ör. ilan detayı) döner.
  const donus = encodeURIComponent(window.location.pathname + window.location.search);
  toast.error("Bu işlem için avukatlık kimlik kartınızı yüklemeniz gerekir.", {
    action: { label: "Kimlik kartını yükle", onClick: () => router.push(`/app/kimlik?donus=${donus}`) },
  });
  return false;
}
