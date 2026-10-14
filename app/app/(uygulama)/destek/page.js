import { Suspense } from "react";
import { Destek } from "@/components/uygulama/Destek";

export const metadata = { title: "Destek" };

async function DestekIcerik({ searchParams }) {
  const sorgu = await searchParams;
  return <Destek baslangicAcik={sorgu?.yeni === "1"} />;
}

export default function DestekPage({ searchParams }) {
  return (
    <Suspense fallback={null}>
      <DestekIcerik searchParams={searchParams} />
    </Suspense>
  );
}
