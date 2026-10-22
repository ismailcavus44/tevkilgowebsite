import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

// Görev açma ve başvuru doğrulanmış hesap ister. Veritabanı da aynı kuralı zorlar,
// burası kullanıcıyı önceden kimlik yükleme ekranına yönlendirmek için var.
export async function dogrulananHesapMi() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("users")
    .select("dogrulama_durumu")
    .eq("id", user.id)
    .maybeSingle();

  return data?.dogrulama_durumu === "onaylandi";
}

export function dogrulamaUyari(router) {
  toast.error("Bu işlem için avukatlık kimlik kartınızı yüklemeniz gerekir.", {
    action: { label: "Kimlik kartını yükle", onClick: () => router.push("/app/kimlik") },
  });
}
