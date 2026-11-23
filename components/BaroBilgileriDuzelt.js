"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WarningCircle } from "@phosphor-icons/react";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { FormHatasi } from "@/components/FormHatasi";
import { hataMesaji } from "@/lib/hata-mesaji";
import { createClient } from "@/lib/supabase/client";

// Kimlik kartı istenmez. Yönetim baro bilgilerini levhadan kontrol eder; uyuşmazsa
// düzeltme ister (dogrulama_durumu = 'reddedildi'). Kullanıcı ad soyad, baro ve TBB sicil
// numarasını burada düzeltip yeniden gönderir; gönderince hesap yeniden kontrol sırasına girer.

function tarihYaz(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  });
}

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

export function BaroBilgileriDuzelt({ profil, donus = "/app" }) {
  const router = useRouter();
  const barolar = useBarolar();
  const [adSoyad, setAdSoyad] = useState(profil?.ad_soyad || "");
  const [baro, setBaro] = useState(profil?.baro || "");
  const [sicil, setSicil] = useState(profil?.tbb_sicil || "");
  const [hatalar, setHatalar] = useState({});
  const [hata, setHata] = useState("");
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const kisaSicil = sicil.trim().length > 0 && sicil.trim().length <= 4;

  async function gonder(event) {
    event.preventDefault();
    const yeni = {};
    if (!adSoyad.trim()) yeni.adSoyad = "Ad Soyad gerekli";
    if (!baro) yeni.baro = "Baro seçimi gerekli";
    if (!sicil.trim()) yeni.sicil = "TBB Sicil numarası gerekli";
    setHatalar(yeni);
    setHata("");
    if (Object.keys(yeni).length) return;

    setGonderiliyor(true);
    try {
      const { error } = await createClient().rpc("bilgilerimi_duzelt", {
        p_ad_soyad: adSoyad.trim(),
        p_baro: baro,
        p_tbb_sicil: sicil.trim(),
      });
      if (error) throw error;
      router.replace(donus);
      router.refresh();
    } catch (error) {
      setHata(hataMesaji(error));
      setGonderiliyor(false);
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">Bilgilerinizi düzeltin</h1>

      <div role="alert" className="flex gap-3 rounded-card border border-danger/20 bg-danger-soft p-4">
        <WarningCircle size={22} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-[15px] font-semibold">Baro bilgileriniz levha kaydıyla uyuşmadı</p>
          {profil?.red_nedeni ? <p className="text-[14px] leading-relaxed">{profil.red_nedeni}</p> : null}
          <p className="text-[14px] font-semibold leading-relaxed">
            {profil?.revize_son_tarih
              ? `${tarihYaz(profil.revize_son_tarih)} tarihine kadar düzeltilmezse hesabınız kapatılır.`
              : "Bilgileriniz düzeltilene kadar ilan açamaz ve göreve başvuramazsınız."}
          </p>
        </div>
      </div>

      <form noValidate onSubmit={gonder} className="space-y-5">
        <FormHatasi>{hata}</FormHatasi>
        <Field
          label="Ad Soyad"
          id="duzelt-ad"
          autoComplete="name"
          placeholder="Baro levhasındaki adınız ve soyadınız"
          value={adSoyad}
          onChange={(e) => setAdSoyad(e.target.value)}
          error={hatalar.adSoyad}
        />

        <div>
          <label htmlFor="duzelt-baro" className="mb-1.5 block text-[14px] font-medium">
            Baro
          </label>
          <select
            id="duzelt-baro"
            value={baro}
            onChange={(e) => setBaro(e.target.value)}
            disabled={!barolar.length}
            aria-invalid={hatalar.baro ? true : undefined}
            aria-describedby={hatalar.baro ? "duzelt-baro-hata" : undefined}
            className="control"
          >
            <option value="" disabled>
              {barolar.length ? "Baro seçin" : "Barolar yükleniyor..."}
            </option>
            {barolar.map((b) => (
              <option key={b.kod} value={b.ad}>
                {b.ad}
              </option>
            ))}
          </select>
          {hatalar.baro ? (
            <p id="duzelt-baro-hata" className="mt-1.5 text-[13px] text-danger">
              {hatalar.baro}
            </p>
          ) : null}
        </div>

        <div>
          <Field
            label="TBB Sicil Numarası"
            id="duzelt-sicil"
            inputMode="numeric"
            placeholder="Sicil numaranız"
            value={sicil}
            onChange={(e) => setSicil(e.target.value.replace(/\D/g, ""))}
            error={hatalar.sicil}
          />
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
            TBB sicil numarası, baronuzun verdiği sicil numarasından farklıdır.
          </p>
          {kisaSicil ? (
            <p role="status" className="mt-1.5 text-[13px] font-medium leading-relaxed text-[#9A6700]">
              Bu numara baro sicil numaranız olabilir. TBB sicil numaranızı kontrol edin.
            </p>
          ) : null}
        </div>

        <Button type="submit" disabled={gonderiliyor} className="w-full">
          {gonderiliyor ? "Gönderiliyor..." : "Bilgilerimi gönder"}
        </Button>
      </form>
    </div>
  );
}
