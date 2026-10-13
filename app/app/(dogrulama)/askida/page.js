import { Suspense } from "react";
import { CikisButonu } from "@/components/CikisButonu";
import { durumKapisi } from "@/lib/oturum";

export const metadata = { title: "Hesap" };

async function AskidaIcerik() {
  const { profil } = await durumKapisi("/app/askida");
  const bitis =
    profil?.yasak_bitis
      ? new Date(profil.yasak_bitis).toLocaleString("tr-TR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Istanbul",
        })
      : null;

  return (
    <>
      {profil?.yasak_nedeni ? <p className="text-[15px] leading-relaxed">{profil.yasak_nedeni}</p> : null}
      {bitis ? <p className="text-[15px] text-muted">Bitiş: {bitis}</p> : null}
    </>
  );
}

export default function AskidaPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">Hesabınız askıya alındı</h1>
      <Suspense>
        <AskidaIcerik />
      </Suspense>
      <CikisButonu className="inline-flex min-h-11 w-full items-center justify-center rounded-control bg-danger px-4 text-[15px] font-semibold text-white hover:opacity-90" />
    </div>
  );
}
