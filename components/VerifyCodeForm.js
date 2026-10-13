"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { FormHatasi } from "@/components/FormHatasi";
import { KodAlani } from "@/components/KodAlani";
import { useGeriSayim } from "@/components/useGeriSayim";
import { hataMesaji } from "@/lib/hata-mesaji";
import { createClient } from "@/lib/supabase/client";

function kayitSorgusu(params) {
  const sorgu = new URLSearchParams({
    donus: "1",
    email: params.get("email") || "",
    ad: params.get("ad") || "",
    baro: params.get("baro") || "",
    telefon: params.get("telefon") || "",
    sicil: params.get("sicil") || "",
    kosul: params.get("kosul") || "",
  });
  if (params.get("bilgi") === "1") sorgu.set("bilgi", "1");
  return sorgu.toString();
}

export function VerifyCodeForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const bilgi = params.get("bilgi") === "1";
  const [kod, setKod] = useState("");
  const [hata, setHata] = useState("");
  const [durum, setDurum] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [kalan, sayaciBaslat] = useGeriSayim();
  const dogrulaniyor = useRef(false);

  async function dogrula(deger = kod) {
    if (dogrulaniyor.current || deger.length !== 6) return;
    dogrulaniyor.current = true;
    setYukleniyor(true);
    setHata("");
    try {
      const { error } = await createClient().auth.verifyOtp({ email, token: deger, type: "email" });
      if (error) throw error;
      router.replace("/app");
      router.refresh();
    } catch (error) {
      setKod("");
      setHata(hataMesaji(error));
      dogrulaniyor.current = false;
      setYukleniyor(false);
    }
  }

  async function tekrarGonder() {
    if (kalan > 0) return;
    try {
      const { error } = await createClient().auth.resend({ type: "signup", email });
      if (error) throw error;
      sayaciBaslat();
      setDurum("Yeni kod gönderildi");
    } catch (error) {
      setHata(hataMesaji(error));
    }
  }

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        dogrula();
      }}
    >
      <p className="text-[15px] leading-relaxed text-muted">
        <span className="font-semibold text-ink">{email}</span> adresine 6 haneli bir kod gönderdik.
      </p>
      {bilgi ? (
        <p className="text-[15px] leading-relaxed">E-postanız henüz doğrulanmamış. Yeni bir kod gönderdik.</p>
      ) : null}
      <FormHatasi tur="bilgi">{durum}</FormHatasi>
      <KodAlani id="dogrula-kod" value={kod} onChange={setKod} onComplete={dogrula} error={hata} disabled={yukleniyor} />
      <Button type="submit" className="w-full" disabled={yukleniyor || kod.length !== 6}>
        {yukleniyor ? "Doğrulanıyor…" : "Doğrula"}
      </Button>
      <div className="flex items-center justify-between text-[14px]">
        <button
          type="button"
          onClick={tekrarGonder}
          disabled={kalan > 0}
          className="font-semibold text-navy hover:underline disabled:text-muted disabled:no-underline"
        >
          {kalan > 0 ? `Tekrar gönder (${kalan})` : "Kodu tekrar gönder"}
        </button>
        <Link href={`/uye-ol?${kayitSorgusu(params)}`} className="text-navy hover:underline">
          E-posta adresini değiştir
        </Link>
      </div>
    </form>
  );
}
