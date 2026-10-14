import { AuthScreen } from "@/components/AuthScreen";
import { LoginForm } from "@/components/LoginForm";

export const metadata = { title: "Giriş yap", robots: { index: false, follow: true } };

export default function GirisPage() {
  return (
    <AuthScreen title="Tekrar Hoşgeldiniz" lede="Hesabınıza giriş yapın">
      <LoginForm />
    </AuthScreen>
  );
}
