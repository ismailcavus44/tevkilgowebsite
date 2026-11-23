import { Suspense } from "react";
import { redirect } from "next/navigation";
import { BaroBilgileriDuzelt } from "@/components/BaroBilgileriDuzelt";
import { guvenliDonus } from "@/lib/donus";
import { oturumDurumu } from "@/lib/oturum";

export const metadata = { title: "Bilgilerinizi düzeltin" };

// Kimlik kartı istenmez. Bu sayfa yalnızca baro bilgilerine düzeltme istenmiş hesaba açılır;
// diğer herkes geldiği sayfaya döner.
async function DuzeltmeKapisi({ searchParams }) {
  const donus = guvenliDonus((await searchParams).donus);
  const { rota, profil } = await oturumDurumu();
  if (rota === "/app") redirect(donus);
  if (rota !== "/app/kimlik") redirect(rota);
  return <BaroBilgileriDuzelt profil={profil} donus={donus} />;
}

export default function KimlikPage({ searchParams }) {
  return (
    <Suspense>
      <DuzeltmeKapisi searchParams={searchParams} />
    </Suspense>
  );
}
