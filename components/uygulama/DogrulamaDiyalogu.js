"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IdentificationCard, Hourglass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ONAYSIZ_ILAN_SINIRI } from "@/lib/dogrulama-kontrol";

// dogrulamaKapisi() onaysız hesapta "dogrulama-gerekli" olayını yayar; bu pencere onu gösterir.
export function DogrulamaDiyalogu() {
  const [istek, setIstek] = useState(null);

  useEffect(() => {
    const ac = (event) => setIstek(event.detail || null);
    window.addEventListener("dogrulama-gerekli", ac);
    return () => window.removeEventListener("dogrulama-gerekli", ac);
  }, []);

  const inceleniyor = istek?.durum === "yuklendi";
  const sinir = istek?.sebep === "sinir";
  const ilan = istek?.sebep === "ilan";
  const kapat = () => setIstek(null);

  let aciklama;
  if (sinir) {
    aciklama = inceleniyor
      ? `Kimliğiniz onaylanana kadar aynı anda en fazla ${ONAYSIZ_ILAN_SINIRI} açık ilan verebilirsiniz. Onaylandığında sınır kalkar.`
      : `Kimliğiniz onaylanana kadar aynı anda en fazla ${ONAYSIZ_ILAN_SINIRI} açık ilan verebilirsiniz. Daha fazlası için avukatlık kimlik kartınızı yükleyin.`;
  } else if (ilan) {
    aciklama = "İlan açmak için avukatlık kimlik kartınızı yeniden yüklemeniz gerekir. Kartınız yalnızca avukatlık sıfatınızı doğrulamak için incelenir.";
  } else {
    aciklama = inceleniyor
      ? "Kimlik kartınız onaylandığında göreve başvurabilirsiniz."
      : "Göreve başvurmak için avukatlık kimlik kartınızı yüklemeniz gerekir. Kartınız yalnızca avukatlık sıfatınızı doğrulamak için incelenir.";
  }

  return (
    <Dialog open={Boolean(istek)} onOpenChange={(acik) => { if (!acik) kapat(); }}>
      <DialogContent className="md:max-w-md">
        <DialogHeader>
          <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-navy/10 text-navy">
            {inceleniyor ? <Hourglass size={26} aria-hidden="true" /> : <IdentificationCard size={26} aria-hidden="true" />}
          </span>
          <DialogTitle className="text-lg font-semibold">
            {inceleniyor ? "Kimliğiniz inceleniyor" : "Hesabınızı doğrulayın"}
          </DialogTitle>
          <DialogDescription className="text-[15px] leading-relaxed">
            {aciklama}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 sm:flex-row-reverse">
          {inceleniyor ? (
            <Button className="h-11 sm:flex-1" onClick={kapat}>Tamam</Button>
          ) : (
            <>
              <Button
                nativeButton={false}
                className="h-11 sm:flex-1"
                render={<Link href={`/app/kimlik?donus=${encodeURIComponent(istek?.donus || "/app")}`} onClick={kapat} />}
              >
                Kimlik kartını yükle
              </Button>
              <Button variant="outline" className="h-11 sm:flex-1" onClick={kapat}>Vazgeç</Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
