import { Suspense } from "react";
import { CikisButonu } from "@/components/CikisButonu";
import { DurumuYenile } from "@/components/DurumuYenile";
import { durumKapisi } from "@/lib/oturum";

export const metadata = { title: "Doğrulama" };

async function BekliyorKapisi() {
  await durumKapisi("/app/bekliyor");
  return null;
}

export default function BekliyorPage() {
  return (
    <div className="space-y-5">
      <Suspense>
        <BekliyorKapisi />
      </Suspense>
      <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">Kimliğiniz inceleniyor</h1>
      <DurumuYenile />
      <CikisButonu className="inline-flex min-h-11 w-full items-center justify-center rounded-control border border-line bg-surface px-4 text-[15px] font-semibold hover:bg-canvas" />
    </div>
  );
}
