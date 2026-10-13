"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CaretRight, Check, IdentificationCard, X } from "@phosphor-icons/react";
import { Button } from "@/components/Button";
import { CikisButonu } from "@/components/CikisButonu";
import { FormHatasi } from "@/components/FormHatasi";
import { createClient } from "@/lib/supabase/client";

const AYRINTI = [
  ["Kartınız kimlere açık", "Sadece doğrulamayı yapan yetkili. Herkese kapalı bir depolama alanında tutulur, süreli bağlantıyla görüntülenir."],
  ["Ne kadar saklanır", "Kartınız, doğrulama onaylandığında veya reddedildiğinde kalıcı olarak silinir. Yalnızca doğrulamanın tarihi ve sonucu saklanır."],
  ["Kartı nasıl kapatırım", "Fotoğrafı çekmeden önce ilgili alanları bir kâğıtla örtebilir veya fotoğrafı yüklemeden önce düzenleyebilirsiniz."],
];

const KABUL = "image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif";
const AZAMI_BOYUT = 10 * 1024 * 1024;
const AZAMI_KENAR = 2000;

// Mobil quality 0.8 JPEG yükler. Web aynı biçimi üretir; uzun kenar 2000 pikseli geçmez.
async function jpegeCevir(dosya) {
  const url = URL.createObjectURL(dosya);
  try {
    const img = new window.Image();
    img.src = url;
    await img.decode();
    const uzun = Math.max(img.naturalWidth, img.naturalHeight);
    const oran = uzun > AZAMI_KENAR ? AZAMI_KENAR / uzun : 1;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * oran);
    canvas.height = Math.round(img.naturalHeight * oran);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8));
    if (!blob) throw new Error();
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function KimlikYukleme({ durum, redNedeni }) {
  const router = useRouter();
  const dialogRef = useRef(null);
  const [kartBanaAit, setKartBanaAit] = useState(false);
  const [alanlariKapattim, setAlanlariKapattim] = useState(false);
  const [dosya, setDosya] = useState(null);
  const [onizleme, setOnizleme] = useState("");
  const [onizlemeHatasi, setOnizlemeHatasi] = useState(false);
  const [hata, setHata] = useState("");
  const [uploading, setUploading] = useState(false);
  const beyanTamam = kartBanaAit && alanlariKapattim;

  useEffect(() => () => onizleme && URL.revokeObjectURL(onizleme), [onizleme]);

  function dosyaSec(secilen) {
    setHata("");
    if (secilen && secilen.size > AZAMI_BOYUT) {
      setDosya(null);
      setOnizleme("");
      setHata("Dosya 10 MB'den küçük olmalı.");
      return;
    }
    setDosya(secilen);
    setOnizleme(secilen ? URL.createObjectURL(secilen) : "");
    setOnizlemeHatasi(false);
  }

  async function yukle() {
    if (!dosya) return;
    setHata("");
    if (dosya.size > AZAMI_BOYUT) {
      setHata("Dosya 10 MB'den küçük olmalı.");
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Oturum gerekli");
      let bytes;
      try {
        bytes = await jpegeCevir(dosya);
      } catch {
        throw new Error("Bu görsel tarayıcınızda açılamadı. Lütfen JPG veya PNG dosyası seçin.");
      }
      const path = `${user.id}/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("kimlikler")
        .upload(path, bytes, { contentType: "image/jpeg" });
      if (uploadError) throw uploadError;
      const { error: rpcError } = await supabase.rpc("kimlik_yuklendi");
      if (rpcError) throw rpcError;
      router.replace("/app/bekliyor");
      router.refresh();
    } catch (error) {
      setHata(error.message || "Kimlik yüklenemedi");
      setUploading(false);
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">Doğrulama</h1>

      {durum === "reddedildi" && redNedeni ? (
        <p role="alert" className="rounded-lg border border-danger/20 bg-danger-soft px-3.5 py-3 text-[14px] text-danger">
          {redNedeni}
        </p>
      ) : null}

      <div className="flex gap-3 rounded-card border border-line bg-surface p-4">
        <IdentificationCard size={22} className="mt-0.5 shrink-0 text-navy" aria-hidden="true" />
        <div>
          <p className="text-[15px] font-semibold">Neden kimlik kartı istiyoruz?</p>
          <p className="mt-1 text-[14px] leading-relaxed text-muted">
            TevkilGO&apos;yu yalnızca avukatlar kullanabilir. Kartınız sadece avukatlık sıfatınızı doğrulamak için
            incelenir; hiçbir kullanıcıya gösterilmez.
          </p>
        </div>
      </div>

      <div className="space-y-1.5 text-[14px] leading-relaxed">
        <p>Görünmesi gerekenler: ad soyad, fotoğraf, baro, sicil numarası</p>
        <p>Kapatmanız gerekenler: T.C. kimlik numarası, kan grubu</p>
      </div>

      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="flex w-full items-center justify-between border-y border-line py-3 text-[15px] font-medium text-navy"
      >
        Ayrıntılı bilgi
        <CaretRight size={18} aria-hidden="true" />
      </button>

      <div className="space-y-3">
        <BeyanKutusu isaretli={kartBanaAit} onChange={setKartBanaAit} metin="Yüklediğim kimlik kartı bana aittir ve bilgileri günceldir." />
        <BeyanKutusu isaretli={alanlariKapattim} onChange={setAlanlariKapattim} metin="T.C. kimlik numarası ve kan grubu alanlarını kapattım." />
      </div>

      <div>
        <label
          className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-card border border-dashed border-line bg-surface px-4 py-6 text-center text-[14px] ${
            beyanTamam ? "hover:bg-canvas" : "pointer-events-none opacity-60"
          }`}
        >
          <span className="font-semibold text-navy">{dosya ? "Başka bir görsel seç" : "Kimlik kartı görselini seç"}</span>
          <span className="text-[13px] text-muted">JPG, PNG veya HEIC</span>
          <input
            type="file"
            accept={KABUL}
            disabled={!beyanTamam || uploading}
            className="sr-only"
            onChange={(e) => dosyaSec(e.target.files?.[0] || null)}
          />
        </label>
        {dosya ? (
          <div className="mt-3 overflow-hidden rounded-card border border-line bg-surface">
            {onizleme && !onizlemeHatasi ? (
              <Image
                src={onizleme}
                alt="Seçilen kimlik kartı önizlemesi"
                width={480}
                height={300}
                unoptimized
                onError={() => setOnizlemeHatasi(true)}
                className="h-auto max-h-80 w-full object-contain"
              />
            ) : (
              <p className="px-4 py-6 text-center text-[13px] text-muted">Önizleme gösterilemiyor.</p>
            )}
            <p className="truncate border-t border-line px-4 py-2 text-[13px] text-muted">{dosya.name}</p>
          </div>
        ) : null}
      </div>

      <FormHatasi>{hata}</FormHatasi>

      <Button type="button" className="w-full" onClick={yukle} disabled={!beyanTamam || !dosya || uploading}>
        {uploading ? "Yükleniyor…" : "Kimlik Kartını Yükle"}
      </Button>
      <CikisButonu className="inline-flex min-h-11 w-full items-center justify-center rounded-control border border-line bg-surface px-4 text-[15px] font-semibold hover:bg-canvas" />
      <Link href="/app/sss" className="block text-center text-[15px] font-medium text-navy hover:underline">
        Sık Sorulan Sorular
      </Link>

      <dialog
        ref={dialogRef}
        aria-labelledby="ayrinti-baslik"
        className="m-auto w-[min(92vw,480px)] rounded-card bg-surface p-0 backdrop:bg-ink/40"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current.close();
        }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id="ayrinti-baslik" className="text-[18px] font-semibold">
              Ayrıntılı bilgi
            </h2>
            <button type="button" aria-label="Kapat" onClick={() => dialogRef.current?.close()} className="text-muted hover:text-ink">
              <X size={20} />
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {AYRINTI.map(([baslik, metin]) => (
              <div key={baslik}>
                <p className="text-[15px] font-semibold">{baslik}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-muted">{metin}</p>
              </div>
            ))}
            <Link href="/kvkk" target="_blank" className="inline-block text-[14px] font-medium text-navy underline underline-offset-2">
              KVKK Aydınlatma Metni
            </Link>
          </div>
        </div>
      </dialog>
    </div>
  );
}

function BeyanKutusu({ isaretli, onChange, metin }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed">
      <input type="checkbox" checked={isaretli} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded border peer-focus-visible:ring-2 peer-focus-visible:ring-navy/40 ${
          isaretli ? "border-navy bg-navy text-white" : "border-line bg-surface"
        }`}
      >
        {isaretli ? <Check size={14} weight="bold" /> : null}
      </span>
      <span>{metin}</span>
    </label>
  );
}
