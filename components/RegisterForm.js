"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { FormHatasi } from "@/components/FormHatasi";
import { hataMesaji } from "@/lib/hata-mesaji";
import { createClient } from "@/lib/supabase/client";

function useBarolar() {
  const [barolar, setBarolar] = useState([]);

  useEffect(() => {
    let iptal = false;
    createClient()
      .from("barolar")
      .select("kod, ad, il_kod, sira")
      .eq("aktif", true)
      .order("il_kod", { ascending: true })
      .order("sira", { ascending: true })
      .then(({ data, error }) => {
        if (!iptal && !error) setBarolar(data || []);
      });
    return () => {
      iptal = true;
    };
  }, []);

  return barolar;
}

const BOS = {
  adSoyad: "",
  baro: "",
  telefon: "",
  email: "",
  tbbSicil: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const barolar = useBarolar();
  const [formData, setFormData] = useState({
    ...BOS,
    adSoyad: params.get("ad") || "",
    baro: params.get("baro") || "",
    telefon: params.get("telefon") || "",
    email: params.get("email") || "",
    tbbSicil: params.get("sicil") || "",
  });
  const [errors, setErrors] = useState({});
  const [kosullarKabul, setKosullarKabul] = useState(params.get("kosul") === "1");
  const [hata, setHata] = useState("");
  const [loading, setLoading] = useState(false);
  const kisaSicil = formData.tbbSicil.trim().length > 0 && formData.tbbSicil.trim().length <= 4;

  function updateFormData(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.adSoyad.trim()) newErrors.adSoyad = "Ad Soyad gerekli";
    if (!formData.baro) newErrors.baro = "Baro seçimi gerekli";
    if (!formData.telefon.trim()) newErrors.telefon = "Telefon numarası gerekli";
    else if (formData.telefon.length !== 11) newErrors.telefon = "Telefon numarası 11 hane olmalı";
    else if (!/^05[0-9]{9}$/.test(formData.telefon))
      newErrors.telefon = "05 ile başlayan geçerli telefon numarası girin";
    if (!formData.email.trim()) newErrors.email = "E-posta adresi gerekli";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Geçerli bir e-posta adresi girin";
    if (!formData.tbbSicil.trim()) newErrors.tbbSicil = "TBB Sicil numarası gerekli";
    if (!formData.password.trim()) newErrors.password = "Şifre gerekli";
    else if (formData.password.length < 6) newErrors.password = "Şifre en az 6 karakter olmalı";
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = "Şifre tekrarı gerekli";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Şifreler eşleşmiyor";
    if (!kosullarKabul) return false;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleRegister(event) {
    event.preventDefault();
    setHata("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      const adres = formData.email.trim().toLowerCase();
      const { data, error } = await createClient().auth.signUp({
        email: adres,
        password: formData.password,
        options: {
          data: {
            ad_soyad: formData.adSoyad.trim(),
            baro: formData.baro,
            telefon: formData.telefon.trim(),
            tbb_sicil: formData.tbbSicil.trim(),
            kosullar_versiyon: "2026-10-13",
            app_name: "TevkilGO",
            locale: "tr",
          },
        },
      });
      if (error) throw error;
      if (data.session) {
        router.replace("/app");
        router.refresh();
      } else if (data.user) {
        const sorgu = new URLSearchParams({
          email: adres,
          ad: formData.adSoyad.trim(),
          baro: formData.baro,
          telefon: formData.telefon.trim(),
          sicil: formData.tbbSicil.trim(),
          kosul: "1",
        });
        router.replace(`/dogrula?${sorgu.toString()}`);
      }
    } catch (error) {
      setHata(hataMesaji(error));
    } finally {
      setLoading(false);
    }
  }

  const alan = (field) => ({
    value: formData[field],
    onChange: (e) => updateFormData(field, e.target.value),
    error: errors[field],
  });

  return (
    <form noValidate onSubmit={handleRegister} className="space-y-5">
      <FormHatasi>{hata}</FormHatasi>
      <Field label="Ad Soyad" id="uye-ad" autoComplete="name" placeholder="Adınız ve soyadınız" {...alan("adSoyad")} />

      <div>
        <label htmlFor="uye-baro" className="mb-1.5 block text-[14px] font-medium">
          Baro
        </label>
        <select
          id="uye-baro"
          value={formData.baro}
          onChange={(e) => updateFormData("baro", e.target.value)}
          disabled={!barolar.length}
          aria-invalid={errors.baro ? true : undefined}
          aria-describedby={errors.baro ? "uye-baro-hata" : undefined}
          className="control"
        >
          <option value="" disabled>
            {barolar.length ? "Baro seçin" : "Barolar yükleniyor..."}
          </option>
          {barolar.map((baro) => (
            <option key={baro.kod} value={baro.ad}>
              {baro.ad}
            </option>
          ))}
        </select>
        {errors.baro ? (
          <p id="uye-baro-hata" className="mt-1.5 text-[13px] text-danger">
            {errors.baro}
          </p>
        ) : null}
      </div>

      <Field
        label="Telefon Numarası"
        id="uye-telefon"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="05XX XXX XX XX"
        maxLength={11}
        {...alan("telefon")}
      />
      <Field
        label="E-posta"
        id="uye-eposta"
        type="email"
        autoComplete="email"
        placeholder="ornek@email.com"
        {...alan("email")}
      />

      <div>
        <Field label="TBB Sicil Numarası" id="uye-sicil" placeholder="Sicil numaranız" {...alan("tbbSicil")} />
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
          Kimlik kartınızdaki TBB sicil numarası. Baronuzun verdiği sicil numarasından farklıdır.
        </p>
        {kisaSicil ? (
          <p role="status" className="mt-1.5 text-[13px] font-medium leading-relaxed text-[#9A6700]">
            Bu numara baro sicil numaranız olabilir. TBB sicil numaranızı kimlik kartınızdan kontrol edin.
          </p>
        ) : null}
      </div>

      <Field
        label="Şifre"
        id="uye-sifre"
        type="password"
        autoComplete="new-password"
        placeholder="En az 6 karakter"
        {...alan("password")}
      />
      <Field
        label="Şifre Tekrarı"
        id="uye-sifre-tekrar"
        type="password"
        autoComplete="new-password"
        placeholder="Şifrenizi tekrar girin"
        {...alan("confirmPassword")}
      />

      <div className="space-y-3">
        <label className="flex items-start gap-3 text-[14px] leading-relaxed">
          <input
            type="checkbox"
            checked={kosullarKabul}
            onChange={(e) => setKosullarKabul(e.target.checked)}
            className="mt-1 size-4 shrink-0 accent-[#1E3A5F]"
          />
          <span>
            <Link href="/kullanim-kosullari" target="_blank" className="font-semibold text-navy underline underline-offset-2">
              Kullanım Koşulları
            </Link>
            &apos;nı okudum ve kabul ediyorum.
          </span>
        </label>
        <p className="text-[13px] leading-relaxed text-muted">
          Kişisel verilerinizin işlenmesine ilişkin bilgilendirme için{" "}
          <Link href="/kvkk" target="_blank" className="font-medium text-navy underline underline-offset-2">
            KVKK Aydınlatma Metni
          </Link>
          &apos;ni ve{" "}
          <Link href="/gizlilik" target="_blank" className="font-medium text-navy underline underline-offset-2">
            Gizlilik Politikası
          </Link>
          &apos;nı inceleyebilirsiniz.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={loading || !kosullarKabul}>
        {loading ? "Kayıt yapılıyor…" : "Kayıt Ol"}
      </Button>
      <p className="text-center text-[14px] text-muted">
        Zaten hesabınız var mı?{" "}
        <Link href="/giris" className="font-semibold text-navy hover:underline">
          Giriş Yap
        </Link>
      </p>
    </form>
  );
}
