import { Suspense } from "react";
import { AuthScreen } from "@/components/AuthScreen";
import { GeriLinki } from "@/components/GeriLinki";
import { RegisterForm, RegisterFormParamli } from "@/components/RegisterForm";
import { UyeOlGeriLinki } from "@/components/UyeOlGeriLinki";

export const metadata = { title: "Üye ol", robots: { index: false, follow: true } };

// Sayfa statik üretilir. URL'ye bağlı iki parça (geri bağlantısı ve ön doldurulmuş form) kendi Suspense'inde,
// aynı ölçüdeki boş halleriyle bekler; böylece ilk HTML dolu gelir ve yerleşim kaymaz.
export default function UyeOlPage() {
  return (
    <AuthScreen
      title="Hesap Oluştur"
      logo={false}
      geriLinki={
        <Suspense fallback={<GeriLinki />}>
          <UyeOlGeriLinki />
        </Suspense>
      }
    >
      <Suspense fallback={<RegisterForm />}>
        <RegisterFormParamli />
      </Suspense>
    </AuthScreen>
  );
}
