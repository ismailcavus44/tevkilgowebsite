"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { FormHatasi } from "@/components/FormHatasi";
import { KodAlani } from "@/components/KodAlani";
import { useGeriSayim } from "@/components/useGeriSayim";
import { hataMesaji } from "@/lib/hata-mesaji";
import { createClient } from "@/lib/supabase/client";

const BASLIK = { eposta: "Şifremi Unuttum", kod: "Doğrulama Kodu", sifre: "Yeni Şifre" };

export function ForgotPasswordForm() {
  const router = useRouter();
  const [adim, setAdim] = useState("eposta");
  const [email, setEmail] = useState("");
  const [kod, setKod] = useState("");
  const [uyari, setUyari] = useState("");
  const [durum, setDurum] = useState("");
  const [tamam, setTamam] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [kalan, sayaciBaslat] = useGeriSayim();

  async function kodGonder() {
    setUyari("");
    if (!email.trim()) return setUyari("E-posta adresini girin");
    if (!/\S+@\S+\.\S+/.test(email)) return setUyari("Geçerli bir e-posta adresi girin");
    if (kalan > 0) return setUyari(`Yeni kod talebinde bulunmak için ${kalan} saniye daha bekleyin.`);

    setYukleniyor(true);
    try {
      const { error } = await createClient().auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: false,
          data: { app_name: "TevkilGO", locale: "tr", reset_password: true },
        },
      });
      if (error) throw error;
      setAdim("kod");
      setDurum("Doğrulama kodu gönderildi. E-postanızı ve spam klasörünü kontrol edin.");
      sayaciBaslat();
    } catch (error) {
      setUyari(hataMesaji(error));
    } finally {
      setYukleniyor(false);
    }
  }

  async function koduDogrula(deger = kod) {
    setUyari("");
    if (!deger || deger.length < 6) return setUyari("6 haneli doğrulama kodunu girin");

    setYukleniyor(true);
    try {
      const { data, error } = await createClient().auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: deger,
        type: "email",
      });
      if (error) throw error;
      if (data?.session) {
        setAdim("sifre");
        setDurum("Kod doğrulandı");
      }
    } catch (error) {
      setKod("");
      setUyari(hataMesaji(error));
    } finally {
      setYukleniyor(false);
    }
  }

  async function sifreGuncelle(form) {
    setUyari("");
    const yeniSifre = String(form.get("password") || "");
    const tekrar = String(form.get("confirm") || "");
    if (!yeniSifre.trim()) return setUyari("Yeni şifre girin");
    if (yeniSifre.length < 6) return setUyari("Şifre en az 6 karakter olmalı");
    if (yeniSifre !== tekrar) return setUyari("Şifreler eşleşmiyor");

    setYukleniyor(true);
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.updateUser({ password: yeniSifre });
      if (error) throw error;
      await supabase.auth.signOut();
      setTamam(true);
    } catch (error) {
      setUyari(hataMesaji(error));
    } finally {
      setYukleniyor(false);
    }
  }

  async function iptal() {
    if (adim === "sifre") await createClient().auth.signOut();
    router.replace("/giris");
    router.refresh();
  }

  if (tamam) {
    return (
      <div className="space-y-5">
        <FormHatasi tur="bilgi">
          Şifreniz başarıyla güncellendi. Şimdi yeni şifrenizle giriş yapabilirsiniz.
        </FormHatasi>
        <Button href="/giris" className="w-full">
          Tamam
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (adim === "eposta") kodGonder();
        else if (adim === "kod") koduDogrula();
        else sifreGuncelle(new FormData(event.currentTarget));
      }}
    >
      {adim !== "eposta" ? <h2 className="text-[17px] font-semibold">{BASLIK[adim]}</h2> : null}
      <FormHatasi>{uyari}</FormHatasi>
      <FormHatasi tur="bilgi">{durum}</FormHatasi>

      {adim === "eposta" ? (
        <>
          <Field
            label="E-posta"
            id="sifre-eposta"
            type="email"
            autoComplete="email"
            placeholder="ornek@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" className="w-full" disabled={yukleniyor || kalan > 0}>
            {kalan > 0 ? `Bekleyin (${kalan}s)` : "Kod Gönder"}
          </Button>
        </>
      ) : null}

      {adim === "kod" ? (
        <>
          <p className="text-[15px] leading-relaxed text-muted">
            {email} adresine gönderilen 6 haneli doğrulama kodunu girin.
          </p>
          <KodAlani id="sifre-kod" value={kod} onChange={setKod} onComplete={koduDogrula} disabled={yukleniyor} />
          <Button type="submit" className="w-full" disabled={yukleniyor}>
            Kodu Doğrula
          </Button>
          <button
            type="button"
            onClick={kodGonder}
            disabled={kalan > 0 || yukleniyor}
            className="w-full text-center text-[14px] font-semibold text-navy hover:underline disabled:text-muted disabled:no-underline"
          >
            {kalan > 0 ? `Yeni Kod (${kalan}s)` : "Yeni Kod Gönder"}
          </button>
        </>
      ) : null}

      {adim === "sifre" ? (
        <>
          <p className="text-[15px] leading-relaxed text-muted">Yeni şifrenizi belirleyin.</p>
          <Field
            label="Yeni Şifre"
            id="sifre-yeni"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="En az 6 karakter"
          />
          <Field
            label="Yeni Şifre Tekrar"
            id="sifre-yeni-tekrar"
            name="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Şifrenizi tekrar girin"
          />
          <Button type="submit" className="w-full" disabled={yukleniyor}>
            Şifremi Güncelle
          </Button>
        </>
      ) : null}

      <button type="button" onClick={iptal} className="w-full text-center text-[14px] text-muted hover:text-ink">
        İptal
      </button>
      {adim === "eposta" ? (
        <p className="text-center text-[14px] text-muted">
          <Link href="/giris" className="font-semibold text-navy hover:underline">
            Giriş Yap
          </Link>
        </p>
      ) : null}
    </form>
  );
}
