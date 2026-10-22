import { Suspense } from "react";
import { redirect } from "next/navigation";
import { KimlikYukleme } from "@/components/KimlikYukleme";
import { guvenliDonus } from "@/lib/donus";
import { oturumDurumu } from "@/lib/oturum";

export const metadata = { title: "Doğrulama" };

async function KimlikKapisi({ searchParams }) {
  const donus = guvenliDonus((await searchParams).donus);
  const { rota, profil } = await oturumDurumu();
  if (rota === "/app") redirect(donus);
  if (rota === "/app/bekliyor") redirect(`/app/bekliyor?donus=${encodeURIComponent(donus)}`);
  if (rota !== "/app/kimlik") redirect(rota);
  return <KimlikYukleme durum={profil?.dogrulama_durumu} redNedeni={profil?.red_nedeni} donus={donus} />;
}

export default function KimlikPage({ searchParams }) {
  return (
    <Suspense>
      <KimlikKapisi searchParams={searchParams} />
    </Suspense>
  );
}
