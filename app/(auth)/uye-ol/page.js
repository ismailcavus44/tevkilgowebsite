import { Suspense } from "react";
import { AuthScreen } from "@/components/AuthScreen";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata = { title: "Üye ol" };

export default async function UyeOlPage({ searchParams }) {
  const sorgu = await searchParams;
  const donus = sorgu.donus === "1";
  const kod = new URLSearchParams({
    email: sorgu.email || "",
    ad: sorgu.ad || "",
    baro: sorgu.baro || "",
    telefon: sorgu.telefon || "",
    sicil: sorgu.sicil || "",
    kosul: sorgu.kosul || "",
  });
  if (sorgu.bilgi === "1") kod.set("bilgi", "1");

  return (
    <AuthScreen
      title="Hesap Oluştur"
      logo={false}
      geri={donus ? `/dogrula?${kod.toString()}` : "/"}
      geriYazi={donus ? "Geri" : "Ana sayfa"}
    >
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthScreen>
  );
}
