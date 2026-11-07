import { createClient } from "@/lib/supabase/client";

export async function engellediklerim() {
  const { data, error } = await createClient().rpc("engellediklerim");
  if (error) throw error;
  return data || [];
}

export async function engelliKimlikler() {
  const liste = await engellediklerim();
  return new Set(liste.map((satir) => satir.kullanici_id).filter(Boolean));
}

export async function engelKaldir(engelId) {
  const { error } = await createClient().rpc("engel_kaldir", { p_engel_id: engelId });
  if (error) throw error;
}
