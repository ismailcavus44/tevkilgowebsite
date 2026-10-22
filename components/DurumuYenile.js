"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

export function DurumuYenile() {
  const router = useRouter();

  // Sayfa açıkken durum 5 saniyede bir sorulur; onay gelince sunucu yönlendirir.
  useEffect(() => {
    const zaman = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(zaman);
  }, [router]);

  return (
    <Button type="button" className="w-full" onClick={() => router.refresh()}>
      Durumu Yenile
    </Button>
  );
}
