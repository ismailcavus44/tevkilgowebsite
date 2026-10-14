import { Suspense } from "react";
import { AuthScreen } from "@/components/AuthScreen";
import { VerifyCodeForm, VerifyCodeFormParamli } from "@/components/VerifyCodeForm";

export const metadata = { title: "E-postanızı doğrulayın", robots: { index: false, follow: true } };

export default function DogrulaPage() {
  return (
    <AuthScreen title="E-postanızı doğrulayın">
      <Suspense fallback={<VerifyCodeForm />}>
        <VerifyCodeFormParamli />
      </Suspense>
    </AuthScreen>
  );
}
