"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ilanDevamIsaretle } from "@/lib/ilan-taslak";

// Baro bilgilerine düzeltme istenmiş hesap ilan açmaya veya başvurmaya çalışınca
// dogrulama-kontrol "dogrulama-gerekli" olayını yayar; bu pencere onu gösterir.
export function DogrulamaDiyalogu() {
  const [istek, setIstek] = useState(null);

  useEffect(() => {
    const ac = (event) => setIstek(event.detail || null);
    window.addEventListener("dogrulama-gerekli", ac);
    return () => window.removeEventListener("dogrulama-gerekli", ac);
  }, []);

  const ilan = istek?.sebep === "ilan";
  const kapat = () => setIstek(null);

  return (
    <Dialog open={Boolean(istek)} onOpenChange={(acik) => { if (!acik) kapat(); }}>
      <DialogContent className="md:max-w-md">
        <DialogHeader>
          <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-danger-soft text-danger">
            <WarningCircle size={26} aria-hidden="true" />
          </span>
          <DialogTitle className="text-lg font-semibold">Bilgilerinizi düzeltin</DialogTitle>
          <DialogDescription className="text-[15px] leading-relaxed">
            {ilan
              ? "Baro bilgileriniz levha kaydıyla uyuşmadı. İlan açmak için önce bilgilerinizi düzeltin."
              : "Baro bilgileriniz levha kaydıyla uyuşmadı. Göreve başvurmak için önce bilgilerinizi düzeltin."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 sm:flex-row-reverse">
          <Button
            nativeButton={false}
            className="h-11 sm:flex-1"
            render={<Link href={`/app/kimlik?donus=${encodeURIComponent(istek?.donus || "/app")}`} onClick={() => { if (ilan) ilanDevamIsaretle(); kapat(); }} />}
          >
            Bilgilerimi düzelt
          </Button>
          <Button variant="outline" className="h-11 sm:flex-1" onClick={kapat}>Vazgeç</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
