import { Suspense } from "react";
import { AuthScreen } from "@/components/AuthScreen";
import { LoginForm } from "@/components/LoginForm";

export const metadata = { title: "Giriş yap" };

export default function GirisPage() {
  return (
    <AuthScreen title="Tekrar Hoşgeldiniz" lede="Hesabınıza giriş yapın">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthScreen>
  );
}
