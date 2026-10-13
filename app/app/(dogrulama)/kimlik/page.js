import { Suspense } from "react";
import { KimlikYukleme } from "@/components/KimlikYukleme";
import { durumKapisi } from "@/lib/oturum";

export const metadata = { title: "Doğrulama" };

async function KimlikKapisi() {
  const { profil } = await durumKapisi("/app/kimlik");
  return <KimlikYukleme durum={profil?.dogrulama_durumu} redNedeni={profil?.red_nedeni} />;
}

export default function KimlikPage() {
  return (
    <Suspense>
      <KimlikKapisi />
    </Suspense>
  );
}
