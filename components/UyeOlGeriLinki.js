"use client";

import { useSearchParams } from "next/navigation";
import { GeriLinki } from "@/components/GeriLinki";

// Doğrulama ekranından "Bilgileri düzelt" ile dönen kullanıcı, girdiği bilgilerle doğrulamaya geri dönebilir
export function UyeOlGeriLinki() {
  const sorgu = useSearchParams();
  if (sorgu.get("donus") !== "1") return <GeriLinki />;

  const kod = new URLSearchParams();
  for (const alan of ["email", "ad", "baro", "telefon", "sicil", "kosul"]) kod.set(alan, sorgu.get(alan) || "");
  if (sorgu.get("bilgi") === "1") kod.set("bilgi", "1");
  return <GeriLinki href={`/dogrula?${kod.toString()}`} yazi="Geri" />;
}
