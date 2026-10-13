import { Suspense } from "react";
import { AuthScreen } from "@/components/AuthScreen";
import { VerifyCodeForm } from "@/components/VerifyCodeForm";

export const metadata = { title: "E-postanızı doğrulayın" };

export default function DogrulaPage() {
  return (
    <AuthScreen title="E-postanızı doğrulayın">
      <Suspense>
        <VerifyCodeForm />
      </Suspense>
    </AuthScreen>
  );
}
