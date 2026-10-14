"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { FormHatasi } from "@/components/FormHatasi";
import { hataMesaji } from "@/lib/hata-mesaji";
import { createClient } from "@/lib/supabase/client";

function guvenliHedef(deger) {
  return deger && deger.startsWith("/") && !deger.startsWith("//") ? deger : "/app";
}

export function LoginForm() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [hata, setHata] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const newErrors = {};
    if (!email.trim()) newErrors.email = "E-posta adresi gerekli";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Geçerli bir e-posta adresi girin";
    if (!password.trim()) newErrors.password = "Şifre gerekli";
    else if (password.length < 6) newErrors.password = "Şifre en az 6 karakter olmalı";
    setErrors(newErrors);
    setHata("");
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    const supabase = createClient();
    try {
      const adres = email.trim().toLowerCase();
      const { error } = await supabase.auth.signInWithPassword({ email: adres, password });
      if (error) {
        const msg = String(error?.message || "").toLowerCase();
        if (msg.includes("email not confirmed") || msg.includes("email_not_confirmed")) {
          const { error: kodHatasi } = await supabase.auth.resend({ type: "signup", email: adres });
          if (kodHatasi) throw kodHatasi;
          router.replace(`/dogrula?email=${encodeURIComponent(adres)}&bilgi=1`);
          return;
        }
        setHata(hataMesaji(error));
        return;
      }
      // ?next= burada okunur; form statik HTML'de gelsin, Suspense ile sonradan yerleşip sayfayı kaydırmasın
      router.replace(guvenliHedef(new URLSearchParams(window.location.search).get("next")));
      router.refresh();
    } catch (error) {
      setHata(hataMesaji(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form noValidate onSubmit={handleLogin} className="space-y-5">
      <FormHatasi>{hata}</FormHatasi>
      <Field
        label="E-posta"
        id="giris-eposta"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="ornek@email.com"
        error={errors.email}
      />
      <div>
        <Field
          label="Şifre"
          id="giris-sifre"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Şifrenizi girin"
          error={errors.password}
        />
        <div className="mt-2 text-right">
          <Link href="/sifremi-unuttum" className="text-[13px] font-medium text-navy hover:underline">
            Şifremi Unuttum
          </Link>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
      </Button>
      <p className="text-center text-[14px] text-muted">
        Hesabınız yok mu?{" "}
        <Link href="/uye-ol" className="font-semibold text-navy hover:underline">
          Kayıt Ol
        </Link>
      </p>
    </form>
  );
}
