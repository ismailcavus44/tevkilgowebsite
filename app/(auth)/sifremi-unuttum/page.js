import { AuthScreen } from "@/components/AuthScreen";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const metadata = { title: "Şifremi unuttum", robots: { index: false, follow: true } };

export default function SifremiUnuttumPage() {
  return (
    <AuthScreen title="Şifremi Unuttum">
      <ForgotPasswordForm />
    </AuthScreen>
  );
}
