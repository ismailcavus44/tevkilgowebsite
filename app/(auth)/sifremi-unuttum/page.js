import { AuthScreen } from "@/components/AuthScreen";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const metadata = { title: "Şifremi unuttum" };

export default function SifremiUnuttumPage() {
  return (
    <AuthScreen title="Şifremi Unuttum">
      <ForgotPasswordForm />
    </AuthScreen>
  );
}
