"use client";

import { useSyncExternalStore } from "react";

// Reklam/ölçüm çerezleri için açık rıza kaydı (yalnızca bu tarayıcıda tutulur).
// Değer: "kabul" | "red" | null (henüz seçim yapılmadı).
// Metin değişip yeniden onay gerektiğinde SURUM artırılır; eski kayıtlar yok sayılır.
const ANAHTAR = "tevkilgo-cerez-onay";
const SURUM = 1;
const OLAY = "tevkilgo-cerez-onay";
export const BANDI_AC_OLAYI = "tevkilgo-cerez-bandi-ac";

function oku() {
  try {
    const kayit = JSON.parse(localStorage.getItem(ANAHTAR) || "null");
    if (kayit?.surum === SURUM && (kayit.durum === "kabul" || kayit.durum === "red")) {
      return kayit.durum;
    }
  } catch {
    // Gizli sekme veya engellenmiş depolama: seçim yok sayılır, çerez yüklenmez.
  }
  return null;
}

function abone(geriCagir) {
  window.addEventListener(OLAY, geriCagir);
  window.addEventListener("storage", geriCagir);
  return () => {
    window.removeEventListener(OLAY, geriCagir);
    window.removeEventListener("storage", geriCagir);
  };
}

export function cerezOnayiKaydet(durum) {
  const onceki = oku();
  try {
    localStorage.setItem(ANAHTAR, JSON.stringify({ durum, surum: SURUM, tarih: new Date().toISOString() }));
  } catch {
    // Depolama yoksa seçim yalnızca bu sayfa için geçerli olur.
  }
  window.dispatchEvent(new Event(OLAY));
  // Daha önce yüklenmiş reklam etiketleri sayfadan sökülemez; rıza geri alınınca sayfayı yenile.
  if (onceki === "kabul" && durum === "red") window.location.reload();
}

// Sunucuda ve ilk çizimde null döner; böylece rıza okunmadan hiçbir etiket yüklenmez.
export function useCerezOnayi() {
  return useSyncExternalStore(abone, oku, () => null);
}

export function cerezBandiniAc() {
  window.dispatchEvent(new Event(BANDI_AC_OLAYI));
}
